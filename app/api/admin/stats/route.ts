import { getAuthSession } from "@/lib/auth/utils";
import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
      const session = await getAuthSession();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()
    const today = new Date().toISOString().split("T")[0]

    // Get total records for today
    const { count: totalRecords } = await supabase
      .from("payment_records")
      .select("*", { count: "exact", head: true })
      .gte("upload_date", today)

    // Get distributed records
    const { count: distributedRecords } = await supabase
      .from("record_assignments")
      .select("*", { count: "exact", head: true })
      .gte("assigned_date", today)

    // Get pending records
    const { count: pendingRecords } = await supabase
      .from("payment_records")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .gte("upload_date", today)

    // Get completed records
    const { count: completedRecords } = await supabase
      .from("payment_records")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed")
      .gte("upload_date", today)

    // Get last upload date
    const { data: lastUploadData } = await supabase
      .from("payment_records")
      .select("upload_date")
      .order("upload_date", { ascending: false })
      .limit(1)

    return NextResponse.json({
      totalRecords: totalRecords || 0,
      distributedRecords: distributedRecords || 0,
      pendingRecords: pendingRecords || 0,
      completedRecords: completedRecords || 0,
      lastUpload: lastUploadData?.[0]?.upload_date || null,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
