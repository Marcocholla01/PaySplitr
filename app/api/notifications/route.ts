import { NextResponse } from "next/server"

import { getAuthSession } from "@/lib/auth/utils"
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/lib/notifications"


export async function GET() {
  try {
    const session = await getAuthSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await getNotifications(session.user.id)

    if (!result.success) {
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Notifications API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, notificationId } = await request.json()

    if (action === "mark_read" && notificationId) {
      const result = await markNotificationAsRead(notificationId)
      if (!result.success) {
        return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    if (action === "mark_all_read") {
      const result = await markAllNotificationsAsRead(session.user.id)
      if (!result.success) {
        return NextResponse.json({ error: "Failed to mark all notifications as read" }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Notifications PATCH API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
