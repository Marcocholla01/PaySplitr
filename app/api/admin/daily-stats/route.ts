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

    // Get daily statistics grouped by payment_date
    const { data: dailyData, error } = await supabase
      .from("payment_records")
      .select("payment_date, status, amount")
      .order("payment_date", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch daily stats" }, { status: 500 })
    }

    // Group by date and calculate stats
    const dailyStats = dailyData?.reduce((acc: any, record) => {
      const date = record.payment_date
      if (!acc[date]) {
        acc[date] = {
          date,
          totalRecords: 0,
          completedRecords: 0,
          totalAmount: 0,
        }
      }

      acc[date].totalRecords++
      acc[date].totalAmount += record.amount

      if (record.status === "completed") {
        acc[date].completedRecords++
      }

      return acc
    }, {})

    const result = Object.values(dailyStats || {}).sort(
      (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Daily stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
