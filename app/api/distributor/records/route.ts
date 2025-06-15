import { getAuthSession } from "@/lib/auth/utils"
import { createClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getAuthSession()

    if (!session || session.user.role !== "distributor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()

    // Get records assigned to this distributor
    const { data: records, error } = await supabase
      .from("record_assignments")
      .select(`
        assigned_date,
        payment_date,
        payment_records (
          id,
          recipient_name,
          account_number,
          amount,
          bank_code,
          reference,
          status,
          payment_date,
          upload_date
        )
      `)
      .eq("distributor_id", session.user.id)
      .order("assigned_date", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 })
    }

    // Transform the data
    const transformedRecords =
      records?.map((assignment) => ({
        id: assignment.payment_records.id,
        recipient_name: assignment.payment_records.recipient_name,
        account_number: assignment.payment_records.account_number,
        amount: assignment.payment_records.amount,
        bank_code: assignment.payment_records.bank_code,
        reference: assignment.payment_records.reference,
        status: assignment.payment_records.status,
        assigned_date: assignment.assigned_date,
        payment_date: assignment.payment_records.payment_date,
      })) || []

    return NextResponse.json(transformedRecords)
  } catch (error) {
    console.error("Records error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
