import { getAuthSession } from "@/lib/auth/utils"
import { createClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

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
      .select("id, email")
      .eq("role", "distributor")

    if (distributorsError || !distributors || distributors.length === 0) {
      return NextResponse.json({ error: "No distributors found" }, { status: 500 })
    }

    // Get the inserted records for this specific date
    const { data: insertedRecords, error: fetchError } = await supabase
      .from("payment_records")
      .select("id")
      .eq("payment_date", paymentDate)

    if (fetchError || !insertedRecords) {
      return NextResponse.json({ error: "Failed to fetch inserted records" }, { status: 500 })
    }

    // Distribute records to distributors (evenly)
    const recordsPerDistributor = Math.ceil(insertedRecords.length / distributors.length)
    const assignments = []

    for (let i = 0; i < distributors.length && i * recordsPerDistributor < insertedRecords.length; i++) {
      const startIndex = i * recordsPerDistributor
      const endIndex = Math.min(startIndex + recordsPerDistributor, insertedRecords.length)
      const distributorRecords = insertedRecords.slice(startIndex, endIndex)

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

    return NextResponse.json({
      success: true,
      recordsProcessed: records.length,
      distributorsAssigned: distributors.length,
      paymentDate: paymentDate,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
