import { NextResponse } from "next/server"

import { getAuthSession } from "@/lib/auth/utils"
import { getUnreadNotificationCount } from "@/lib/notifications"

export async function GET() {
  try {
    const session = await getAuthSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await getUnreadNotificationCount(session.user.id)

    if (!result.success) {
      return NextResponse.json({ error: "Failed to fetch notification count" }, { status: 500 })
    }

    return NextResponse.json({ count: result.count })
  } catch (error) {
    console.error("Notification count API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
