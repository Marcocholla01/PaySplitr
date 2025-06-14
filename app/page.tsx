// app/page.tsx
import { getAuthSession } from "@/lib/auth/utils";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user?.role === "admin") {
    redirect("/admin/dashboard");
  } else {
    redirect("/distributor/dashboard");
  }
}
