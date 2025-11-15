import NextAuth from "next-auth";
import { authOptions } from "@/auth/auth";

const handler = NextAuth(authOptions);

// Next.js App Router API route handlers
export { handler as GET, handler as POST };
