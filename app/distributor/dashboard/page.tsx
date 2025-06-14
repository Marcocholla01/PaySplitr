import DistributorDashboardClient from "@/components/distributor-dashboard-client";
import { auth } from "@/lib/auth/utils";
import { redirect } from "next/navigation";

export default async function DistributorDashboard() {
  const session = await auth();

  if (!session || session.user?.role !== "distributor") {
    redirect("/auth/signin");
  }

  return <DistributorDashboardClient />;
}
