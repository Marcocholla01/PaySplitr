import { type NextRequest, NextResponse } from "next/server"

import { getAuthSession } from "@/lib/auth/utils"
import { emailTemplates, sendEmail } from "@/lib/email"
import { createNotification, logEmail } from "@/lib/notifications"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session || session.user.role !== "distributor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recordId } = await request.json()

    if (!recordId) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Verify the record is assigned to this distributor
    const { data: assignment, error: assignmentError } = await supabase
      .from("record_assignments")
      .select("record_id, payment_date")
      .eq("record_id", recordId)
      .eq("distributor_id", session.user.id)
      .single()

    if (assignmentError || !assignment) {
      return NextResponse.json({ error: "Record not found or not assigned to you" }, { status: 404 })
    }

    // Update the payment record status
    const { error: updateError } = await supabase
      .from("payment_records")
      .update({
        status: "completed",
        completed_date: new Date().toISOString(),
      })
      .eq("id", recordId)

    if (updateError) {
      console.error("Update error:", updateError)
      return NextResponse.json({ error: "Failed to update record" }, { status: 500 })
    }

    // Check if distributor has completed all tasks for this date
    const { data: allAssignments, error: allAssignmentsError } = await supabase
      .from("record_assignments")
      .select(`
        record_id,
        payment_records!inner(id, status)
      `)
      .eq("distributor_id", session.user.id)
      .eq("payment_date", assignment.payment_date)

    if (!allAssignmentsError && allAssignments) {
      const totalTasks = allAssignments.length
      const completedTasks = allAssignments.filter((a) => a.payment_records.status === "completed").length

      // If all tasks are completed, notify admins
      if (completedTasks === totalTasks) {
        // Get all admin users
        const { data: admins, error: adminsError } = await supabase
          .from("users")
          .select("id, email, name")
          .eq("role", "admin")

        if (!adminsError && admins) {
          for (const admin of admins) {
            try {
              // Create in-app notification for admin
              await createNotification({
                userId: admin.id,
                type: "task_completion",
                title: `Tasks Completed - ${session.user.name}`,
                message: `${session.user.name} has completed all ${totalTasks} assigned tasks for ${assignment.payment_date}`,
                data: {
                  distributorId: session.user.id,
                  distributorName: session.user.name,
                  distributorEmail: session.user.email,
                  completedTasks,
                  totalTasks,
                  paymentDate: assignment.payment_date,
                },
              })

              // Send email notification to admin
              const emailTemplate = emailTemplates.adminTaskCompletion(
                session.user.name,
                session.user.email,
                completedTasks,
                totalTasks,
                assignment.payment_date,
              )

              const emailResult = await sendEmail({
                to: admin.email,
                subject: emailTemplate.subject,
                html: emailTemplate.html,
                text: emailTemplate.text,
              })

              // Log email
              await logEmail({
                recipientEmail: admin.email,
                recipientName: admin.name,
                subject: emailTemplate.subject,
                type: "task_completion",
                status: emailResult.success ? "sent" : "failed",
                messageId: emailResult.messageId,
                errorMessage: emailResult.error,
              })

              console.log(`Completion notification sent to admin ${admin.name} (${admin.email})`)
            } catch (error) {
              console.error(`Failed to send completion notification to admin ${admin.name}:`, error)
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Complete payment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
