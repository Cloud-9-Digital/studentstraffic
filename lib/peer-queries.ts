import { sql } from "drizzle-orm";

// Executed after a transaction-scoped advisory lock for this guide. Separate
// statements in the Neon batch give waiting writers a fresh committed snapshot.
export function peerLockQuery(peerId: number) {
  return sql`select pg_advisory_xact_lock(hashtext(${'peer:' + peerId}))`;
}

export function createPeerCallQuery(input: {
  id: string; peerId: number; callerUserId: string; recipientUserId: string;
}) {
  const { id, peerId, callerUserId: caller, recipientUserId: recipient } = input;
  return sql`
    with eligible as (
      select p.id, p.university_id from student_peers p
      join peer_call_bookings b on b.peer_id = p.id
      where p.id = ${peerId} and p.status = 'active'
        and b.status = 'accepted' and b.student_blocked_at is null and b.peer_blocked_at is null
        and ((b.student_user_id = ${caller} and p.peer_user_id = ${recipient})
          or (b.student_user_id = ${recipient} and p.peer_user_id = ${caller}))
        and ${caller} <> ${recipient}
    ), existing as (
      select s.id from peer_call_sessions s where s.peer_id = ${peerId}
        and s.caller_user_id = ${caller} and s.peer_user_id = ${recipient}
        and s.status in ('ringing','active') and s.expires_at > now()
        and exists (select 1 from eligible) limit 1
    ), created as (
      insert into peer_call_sessions(id, channel_name, university_id, peer_id, caller_user_id, peer_user_id, status, started_at, expires_at)
      select ${id}, ${'peer-call-' + id}, e.university_id, e.id, ${caller}, ${recipient}, 'ringing', now(), now() + interval '60 seconds'
      from eligible e where not exists(select 1 from existing)
        and not exists (select 1 from peer_call_sessions s where s.status in ('ringing','active') and s.expires_at > now()
          and (s.caller_user_id in (${caller}, ${recipient}) or s.peer_user_id in (${caller}, ${recipient})))
      returning id
    ), job as (
      insert into background_jobs(kind, payload) select 'peer.notification', jsonb_build_object('type','call','callId',id) from created returning id
    ) select coalesce((select id from existing),(select id from created)) as "callId",
      exists(select 1 from existing) as reused, (select id from job) as "jobId",
      case when not exists(select 1 from eligible) then 'This connection is not available for calls.'
        when not exists(select 1 from existing) and not exists(select 1 from created) then 'One of you is already on a call. Please try again later.' end as error
  `;
}

export function sendPeerMessageQuery(input: { conversationId: number; userId: string; body: string; nonce: string }) {
  const { conversationId, userId, body, nonce } = input;
  return sql`
    with eligible as (
      select c.* from guide_conversations c
      join student_peers p on p.id = c.peer_id and p.peer_user_id = c.peer_user_id
      join peer_call_bookings b on b.peer_id = c.peer_id and b.student_user_id = c.student_user_id
      where c.id = ${conversationId} and ${userId} in (c.student_user_id,c.peer_user_id)
        and p.status = 'active' and b.status in ('pending','accepted')
        and b.student_blocked_at is null and b.peer_blocked_at is null
    ), existing as (
      select m.id, m.body from guide_messages m where m.conversation_id = ${conversationId}
        and m.sender_user_id = ${userId} and m.client_nonce = ${nonce}
    ), created as (
      insert into guide_messages(conversation_id,sender_user_id,message_type,body,client_nonce)
      select id, ${userId}, 'text', ${body}, ${nonce} from eligible
      where not exists(select 1 from existing) returning id, created_at
    ), updated as (
      update guide_conversations c set last_message_text = ${body}, last_message_at = m.created_at, updated_at = m.created_at,
        student_last_read_at = case when c.student_user_id = ${userId} then m.created_at else c.student_last_read_at end,
        peer_last_read_at = case when c.peer_user_id = ${userId} then m.created_at else c.peer_last_read_at end
      from created m where c.id = ${conversationId} returning c.id
    ), job as (
      insert into background_jobs(kind,payload) select 'peer.notification', jsonb_build_object('type','message','messageId',id) from created returning id
    ) select coalesce((select id from created),(select id from existing where body = ${body} and exists(select 1 from eligible))) as "messageId",
      (select id from job) as "jobId", exists(select 1 from existing) as reused
  `;
}

