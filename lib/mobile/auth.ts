import { createHash, randomBytes } from "node:crypto";
import { compare, hash } from "bcryptjs";
import { and, eq, gt, isNull } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { mobileSessions, users, type UserRow } from "@/lib/db/schema";

const MOBILE_SESSION_DAYS = 60;

export type MobileUser = Pick<
  UserRow,
  "id" | "name" | "email" | "image" | "phone" | "neetScore" | "budgetUsd" | "preferredCountries"
>;

export function toMobileUser(user: MobileUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    phone: user.phone,
    neetScore: user.neetScore,
    budgetUsd: user.budgetUsd,
    preferredCountries: user.preferredCountries ?? [],
  };
}

function createToken() {
  return `st_${randomBytes(32).toString("base64url")}`;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createMobileSession(
  userId: string,
  metadata?: {
    deviceName?: string | null;
    platform?: string | null;
    appVersion?: string | null;
    pushToken?: string | null;
  }
) {
  const db = getDb();
  if (!db) return null;

  const token = createToken();
  const expires = new Date(Date.now() + MOBILE_SESSION_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(mobileSessions).values({
    userId,
    tokenHash: hashToken(token),
    tokenPrefix: token.slice(0, 10),
    deviceName: metadata?.deviceName ?? null,
    platform: metadata?.platform ?? null,
    appVersion: metadata?.appVersion ?? null,
    pushToken: metadata?.pushToken ?? null,
    expiresAt: expires,
  });

  return { token, expires };
}

export function getBearerToken(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

export async function getMobileSession(request: Request) {
  const token = getBearerToken(request);
  const db = getDb();
  if (!token || !db) return null;

  const [row] = await db
    .select({
      sessionId: mobileSessions.id,
      expiresAt: mobileSessions.expiresAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        phone: users.phone,
        neetScore: users.neetScore,
        budgetUsd: users.budgetUsd,
        preferredCountries: users.preferredCountries,
      },
    })
    .from(mobileSessions)
    .innerJoin(users, eq(users.id, mobileSessions.userId))
    .where(
      and(
        eq(mobileSessions.tokenHash, hashToken(token)),
        isNull(mobileSessions.revokedAt),
        gt(mobileSessions.expiresAt, new Date())
      )
    )
    .limit(1);

  if (row) {
    await db
      .update(mobileSessions)
      .set({ lastUsedAt: new Date(), updatedAt: new Date() })
      .where(eq(mobileSessions.id, row.sessionId));
  }

  return row ?? null;
}

export async function requireMobileSession(request: Request) {
  return getMobileSession(request);
}

export async function revokeMobileSession(request: Request) {
  const token = getBearerToken(request);
  const db = getDb();
  if (!token || !db) return false;

  await db
    .update(mobileSessions)
    .set({ revokedAt: new Date(), updatedAt: new Date() })
    .where(eq(mobileSessions.tokenHash, hashToken(token)));

  return true;
}

export async function loginMobileUser(
  email: string,
  password: string,
  metadata?: Parameters<typeof createMobileSession>[1]
) {
  const db = getDb();
  if (!db) return { error: "unavailable" as const };

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user?.passwordHash) return { error: "invalid" as const };

  const valid = await compare(password, user.passwordHash);
  if (!valid) return { error: "invalid" as const };

  const session = await createMobileSession(user.id, metadata);
  if (!session) return { error: "unavailable" as const };

  return { user, session };
}

export async function registerMobileUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}, metadata?: Parameters<typeof createMobileSession>[1]) {
  const db = getDb();
  if (!db) return { error: "unavailable" as const };

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existing) return { error: "exists" as const };

  const passwordHash = await hash(input.password, 10);
  const [user] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
      updatedAt: new Date(),
    })
    .returning();

  const session = await createMobileSession(user.id, metadata);
  if (!session) return { error: "unavailable" as const };

  return { user, session };
}
