import "server-only";
import { getAuthorizedGuideConversation } from "@/lib/guide-chat";
import { changePeerConnection, reportPeerConversation } from "@/lib/peer-connections";
export async function handlePeerSafetyRequest(conversationId: number, userId: string, body: unknown) {
  const data = body as { operation?: string; reason?: string; details?: string } | null;
  const conversation = await getAuthorizedGuideConversation(conversationId, userId);
  if (!conversation?.bookingId) return { error: "Conversation not found." };
  if (data?.operation === "report") return reportPeerConversation(conversationId, userId, String(data.reason || ""), String(data.details || ""));
  if (data?.operation === "block" || data?.operation === "unblock") return changePeerConnection(conversation.bookingId, userId, data.operation);
  return { error: "Invalid action." };
}
