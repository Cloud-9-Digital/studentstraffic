import { compare } from "bcryptjs";
import type { Session } from "next-auth";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";

import {
  findActiveAdminByEmail,
  findActiveAdminById,
  normalizeEmail,
  updateAdminLastSignIn,
} from "@/lib/auth/admin-access";
import { env } from "@/lib/env";
import type { AdminUserRole } from "@/lib/db/schema";
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
const DEFAULT_LOGIN_ERROR = "The email or password is incorrect.";
const LOGIN_EMAIL_LIMIT = {
  limit: 5,
  windowMs: 15 * 60_000,
  blockMs: 30 * 60_000,
};
const LOGIN_IP_LIMIT = {
  limit: 12,
  windowMs: 15 * 60_000,
  blockMs: 30 * 60_000,
};
const LOGIN_COMBO_LIMIT = {
  limit: 6,
  windowMs: 15 * 60_000,
  blockMs: 30 * 60_000,
};

export type AdminSession = Session & {
  user: NonNullable<Session["user"]> & {
    role: "admin";
    adminRole: AdminUserRole;
    adminUserId: number;
  };
};

function getLoginRateLimitRules(email: string, ipAddress: string | null) {
  const rules: RateLimitRule[] = [
    {
      scope: "auth:login:email",
      identifier: email,
      ...LOGIN_EMAIL_LIMIT,
    },
  ];

  if (ipAddress) {
    rules.push(
      {
        scope: "auth:login:ip",
        identifier: ipAddress,
        ...LOGIN_IP_LIMIT,
      },
      {
        scope: "auth:login:combo",
        identifier: `${ipAddress}:${email}`,
        ...LOGIN_COMBO_LIMIT,
      }
    );
  }

  return rules;
}

function getRateLimitErrorMessage(retryAfterMs: number) {
  return `Too many sign-in attempts. Try again in ${formatRetryAfterMs(retryAfterMs)}.`;
}

async function assertLoginRateLimit(email: string, ipAddress: string | null) {
  const rules = getLoginRateLimitRules(email, ipAddress);

  for (const rule of rules) {
    const status = await getRateLimitStatus(rule);

    if (!status.allowed) {
      throw new Error(getRateLimitErrorMessage(status.retryAfterMs));
    }
  }
}

async function recordFailedLoginAttempt(email: string, ipAddress: string | null) {
  const rules = getLoginRateLimitRules(email, ipAddress);

  for (const rule of rules) {
    const status = await consumeRateLimit(rule);

    if (!status.allowed) {
      throw new Error(getRateLimitErrorMessage(status.retryAfterMs));
    }
  }
}

async function resetLoginAttempts(email: string, ipAddress: string | null) {
  const rules = getLoginRateLimitRules(email, ipAddress);

  await Promise.all(rules.map((rule) => resetRateLimit(rule.scope, rule.identifier)));
}

async function validateAdminSession(session: Session | null): Promise<AdminSession | null> {
  if (!session?.user?.role || session.user.role !== ADMIN_ROLE) {
    return null;
  }

  const adminUserId = session.user.adminUserId;

  if (typeof adminUserId !== "number") {
    return null;
  }

  const adminUser = await findActiveAdminById(adminUserId);

  if (!adminUser) {
    return null;
  }

  return {
    ...session,
    user: {
      ...session.user,
      name: adminUser.fullName,
      email: adminUser.email,
      role: ADMIN_ROLE,
      adminRole: adminUser.role,
      adminUserId: adminUser.id,
    },
  };
}

export const authOptions: NextAuthOptions = {
  secret: env.nextAuthSecret,
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!env.hasAdminAuthConfig || !email || !password) {
          return null;
        }

        const normalizedEmail = normalizeEmail(email);
        const ipAddress = req.headers ? getRequestIpAddress(req.headers) : null;

        await assertLoginRateLimit(normalizedEmail, ipAddress);

        const adminUser = await findActiveAdminByEmail(normalizedEmail);

        if (!adminUser) {
          await recordFailedLoginAttempt(normalizedEmail, ipAddress);
          return null;
        }

        const isValidPassword = await compare(password, adminUser.passwordHash);

        if (!isValidPassword) {
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

        return {
          id: String(adminUser.id),
          email: adminUser.email,
          name: adminUser.fullName,
          role: ADMIN_ROLE,
          adminRole: adminUser.role,
          adminUserId: adminUser.id,
        };
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
        session.user.role = token.role === ADMIN_ROLE ? ADMIN_ROLE : undefined;
        session.user.adminRole =
          token.adminRole === "owner" || token.adminRole === "admin"
            ? token.adminRole
            : undefined;
        session.user.adminUserId =
          typeof token.adminUserId === "number" ? token.adminUserId : undefined;
      }

      return session;
    },
  },
};

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
  return validateAdminSession(await getServerSession(authOptions));
}

export async function requireAdminSession(options?: {
  minimumRole?: AdminUserRole;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  if (options?.minimumRole === "owner" && session.user.adminRole !== "owner") {
    redirect("/admin");
  }

  return session;
}

export function getAdminAuthErrorMessage(error: string | undefined) {
  if (!error) {
    return DEFAULT_LOGIN_ERROR;
  }

  if (error.startsWith("Too many sign-in attempts.")) {
    return error;
  }

  return DEFAULT_LOGIN_ERROR;
}
