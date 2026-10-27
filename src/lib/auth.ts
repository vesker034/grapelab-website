import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/auditLog";
import {
  isRateLimited,
  registerRateLimitFailure,
  resetSourceEmail,
} from "@/lib/adminRateLimit";

function getHeaderValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function getClientSource(
  headers: Record<string, string | string[] | undefined>
): string {
  const forwardedFor = getHeaderValue(headers["x-forwarded-for"]);
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = getHeaderValue(headers["x-real-ip"]);
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();
        const source = getClientSource(req.headers ?? {});

        if (await isRateLimited(source, email)) {
          writeAuditLog("login_blocked", source, email);
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.isStaff) {
          const blocked = await registerRateLimitFailure(source, email);
          writeAuditLog(blocked ? "login_blocked" : "login_failed", source, email);
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.pwdhash);
        if (!isValid) {
          const blocked = await registerRateLimitFailure(source, email);
          writeAuditLog(blocked ? "login_blocked" : "login_failed", source, email);
          return null;
        }

        resetSourceEmail(source, email).catch((err) =>
          console.error("[auth] Failed to reset rate limit:", err)
        );
        writeAuditLog("login_success", source, email);

        return {
          id: String(user.id),
          name: user.fullname,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 часов
  },
  secret: process.env.NEXTAUTH_SECRET,
};
