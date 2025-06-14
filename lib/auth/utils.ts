// lib/auth/utils.ts
;
import NextAuth, { getServerSession } from "next-auth";
import { authOptions } from "../auth";

// For server components
export const getAuthSession = async () => {
  return await getServerSession(authOptions);
};

// For client components/actions
export const auth = () => getServerSession(authOptions);
export const signIn = (p0: string, p1: { email: string; password: string; redirect: boolean; }) => NextAuth(authOptions).signIn;
export const signOut = () => NextAuth(authOptions).signOut;