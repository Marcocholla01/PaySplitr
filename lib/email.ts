import nodemailer from "nodemailer"

// Create reusable transporter object using SMTP transport
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || "smtp.gmail.com",
//   port: Number.parseInt(process.env.SMTP_PORT || "587"),
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// })


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number.parseInt("1025"), // Mailpit default SMTP port
  secure: false, // Mailpit doesn’t use TLS by default
})


export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"PaySplitr System" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      text,
      html,
    })

    console.log("Email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { success: false, error: error.message }
  }
}

// Email Templates
export const emailTemplates = {
  distributorTaskAssignment: (distributorName: string, taskCount: number, date: string, records: any[]) => ({
    subject: `New Payment Tasks Assigned - ${date}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Tasks Assigned</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .task-summary { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
            .task-list { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .task-item { padding: 10px; border-bottom: 1px solid #e2e8f0; }
            .task-item:last-child { border-bottom: none; }
            .amount { font-weight: bold; color: #059669; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
            .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New Payment Tasks Assigned</h1>
              <p>PaySplitr System</p>
            </div>
            <div class="content">
              <h2>Hello ${distributorName},</h2>
              <p>You have been assigned <strong>${taskCount} new payment tasks</strong> for <strong>${date}</strong>.</p>
              
              <div class="task-summary">
                <h3>📊 Task Summary</h3>
                <ul>
                  <li><strong>Total Tasks:</strong> ${taskCount}</li>
                  <li><strong>Date:</strong> ${date}</li>
                  <li><strong>Total Amount:</strong> $${records.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}</li>
                  <li><strong>Status:</strong> Pending</li>
                </ul>
              </div>

              <div class="task-list">
                <h3>💼 Payment Details</h3>
                ${records
                  .slice(0, 5)
                  .map(
                    (record) => `
                  <div class="task-item">
                    <strong>${record.recipient_name}</strong><br>
                    Account: ${record.account_number} | Bank: ${record.bank_code}<br>
                    Amount: <span class="amount">$${record.amount.toLocaleString()}</span>
                  </div>
                `,
                  )
                  .join("")}
                ${records.length > 5 ? `<div class="task-item"><em>... and ${records.length - 5} more tasks</em></div>` : ""}
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/distributor/dashboard" class="btn">
                  View Tasks in Dashboard
                </a>
              </div>

              <p><strong>Important:</strong> Please complete all assigned tasks by end of day. If you encounter any issues, contact support immediately.</p>
            </div>
            <div class="footer">
              <p>© 2024 PaySplitr. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hello ${distributorName},\n\nYou have been assigned ${taskCount} new payment tasks for ${date}.\n\nPlease log in to your dashboard to view and process these tasks.\n\nTotal Amount: $${records.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}\n\nBest regards,\nPaySplitr System`,
  }),

  adminTaskCompletion: (
    distributorName: string,
    distributorEmail: string,
    completedCount: number,
    totalCount: number,
    date: string,
  ) => ({
    subject: `Task Completion Update - ${distributorName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Task Completion Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 8px 8px; }
            .completion-summary { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669; }
            .progress-bar { background: #e2e8f0; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
            .progress-fill { background: #059669; height: 100%; transition: width 0.3s ease; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
            .btn { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Task Completion Update</h1>
              <p>PaySplitr Admin Panel</p>
            </div>
            <div class="content">
              <h2>Task Completion Notification</h2>
              <p><strong>${distributorName}</strong> has completed their assigned tasks for <strong>${date}</strong>.</p>
              
              <div class="completion-summary">
                <h3>📈 Completion Details</h3>
                <ul>
                  <li><strong>Distributor:</strong> ${distributorName} (${distributorEmail})</li>
                  <li><strong>Date:</strong> ${date}</li>
                  <li><strong>Completed:</strong> ${completedCount} of ${totalCount} tasks</li>
                  <li><strong>Completion Rate:</strong> ${((completedCount / totalCount) * 100).toFixed(1)}%</li>
                </ul>
                
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${(completedCount / totalCount) * 100}%"></div>
                </div>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/distributors" class="btn">
                  View Distributor Performance
                </a>
              </div>

              <p><em>This notification was sent because the distributor has completed all assigned tasks for the day.</em></p>
            </div>
            <div class="footer">
              <p>© 2024 PaySplitr. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Task Completion Update\n\n${distributorName} has completed ${completedCount} of ${totalCount} tasks for ${date}.\n\nCompletion Rate: ${((completedCount / totalCount) * 100).toFixed(1)}%\n\nBest regards,\nPaySplitr System`,
  }),

  distributorIncompleteReminder: (
    distributorName: string,
    incompleteCount: number,
    date: string,
    overdueRecords: any[],
  ) => ({
    subject: `⚠️ Incomplete Tasks Reminder - ${date}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Incomplete Tasks Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fef2f2; padding: 30px; border-radius: 0 0 8px 8px; }
            .reminder-summary { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
            .overdue-list { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .overdue-item { padding: 10px; border-bottom: 1px solid #fee2e2; background: #fef2f2; margin: 5px 0; border-radius: 4px; }
            .amount { font-weight: bold; color: #dc2626; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
            .btn { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .urgent { background: #fee2e2; padding: 15px; border-radius: 8px; border: 1px solid #fecaca; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Incomplete Tasks Reminder</h1>
              <p>PaySplitr System</p>
            </div>
            <div class="content">
              <h2>Hello ${distributorName},</h2>
              
              <div class="urgent">
                <h3>🚨 URGENT: Incomplete Tasks Detected</h3>
                <p>You have <strong>${incompleteCount} incomplete tasks</strong> from <strong>${date}</strong> that require immediate attention.</p>
              </div>
              
              <div class="reminder-summary">
                <h3>📋 Overdue Summary</h3>
                <ul>
                  <li><strong>Incomplete Tasks:</strong> ${incompleteCount}</li>
                  <li><strong>Original Date:</strong> ${date}</li>
                  <li><strong>Total Amount:</strong> $${overdueRecords.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}</li>
                  <li><strong>Status:</strong> Overdue</li>
                </ul>
              </div>

              <div class="overdue-list">
                <h3>💼 Incomplete Payment Details</h3>
                ${overdueRecords
                  .slice(0, 5)
                  .map(
                    (record) => `
                  <div class="overdue-item">
                    <strong>${record.recipient_name}</strong><br>
                    Account: ${record.account_number} | Bank: ${record.bank_code}<br>
                    Amount: <span class="amount">$${record.amount.toLocaleString()}</span>
                  </div>
                `,
                  )
                  .join("")}
                ${overdueRecords.length > 5 ? `<div class="overdue-item"><em>... and ${overdueRecords.length - 5} more overdue tasks</em></div>` : ""}
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/distributor/payments/pending" class="btn">
                  Complete Overdue Tasks Now
                </a>
              </div>

              <p><strong>Important:</strong> Please complete these overdue tasks immediately to avoid further delays in payment processing. If you need assistance, contact support right away.</p>
            </div>
            <div class="footer">
              <p>© 2024 PaySplitr. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `URGENT: Incomplete Tasks Reminder\n\nHello ${distributorName},\n\nYou have ${incompleteCount} incomplete tasks from ${date} that require immediate attention.\n\nTotal Amount: $${overdueRecords.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}\n\nPlease log in to your dashboard and complete these overdue tasks immediately.\n\nBest regards,\nPaySplitr System`,
  }),
}
