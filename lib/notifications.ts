import { createClient } from "@/lib/supabase"

export interface NotificationData {
  userId: string
  type: "task_assignment" | "task_completion" | "task_reminder" | "system_alert"
  title: string
  message: string
  data?: any
}

export async function createNotification(notificationData: NotificationData) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("notifications").insert({
      user_id: notificationData.userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      data: notificationData.data,
    })

    if (error) {
      console.error("Failed to create notification:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error creating notification:", error)
    return { success: false, error }
  }
}

export async function getNotifications(userId: string, limit = 50) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Failed to fetch notifications:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return { success: false, error }
  }
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true, updated_at: new Date().toISOString() })
      .eq("id", notificationId)

    if (error) {
      console.error("Failed to mark notification as read:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { success: false, error }
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("read", false)

    if (error) {
      console.error("Failed to mark all notifications as read:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return { success: false, error }
  }
}

export async function getUnreadNotificationCount(userId: string) {
  const supabase = createClient()

  try {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false)

    if (error) {
      console.error("Failed to get unread notification count:", error)
      return { success: false, error }
    }

    return { success: true, count: count || 0 }
  } catch (error) {
    console.error("Error getting unread notification count:", error)
    return { success: false, error }
  }
}

export async function logEmail(emailData: {
  recipientEmail: string
  recipientName?: string
  subject: string
  type: string
  status: "sent" | "failed" | "pending"
  messageId?: string
  errorMessage?: string
}) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("email_logs").insert({
      recipient_email: emailData.recipientEmail,
      recipient_name: emailData.recipientName,
      subject: emailData.subject,
      type: emailData.type,
      status: emailData.status,
      message_id: emailData.messageId,
      error_message: emailData.errorMessage,
    })

    if (error) {
      console.error("Failed to log email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error logging email:", error)
    return { success: false, error }
  }
}
