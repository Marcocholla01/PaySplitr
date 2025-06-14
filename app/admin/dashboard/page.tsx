import { redirect } from "next/navigation";

import AdminDashboardClient from "@/components/admin-dashboard-client";
import { auth } from "@/lib/auth/utils";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    redirect("/auth/signin");
  }

  return <AdminDashboardClient />;
}
