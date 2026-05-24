import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { authConfig } from "@/lib/auth.config";
import type { AdminUserRole } from "@/lib/db/schema";
import { users } from "@/lib/db/schema";
import {
  findActiveAdminByEmail,
  findActiveAdminById,
  normalizeEmail,
  updateAdminLastSignIn,
} from "@/lib/auth/admin-access";
import { env } from "@/lib/env";
import { recordAdminAuditLog } from "@/lib/security/admin-audit";
import {
  consumeRateLimit,
  formatRetryAfterMs,
  getRateLimitStatus,
  resetRateLimit,
  type RateLimitRule,
} from "@/lib/security/rate-limit";
import { getRequestIpAddress } from "@/lib/security/request";

const ADMIN_ROLE = "admin" as const;
const DEFAULT_LOGIN_ERROR = "Invalid email or password.";
const LOGIN_EMAIL_LIMIT = { limit: 5, windowMs: 15 * 60_000, blockMs: 30 * 60_000 };
const LOGIN_IP_LIMIT = { limit: 12, windowMs: 15 * 60_000, blockMs: 30 * 60_000 };
const LOGIN_COMBO_LIMIT = { limit: 6, windowMs: 15 * 60_000, blockMs: 30 * 60_000 };

process.env.NEXTAUTH_URL ??= env.nextAuthUrl;

export type AdminSession = Session & {
  user: NonNullable<Session["user"]> & {
    role: "admin";
    adminRole: AdminUserRole;
    adminUserId: number;
  };
};

function getLoginRateLimitRules(email: string, ipAddress: string | null): RateLimitRule[] {
  const rules: RateLimitRule[] = [{ scope: "auth:login:email", identifier: email, ...LOGIN_EMAIL_LIMIT }];
  if (ipAddress) {
    rules.push(
      { scope: "auth:login:ip", identifier: ipAddress, ...LOGIN_IP_LIMIT },
      { scope: "auth:login:combo", identifier: `${ipAddress}:${email}`, ...LOGIN_COMBO_LIMIT }
    );
  }
  return rules;
}

async function assertLoginRateLimit(email: string, ipAddress: string | null) {
  const statuses = await Promise.all(getLoginRateLimitRules(email, ipAddress).map(getRateLimitStatus));
  for (const s of statuses) {
    if (!s.allowed) throw new Error(`Too many sign-in attempts. Try again in ${formatRetryAfterMs(s.retryAfterMs)}.`);
  }
}

async function recordFailedLoginAttempt(email: string, ipAddress: string | null) {
  const statuses = await Promise.all(getLoginRateLimitRules(email, ipAddress).map(consumeRateLimit));
  for (const s of statuses) {
    if (!s.allowed) throw new Error(`Too many sign-in attempts. Try again in ${formatRetryAfterMs(s.retryAfterMs)}.`);
  }
}

async function resetLoginAttempts(email: string, ipAddress: string | null) {
  await Promise.all(getLoginRateLimitRules(email, ipAddress).map((r) => resetRateLimit(r.scope, r.identifier)));
}

async function validateAdminSession(session: Session | null): Promise<AdminSession | null> {
  if (session?.user?.role !== ADMIN_ROLE) return null;
  const adminUserId = session.user.adminUserId;
  if (typeof adminUserId !== "number") return null;
  const adminUser = await findActiveAdminById(adminUserId);
  if (!adminUser) return null;
  return {
    ...session,
    user: { ...session.user, name: adminUser.fullName, email: adminUser.email, role: ADMIN_ROLE, adminRole: adminUser.role, adminUserId: adminUser.id },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(getDb()!),
  secret: env.nextAuthSecret,
  session: { strategy: "jwt", maxAge: 12 * 60 * 60 },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    ...authConfig.providers,
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const normalizedEmail = normalizeEmail(email);
        const ipAddress = req.headers ? getRequestIpAddress(req.headers) : null;

        await assertLoginRateLimit(normalizedEmail, ipAddress);

        // Try admin first
        const adminUser = await findActiveAdminByEmail(normalizedEmail);
        if (adminUser) {
          const valid = await compare(password, adminUser.passwordHash);
          if (!valid) {
            await recordFailedLoginAttempt(normalizedEmail, ipAddress);
            return null;
          }
          await resetLoginAttempts(normalizedEmail, ipAddress);
          await updateAdminLastSignIn(adminUser.id);
          await recordAdminAuditLog({
            actorAdminId: adminUser.id,
            actorEmail: adminUser.email,
            action: "auth.login",
            targetType: "admin_user",
            targetId: String(adminUser.id),
            targetDisplay: adminUser.email,
            headerSource: req.headers,
          });
          return { id: String(adminUser.id), email: adminUser.email, name: adminUser.fullName, role: ADMIN_ROLE, adminRole: adminUser.role, adminUserId: adminUser.id };
        }

        // Try regular user
        const db = getDb();
        if (!db) return null;
        const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
        if (!user?.passwordHash) {
          await recordFailedLoginAttempt(normalizedEmail, ipAddress);
          return null;
        }
        const valid = await compare(password, user.passwordHash);
        if (!valid) {
          await recordFailedLoginAttempt(normalizedEmail, ipAddress);
          return null;
        }
        await resetLoginAttempts(normalizedEmail, ipAddress);
        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.adminRole = user.adminRole;
        token.adminUserId = user.adminUserId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub;
        session.user.role = token.role === ADMIN_ROLE ? ADMIN_ROLE : undefined;
        session.user.adminRole =
          token.adminRole === "owner" || token.adminRole === "admin" ? token.adminRole : undefined;
        session.user.adminUserId =
          typeof token.adminUserId === "number" ? token.adminUserId : undefined;
      }
      return session;
    },
  },
});

export function isAdminSession(session: Session | null): session is AdminSession {
  return (
    session?.user?.role === ADMIN_ROLE &&
    typeof session.user.adminUserId === "number" &&
    (session.user.adminRole === "owner" || session.user.adminRole === "admin")
  );
}

export function isOwnerSession(session: AdminSession | null) {
  return session?.user.adminRole === "owner";
}

export async function getAdminSession() {
  return validateAdminSession(await auth());
}

export async function requireAdminSession(options?: { minimumRole?: AdminUserRole }) {
  const session = await getAdminSession();
  if (!session) redirect("/login");
  if (options?.minimumRole === "owner" && session.user.adminRole !== "owner") redirect("/admin");
  return session;
}

export function getAdminAuthErrorMessage(error: string | undefined) {
  if (error?.startsWith("Too many sign-in attempts.")) return error;
  return DEFAULT_LOGIN_ERROR;
}
