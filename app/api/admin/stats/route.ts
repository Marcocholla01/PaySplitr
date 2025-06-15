import { NextResponse } from "next/server"

import { getAuthSession } from "@/lib/auth/utils"
import { createClient } from "@/lib/supabase"

export async function GET() {
  try {
    const session = await getAuthSession()

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()

    // Get total records
    const { count: totalRecords } = await supabase.from("payment_records").select("*", { count: "exact", head: true })

    // Get distributed records
    const { count: distributedRecords } = await supabase
      .from("record_assignments")
      .select("*", { count: "exact", head: true })

    // Get pending records
    const { count: pendingRecords } = await supabase
      .from("payment_records")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    // Get completed records
    const { count: completedRecords } = await supabase
      .from("payment_records")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed")

    // Get total amount
    const { data: amountData } = await supabase.from("payment_records").select("amount")

    const totalAmount = amountData?.reduce((sum, record) => sum + record.amount, 0) || 0

    // Get last upload date
    const { data: lastUploadData } = await supabase
      .from("payment_records")
      .select("upload_date")
      .order("upload_date", { ascending: false })
      .limit(1)

    // Calculate completion rate
    const completionRate = totalRecords && totalRecords > 0 ? ((completedRecords || 0) / totalRecords) * 100 : 0

    return NextResponse.json({
      totalRecords: totalRecords || 0,
      distributedRecords: distributedRecords || 0,
      pendingRecords: pendingRecords || 0,
      completedRecords: completedRecords || 0,
      totalAmount,
      completionRate,
      lastUpload: lastUploadData?.[0]?.upload_date || null,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
