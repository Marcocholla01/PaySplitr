// This script can be used to set up cron jobs for checking incomplete tasks
// Run this with: node scripts/setup-cron.js

const cron = require("node-cron");

// Check for incomplete tasks every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("Running incomplete tasks check...");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/cron/check-incomplete-tasks`
    );
    const result = await response.json();

    if (result.success) {
      console.log(
        `Incomplete tasks check completed. Notified ${result.distributorsNotified} distributors.`
      );
    } else {
      console.error("Incomplete tasks check failed:", result.error);
    }
  } catch (error) {
    console.error("Error running incomplete tasks check:", error);
  }
});

console.log("Cron job scheduled: Check incomplete tasks daily at 9 AM");
