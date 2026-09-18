import assert from "node:assert/strict";
import { test } from "node:test";
import { execFileSync, execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFileSync } from "node:fs";
import { PgDialect } from "drizzle-orm/pg-core";
import { sql, type SQL } from "drizzle-orm";
import { createPeerCallQuery, sendPeerMessageQuery, peerLockQuery, requestPeerBookingQuery, changePeerConnectionQuery, preparePeerCallQuery } from "../lib/peer-queries";

const database = process.env.PEER_TEST_DATABASE_URL;
const dialect = new PgDialect();
function queryText(query: SQL) {
  const built = dialect.sqlToQuery(query);
  return built.sql.replace(/\$(\d+)/g, (_, n) => {
    const value = built.params[Number(n) - 1];
    return typeof value === "number" ? String(value) : value === null ? "null" : "'" + String(value).replaceAll("'", "''") + "'";
  });
}
const run = (statement: string) => execFileSync("psql", [database!, "-X", "-v", "ON_ERROR_STOP=1", "-Atq", "-c", statement], { encoding: "utf8" }).trim();
const row = (query: SQL) => JSON.parse(run(`select row_to_json(r) from (${queryText(query)}) r`));
// Data-modifying CTEs must stay top-level; psql emits a JSON wrapper via the final SELECT.
function execute(query: SQL) {
  const text = queryText(query);
  const result = execFileSync("psql", [database!, "-X", "-v", "ON_ERROR_STOP=1", "--csv", "-t", "-c", text], { encoding: "utf8" }).trim();
  return result;
}
const fixture = () => {
  run("truncate peer_reports, guide_messages, guide_conversations, peer_call_sessions, peer_call_bookings, background_jobs, student_peers, universities, users, admin_users restart identity cascade");
  run("insert into users values ('s1','Student One'),('s2','Student Two'),('g1','Guide One'),('g2','Guide Two'),('stranger','Stranger'); insert into universities values(1); insert into student_peers(id,university_id,peer_user_id) values(1,1,'g1'),(2,1,'g2'); insert into peer_call_bookings(student_user_id,peer_id,status) values('s1',1,'accepted'),('s2',1,'accepted'),('s1',2,'accepted'); insert into guide_conversations(student_user_id,peer_user_id,peer_id) values('s1','g1',1),('s2','g1',1)");
};
const call = (id = "c1", caller = "s1", recipient = "g1", peerId = 1) => createPeerCallQuery({ id, peerId, callerUserId: caller, recipientUserId: recipient });
const message = (nonce = "nonce-1", body = "How is the hostel?", userId = "s1") => sendPeerMessageQuery({ conversationId: 1, userId, body, nonce });

