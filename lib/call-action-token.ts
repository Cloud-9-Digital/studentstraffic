import { createHmac, timingSafeEqual } from "node:crypto";

const ACTION_TTL_MS = 2 * 60_000;

function secret() {
  return process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? null;
}

export function createCallActionToken(callId: string, recipientUserId: string) {
  const key = secret();
  if (!key) return null;
  const payload = `${callId}.${recipientUserId}.${Date.now() + ACTION_TTL_MS}`;
  const signature = createHmac("sha256", key).update(payload).digest("base64url");
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export function verifyCallActionToken(token: string | null, callId: string, recipientUserId: string) {
  const key = secret();
  if (!token || !key) return false;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;
  const payload = Buffer.from(encodedPayload, "base64url").toString("utf8");
  const [tokenCallId, tokenRecipientId, expiresAt] = payload.split(".");
  if (tokenCallId !== callId || tokenRecipientId !== recipientUserId || Number(expiresAt) < Date.now()) return false;
  const expected = createHmac("sha256", key).update(payload).digest("base64url");
  const provided = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return provided.length === expectedBuffer.length && timingSafeEqual(provided, expectedBuffer);
}
