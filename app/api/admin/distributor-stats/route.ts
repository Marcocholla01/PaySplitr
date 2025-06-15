import { getAuthSession } from "@/lib/auth/utils"
import { createClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getAuthSession()

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()

    // Get distributor statistics
    const { data: distributorData, error } = await supabase.from("record_assignments").select(`
        distributor_id,
        users!inner(id, name, email),
        payment_records!inner(id, status, amount)
      `)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch distributor stats" }, { status: 500 })
    }

    // Group by distributor and calculate stats
    const distributorStats = distributorData?.reduce((acc: any, assignment) => {
      const distributorId = assignment.distributor_id
      const user = assignment.users
      const record = assignment.payment_records

      if (!acc[distributorId]) {
        acc[distributorId] = {
          id: distributorId,
          name: user.name,
          email: user.email,
          assignedRecords: 0,
          completedRecords: 0,
          totalAmount: 0,
          completionRate: 0,
        }
      }

      acc[distributorId].assignedRecords++
      acc[distributorId].totalAmount += record.amount

      if (record.status === "completed") {
        acc[distributorId].completedRecords++
      }

      return acc
    }, {})

    // Calculate completion rates
    Object.values(distributorStats || {}).forEach((distributor: any) => {
      distributor.completionRate =
        distributor.assignedRecords > 0 ? (distributor.completedRecords / distributor.assignedRecords) * 100 : 0
    })

    const result = Object.values(distributorStats || {}).sort((a: any, b: any) => b.completionRate - a.completionRate)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Distributor stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
