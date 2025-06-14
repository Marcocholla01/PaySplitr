// app/api/auth/[...nextauth]/route.ts
import { handler as authHandler } from "@/lib/auth";

export { authHandler as GET, authHandler as POST };
