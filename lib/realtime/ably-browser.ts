"use client";

import Ably from "ably";

declare global {
  interface Window {
    __guideChatAblyClients?: Map<string, Ably.Realtime>;
  }
}

export function getGuideChatRealtimeClient(userId: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const clients = (window.__guideChatAblyClients ??= new Map());
  const existingClient = clients.get(userId);
  if (existingClient) {
    return existingClient;
  }

  const client = new Ably.Realtime({
    authUrl: "/api/dashboard/chat/realtime",
    clientId: userId,
    autoConnect: true,
    closeOnUnload: true,
  });

  clients.set(userId, client);
  return client;
}
