import "server-only";

import Ably from "ably";

import { env } from "@/lib/env";

let ablyRestClient: Ably.Rest | null | undefined;

function getAblyRestClient() {
  if (ablyRestClient !== undefined) {
    return ablyRestClient;
  }

  if (!env.ablyApiKey) {
    ablyRestClient = null;
    return ablyRestClient;
  }

  ablyRestClient = new Ably.Rest({ key: env.ablyApiKey });
  return ablyRestClient;
}

export function getGuideChatUserChannelName(userId: string) {
  return `guide-chat:user:${userId}`;
}

export async function createGuideChatTokenRequest(userId: string) {
  const client = getAblyRestClient();
  if (!client) {
    return null;
  }

  return client.auth.createTokenRequest({
    clientId: userId,
    capability: JSON.stringify({
      [getGuideChatUserChannelName(userId)]: ["subscribe"],
    }),
  });
}

export async function publishGuideChatUserEvent(
  userId: string,
  eventName: string,
  data: Record<string, unknown>
) {
  const client = getAblyRestClient();
  if (!client) {
    return;
  }

  await client.channels.get(getGuideChatUserChannelName(userId)).publish(eventName, data);
}