test("peer launch database boundaries", { skip: !database }, async (t) => {
  assert.match(database!, /^postgres(?:ql)?:\/\/(?:[^@/]+@)?(?:127\.0\.0\.1|localhost):55439\//, "Use only the isolated local test database");
  run(readFileSync(new URL("fixtures/peer-launch-schema.sql", import.meta.url), "utf8"));
  run(readFileSync(new URL("../drizzle/0072_peer_launch_hardening.sql", import.meta.url), "utf8"));
  run(readFileSync(new URL("../drizzle/0072_peer_launch_hardening.sql", import.meta.url), "utf8"));
  await t.test("student cannot call without an accepted booking", () => { fixture(); run("update peer_call_bookings set status='pending'"); execute(call()); assert.equal(run("select count(*) from peer_call_sessions"), "0"); });
  await t.test("unrelated account cannot call or send into another conversation", () => { fixture(); execute(call("c1","stranger")); execute(message("n","Hello","stranger")); assert.equal(run("select count(*) from peer_call_sessions"),"0"); assert.equal(run("select count(*) from guide_messages"),"0"); });
  await t.test("duplicate call start reuses the session and notification", () => { fixture(); execute(call()); execute(call("c2")); assert.equal(run("select count(*) from peer_call_sessions"),"1"); assert.equal(run("select count(*) from background_jobs"),"1"); });
  await t.test("busy guide cannot receive a second student's call", () => { fixture(); execute(call()); execute(call("c2","s2")); assert.equal(run("select count(*) from peer_call_sessions"),"1"); });
  await t.test("busy student cannot call a different guide", () => { fixture(); execute(call()); execute(call("c2","s1","g2",2)); assert.equal(run("select count(*) from peer_call_sessions"),"1"); });
  await t.test("guide can call the exact accepted student", () => { fixture(); execute(call("c1","g1","s2")); assert.equal(run("select peer_user_id from peer_call_sessions"),"s2"); });
  await t.test("recipient answer activates only a live permitted call", () => { fixture(); execute(call()); execute(preparePeerCallQuery("c1","stranger")); assert.equal(run("select status from peer_call_sessions"),"ringing"); execute(preparePeerCallQuery("c1","g1")); assert.equal(run("select status from peer_call_sessions"),"active"); });
  await t.test("message retry inserts once and cannot overwrite original", () => { fixture(); execute(message()); execute(message()); execute(message("nonce-1","Changed body")); assert.equal(run("select count(*) from guide_messages"),"1"); assert.equal(run("select last_message_text from guide_conversations where id=1"),"How is the hostel?"); assert.equal(run("select count(*) from background_jobs"),"1"); });
  await t.test("decline disables existing chat and token access", () => { fixture(); run("update peer_call_bookings set status='pending' where id=1"); execute(changePeerConnectionQuery(1,"g1","decline")); execute(message()); execute(call()); assert.equal(run("select count(*) from guide_messages"),"0"); assert.equal(run("select count(*) from peer_call_sessions"),"0"); });
  await t.test("block ends active call and prevents messaging or token renewal", () => { fixture(); execute(call()); execute(preparePeerCallQuery("c1","g1")); execute(changePeerConnectionQuery(1,"s1","block")); execute(message()); execute(preparePeerCallQuery("c1","g1")); assert.equal(run("select status from peer_call_sessions"),"ended"); assert.equal(run("select count(*) from guide_messages"),"0"); });
  await t.test("one participant cannot remove the other's block", () => { fixture(); execute(changePeerConnectionQuery(1,"g1","block")); execute(changePeerConnectionQuery(1,"s1","unblock")); execute(message()); assert.equal(run("select count(*) from guide_messages"),"0"); });
  await t.test("unrelated account cannot change a booking", () => { fixture(); execute(changePeerConnectionQuery(1,"stranger","cancel")); assert.equal(run("select status from peer_call_bookings where id=1"),"accepted"); });
  await t.test("paused guide refuses new requests but preserves existing connection", () => { fixture(); run("update student_peers set accepting_requests=false where id=1"); execute(requestPeerBookingQuery(1,"stranger","How is campus?")); assert.equal(run("select count(*) from peer_call_bookings where student_user_id='stranger'"),"0"); execute(message()); assert.equal(run("select count(*) from guide_messages"),"1"); });
  await t.test("declined retry respects seven-day cooldown", () => { fixture(); run("update peer_call_bookings set status='declined' where id=1"); execute(requestPeerBookingQuery(1,"s1","Another question")); assert.equal(run("select status from peer_call_bookings where id=1"),"declined"); run("update peer_call_bookings set updated_at=now()-interval '8 days' where id=1"); execute(requestPeerBookingQuery(1,"s1","Another question")); assert.equal(run("select status from peer_call_bookings where id=1"),"pending"); });
  await t.test("concurrent starts serialized by guide lock create one session", async () => { fixture(); const asyncExec = promisify(execFile); const statements = [call("parallel1"),call("parallel2")].map(q => `begin; ${queryText(peerLockQuery(1))}; ${queryText(q)}; commit;`); await Promise.all(statements.map(statement => asyncExec("psql",[database!,"-X","-q","-v","ON_ERROR_STOP=1","-c",statement]))); assert.equal(run("select count(*) from peer_call_sessions"),"1"); });
});
