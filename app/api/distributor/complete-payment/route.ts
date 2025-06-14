import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { getAuthSession } from "@/lib/auth/utils";

export async function POST(request: NextRequest) {
  try {
      const session = await getAuthSession();

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
      .select("record_id")
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Complete payment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
