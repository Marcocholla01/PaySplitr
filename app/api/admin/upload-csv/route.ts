import { type NextRequest, NextResponse } from "next/server"

import { getAuthSession } from "@/lib/auth/utils"
import { emailTemplates, sendEmail } from "@/lib/email"
import { createNotification, logEmail } from "@/lib/notifications"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const paymentDate = formData.get("date") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!paymentDate) {
      return NextResponse.json({ error: "Payment date is required" }, { status: 400 })
    }

    const csvText = await file.text()
    const lines = csvText.split("\n").filter((line) => line.trim())

    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV file must contain header and data rows" }, { status: 400 })
    }

    // Parse CSV (assuming format: recipient_name, account_number, amount, bank_code, reference)
    const records = lines.slice(1).map((line, index) => {
      const [recipient_name, account_number, amount, bank_code, reference] = line
        .split(",")
        .map((field) => field.trim())
      return {
        recipient_name,
        account_number,
        amount: Number.parseFloat(amount) || 0,
        bank_code,
        reference,
        payment_date: paymentDate,
        upload_date: new Date().toISOString(),
        status: "pending",
      }
    })

    if (records.length === 0) {
      return NextResponse.json({ error: "No valid records found in CSV" }, { status: 400 })
    }

    const supabase = createClient()

    // Check if records already exist for this date
    const { data: existingRecords, error: checkError } = await supabase
      .from("payment_records")
      .select("id")
      .eq("payment_date", paymentDate)
      .limit(1)

    if (checkError) {
      console.error("Error checking existing records:", checkError)
      return NextResponse.json({ error: "Failed to check existing records" }, { status: 500 })
    }

    // If records exist for this date, update them instead of creating new ones
    if (existingRecords && existingRecords.length > 0) {
      // Clear existing records for this specific date
      await supabase.from("payment_records").delete().eq("payment_date", paymentDate)

      // Clear existing assignments for this date
      await supabase.from("record_assignments").delete().eq("payment_date", paymentDate)
    }

    // Insert new records
    const { error: insertError } = await supabase.from("payment_records").insert(records)

    if (insertError) {
      console.error("Database insert error:", insertError)
      return NextResponse.json({ error: "Failed to save records" }, { status: 500 })
    }

    // Get all distributors
    const { data: distributors, error: distributorsError } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("role", "distributor")

    if (distributorsError || !distributors || distributors.length === 0) {
      return NextResponse.json({ error: "No distributors found" }, { status: 500 })
    }

    // Get the inserted records for this specific date
    const { data: insertedRecords, error: fetchError } = await supabase
      .from("payment_records")
      .select("*")
      .eq("payment_date", paymentDate)

    if (fetchError || !insertedRecords) {
      return NextResponse.json({ error: "Failed to fetch inserted records" }, { status: 500 })
    }

    // Distribute records to distributors (evenly)
    const recordsPerDistributor = Math.ceil(insertedRecords.length / distributors.length)
    const assignments = []
    const distributorAssignments = new Map()

    for (let i = 0; i < distributors.length && i * recordsPerDistributor < insertedRecords.length; i++) {
      const startIndex = i * recordsPerDistributor
      const endIndex = Math.min(startIndex + recordsPerDistributor, insertedRecords.length)
      const distributorRecords = insertedRecords.slice(startIndex, endIndex)

      distributorAssignments.set(distributors[i].id, {
        distributor: distributors[i],
        records: distributorRecords,
      })

      for (const record of distributorRecords) {
        assignments.push({
          record_id: record.id,
          distributor_id: distributors[i].id,
          assigned_date: new Date().toISOString(),
          payment_date: paymentDate,
        })
      }
    }

    // Insert new assignments
    const { error: assignmentError } = await supabase.from("record_assignments").insert(assignments)

    if (assignmentError) {
      console.error("Assignment error:", assignmentError)
      return NextResponse.json({ error: "Failed to assign records" }, { status: 500 })
    }

    // Send email notifications to distributors
    for (const [distributorId, assignment] of distributorAssignments) {
      const { distributor, records: distributorRecords } = assignment

      try {
        // Create in-app notification
        await createNotification({
          userId: distributorId,
          type: "task_assignment",
          title: `New Tasks Assigned - ${paymentDate}`,
          message: `You have been assigned ${distributorRecords.length} payment tasks for ${paymentDate}. Total amount: $${distributorRecords.reduce((sum: any, r: { amount: any }) => sum + r.amount, 0).toLocaleString()}`,
          data: {
            taskCount: distributorRecords.length,
            paymentDate,
            totalAmount: distributorRecords.reduce((sum: any, r: { amount: any }) => sum + r.amount, 0),
          },
        })

        // Send email notification
        const emailTemplate = emailTemplates.distributorTaskAssignment(
          distributor.name,
          distributorRecords.length,
          paymentDate,
          distributorRecords,
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
          type: "task_assignment",
          status: emailResult.success ? "sent" : "failed",
          messageId: emailResult.messageId,
          errorMessage: emailResult.error,
        })

        console.log(`Notification sent to ${distributor.name} (${distributor.email})`)
      } catch (error) {
        console.error(`Failed to send notification to ${distributor.name}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      recordsProcessed: records.length,
      distributorsAssigned: distributors.length,
      paymentDate: paymentDate,
      notificationsSent: distributorAssignments.size,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
