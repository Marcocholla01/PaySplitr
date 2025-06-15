// app/page.tsx
import LandingPage from "@/components/landing-page";
import { getAuthSession } from "@/lib/auth/utils";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getAuthSession();

  if (session) {
    if (session.user?.role === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/distributor/dashboard");
    }
  }

  return <LandingPage />;
}
