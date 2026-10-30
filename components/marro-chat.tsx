import Script from "next/script";

// Students Traffic's own address on Marro, and the widget's key. The key is public by design: it
// ships in the snippet and only lets a website open this one chat (Marro: Settings → Connections →
// Website chat).
const MARRO_CHAT_ADDRESS = "https://studentstraffic.marro.pro";
const MARRO_CHAT_KEY = "MOxeJ0K6U0jEzX9OHwiXJxVwMf2Njg-i";

/**
 * The Students Traffic chat bubble from the Marro CRM: visitors' chats arrive in Marro's inbox and
 * the people who give a phone number become leads.
 */
export function MarroChat() {
  return (
    <Script
      src={`${MARRO_CHAT_ADDRESS}/widget/chat.js?id=${MARRO_CHAT_KEY}`}
      strategy="afterInteractive"
    />
  );
}
