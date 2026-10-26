import "server-only";

import { cache } from "react";
import { eq, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { users } from "@/lib/db/schema";
import { EMPTY_NAV_COUNTS, type DashboardNavCounts } from "@/lib/dashboard/nav";

export type DashboardViewer = {
  userId: string;
  name: string | null;
  email: string;
  image: string | null;
  isGuide: boolean;
  counts: DashboardNavCounts;
  preferences: {
    neetScore: number | null;
    budgetUsd: number | null;
    preferredCountries: string[] | null;
  };
};

/**
 * Everything the dashboard shell needs about the signed-in user, in ONE round
 * trip: the real DB user (resolved by email, since session.user.id is "1" for
 * admin sessions), whether they are a guide, and the nav badge counts.
 *
 * Counts are scalar sub-selects (COUNT only, no rows leave the database), on
 * indexed columns: guide_conversations(student_user_id|peer_user_id, ...),
 * guide_messages(conversation_id, created_at), student_peers(peer_user_id),
 * peer_call_bookings(peer_id). Unread matches lib/guide-chat.ts: messages from
 * the other participant newer than my last-read time.
 *
 * Wrapped in React `cache` so the layout and the page share one query per request.
 */
export const getDashboardViewer = cache(async (email: string): Promise<DashboardViewer | null> => {
  const db = getDb();
  if (!db || !email) return null;

  // Correlated subqueries must name the outer table: drizzle renders users.id as a
  // bare "id", which inside a subquery resolves to the subquery's own tables.
  const viewerId = sql.raw(`"users"."id"`);

  const [row] = await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      neetScore: users.neetScore,
      budgetUsd: users.budgetUsd,
      preferredCountries: users.preferredCountries,
      isGuide: sql<number>`(case when exists (select 1 from student_peers p where p.peer_user_id = ${viewerId}) then 1 else 0 end)`.mapWith(Number),
      studentUnread: sql<number>`(
        select count(*)::integer from guide_messages m
        join guide_conversations c on c.id = m.conversation_id
        where c.student_user_id = ${viewerId}
          and m.sender_user_id <> ${viewerId}
          and m.created_at > coalesce(c.student_last_read_at, '-infinity'::timestamptz)
      )`.mapWith(Number),
      guideUnread: sql<number>`(
        select count(*)::integer from guide_messages m
        join guide_conversations c on c.id = m.conversation_id
        where c.peer_user_id = ${viewerId}
          and m.sender_user_id <> ${viewerId}
          and m.created_at > coalesce(c.peer_last_read_at, '-infinity'::timestamptz)
      )`.mapWith(Number),
      pendingRequests: sql<number>`(
        select count(*)::integer from peer_call_bookings b
        join student_peers p on p.id = b.peer_id
        where p.peer_user_id = ${viewerId} and b.status = 'pending'
      )`.mapWith(Number),
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!row) return null;

  return {
    userId: row.userId,
    name: row.name,
    email: row.email,
    image: row.image,
    isGuide: row.isGuide === 1,
    counts: {
      ...EMPTY_NAV_COUNTS,
      studentUnread: row.studentUnread ?? 0,
      guideUnread: row.guideUnread ?? 0,
      pendingRequests: row.pendingRequests ?? 0,
    },
    preferences: {
      neetScore: row.neetScore,
      budgetUsd: row.budgetUsd,
      preferredCountries: row.preferredCountries,
    },
  };
});
