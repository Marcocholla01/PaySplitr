import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { getAuthSession } from "@/lib/auth/utils";

export async function POST(request: NextRequest) {
  try {
      const session = await getAuthSession();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
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
        upload_date: new Date().toISOString(),
        status: "pending",
      }
    })

    if (records.length === 0) {
      return NextResponse.json({ error: "No valid records found in CSV" }, { status: 400 })
    }

    const supabase = createClient()

    // Clear existing records for today
    await supabase.from("payment_records").delete().gte("upload_date", new Date().toISOString().split("T")[0])

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

    // Get the inserted records
    const { data: insertedRecords, error: fetchError } = await supabase
      .from("payment_records")
      .select("id")
      .gte("upload_date", new Date().toISOString().split("T")[0])

    if (fetchError || !insertedRecords) {
      return NextResponse.json({ error: "Failed to fetch inserted records" }, { status: 500 })
    }

    // Distribute records to distributors (5 each)
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
        })
      }
    }

    // Clear existing assignments for today
    await supabase.from("record_assignments").delete().gte("assigned_date", new Date().toISOString().split("T")[0])

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
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