export function requestPeerBookingQuery(peerId: number, userId: string, text: string) {
  return sql`
      with changed as (
        insert into peer_call_bookings(student_user_id,peer_id,status,message)
        select ${userId}, id, 'pending', ${text} from student_peers
        where id = ${peerId} and status = 'active' and accepting_requests and peer_user_id is not null and peer_user_id <> ${userId}
        on conflict(student_user_id,peer_id) do update set status = 'pending', message = excluded.message, updated_at = now()
        where peer_call_bookings.student_blocked_at is null and peer_call_bookings.peer_blocked_at is null
          and (peer_call_bookings.status = 'cancelled' or (peer_call_bookings.status = 'declined' and peer_call_bookings.updated_at < now() - interval '7 days'))
        returning id
      ), job as (
        insert into background_jobs(kind,payload) select 'peer.notification', jsonb_build_object('type','booking','bookingId',id) from changed returning id
      ) select (select id from changed) as "bookingId", (select id from job) as "jobId"
    `;
}

export function changePeerConnectionQuery(bookingId: number, userId: string, operation: string) {
  return sql`
      with changed as (
        update peer_call_bookings b set
          status = case ${operation} when 'accept' then 'accepted' when 'decline' then 'declined' when 'cancel' then 'cancelled' else b.status end,
          student_blocked_at = case when b.student_user_id = ${userId} and ${operation} = 'block' then now() when b.student_user_id = ${userId} and ${operation} = 'unblock' then null else b.student_blocked_at end,
          peer_blocked_at = case when p.peer_user_id = ${userId} and ${operation} = 'block' then now() when p.peer_user_id = ${userId} and ${operation} = 'unblock' then null else b.peer_blocked_at end,
          updated_at = now()
        from student_peers p where b.id = ${bookingId} and p.id = b.peer_id
          and ${userId} in (b.student_user_id,p.peer_user_id)
          and ((${operation} in ('block','unblock'))
            or (${operation} = 'cancel' and b.student_user_id = ${userId} and b.status in ('pending','accepted'))
            or (${operation} in ('accept','decline') and p.peer_user_id = ${userId} and p.status = 'active' and b.status = 'pending'
              and b.student_blocked_at is null and b.peer_blocked_at is null))
        returning b.id, b.peer_id, b.student_user_id, p.peer_user_id
      ), ended as (
        update peer_call_sessions s set status = 'ended', ended_at = now(), updated_at = now() from changed c
        where ${operation} in ('decline','cancel','block') and s.peer_id = c.peer_id and s.status in ('ringing','active')
          and (s.caller_user_id = c.student_user_id or s.peer_user_id = c.student_user_id) returning s.id
      ), job as (
        insert into background_jobs(kind,payload) select 'peer.notification', jsonb_build_object('type','accepted','bookingId',id) from changed where ${operation} = 'accept' returning id
      ) select id, student_user_id as "studentUserId", peer_user_id as "peerUserId", (select id from job) as "jobId",
        coalesce((select jsonb_agg(id) from ended),'[]'::jsonb) as "endedCalls" from changed
    `;
}

export function preparePeerCallQuery(callId: string, userId: string) {
  return sql`
      update peer_call_sessions s set
        status = case when s.peer_user_id = ${userId} and s.status = 'ringing' then 'active' else s.status end,
        answered_at = case when s.peer_user_id = ${userId} and s.status = 'ringing' then now() else s.answered_at end,
        expires_at = case when s.peer_user_id = ${userId} and s.status = 'ringing' then now() + interval '1 hour' else s.expires_at end,
        updated_at = now()
      from student_peers p, peer_call_bookings b
      where s.id = ${callId} and ${userId} in (s.caller_user_id,s.peer_user_id)
        and s.status in ('ringing','active') and s.expires_at > now()
        and p.id = s.peer_id and p.status = 'active' and b.peer_id = p.id and b.status = 'accepted'
        and b.student_blocked_at is null and b.peer_blocked_at is null
        and ((b.student_user_id = s.caller_user_id and p.peer_user_id = s.peer_user_id)
          or (b.student_user_id = s.peer_user_id and p.peer_user_id = s.caller_user_id))
      returning s.status
    `;
}
