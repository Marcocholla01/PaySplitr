import { emailTemplates, sendEmail } from "@/lib/email"
import { createNotification, logEmail } from "@/lib/notifications"
import { createClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split("T")[0]

    // Get all distributors with incomplete tasks from yesterday
    const { data: incompleteAssignments, error } = await supabase
      .from("record_assignments")
      .select(`
        distributor_id,
        users!inner(id, name, email),
        payment_records!inner(id, recipient_name, account_number, amount, bank_code, status)
      `)
      .eq("payment_date", yesterdayStr)
      .eq("payment_records.status", "pending")

    if (error) {
      console.error("Error fetching incomplete assignments:", error)
      return NextResponse.json({ error: "Failed to fetch incomplete assignments" }, { status: 500 })
    }

    if (!incompleteAssignments || incompleteAssignments.length === 0) {
      return NextResponse.json({ message: "No incomplete tasks found" })
    }

    // Group by distributor
    const distributorIncomplete = new Map()

    for (const assignment of incompleteAssignments) {
      const distributorId = assignment.distributor_id
      if (!distributorIncomplete.has(distributorId)) {
        distributorIncomplete.set(distributorId, {
          distributor: assignment.users,
          records: [],
        })
      }
      distributorIncomplete.get(distributorId).records.push(assignment.payment_records)
    }

    let notificationsSent = 0

    // Send reminders to distributors with incomplete tasks
    for (const [distributorId, data] of distributorIncomplete) {
      const { distributor, records } = data

      try {
        // Create in-app notification
        await createNotification({
          userId: distributorId,
          type: "task_reminder",
          title: `⚠️ Incomplete Tasks from ${yesterdayStr}`,
          message: `You have ${records.length} incomplete tasks from ${yesterdayStr}. Please complete them immediately.`,
          data: {
            incompleteCount: records.length,
            paymentDate: yesterdayStr,
            totalAmount: records.reduce((sum: any, r: { amount: any }) => sum + r.amount, 0),
            isOverdue: true,
          },
        })

        // Send email reminder
        const emailTemplate = emailTemplates.distributorIncompleteReminder(
          distributor.name,
          records.length,
          yesterdayStr,
          records,
        )

        const emailResult = await sendEmail({
          to: distributor.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        })

        // Log email
        await logEmail({
          recipientEmail: distributor.email,
          recipientName: distributor.name,
          subject: emailTemplate.subject,
          type: "task_reminder",
          status: emailResult.success ? "sent" : "failed",
          messageId: emailResult.messageId,
          errorMessage: emailResult.error,
        })

        notificationsSent++
        console.log(
          `Reminder sent to ${distributor.name} (${distributor.email}) for ${records.length} incomplete tasks`,
        )
      } catch (error) {
        console.error(`Failed to send reminder to ${distributor.name}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      distributorsNotified: notificationsSent,
      totalIncompleteRecords: incompleteAssignments.length,
      date: yesterdayStr,
    })
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
