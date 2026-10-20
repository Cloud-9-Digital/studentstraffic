"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


/**
 * The dock shell.
 *
 * On desktop the panel does not float over the page — it reflows it. The
 * provider wraps the whole site chrome in a padded element and the panel is
 * fixed beside it, so a visitor can read a university page with the
 * conversation open next to it and compare what Mira says against the page
 * itself. That side-by-side reading is the entire point of docking rather than
 * overlaying.
 *
 * Below `md` there is no room to push, so the dock becomes a sheet.
 */

type ChatDockState = {
  isOpen: boolean;
  open: (seedPrompt?: string) => void;
  close: () => void;
  toggle: () => void;
  /**
   * A question the dock should send as soon as it mounts, so page-level CTAs
   * ("Ask about this university") can open the dock already working.
   */
  seedPrompt: string | null;
  clearSeedPrompt: () => void;
};

const ChatDockContext = createContext<ChatDockState | null>(null);

export function useChatDock() {
  const context = useContext(ChatDockContext);

  if (!context) {
    throw new Error("useChatDock must be used inside ChatDockProvider");
  }

  return context;
}

/**
 * The panel and its dependencies — the AI SDK client, the markdown renderer,
 * the phone input — are a meaningful chunk that most visitors never open, so
 * they load on first open rather than shipping with every page.
 */
const ChatDock = dynamic(
  () =>
    import("@/components/site/chatbot/chat-dock").then((mod) => ({
      default: mod.ChatDock,
    })),
  { ssr: false }
);

const ChatTrigger = dynamic(
  () =>
    import("@/components/site/chatbot/chat-trigger").then((mod) => ({
      default: mod.ChatTrigger,
    })),
  { ssr: false }
);

export function ChatDockProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  // Once opened the dock stays mounted so closing can animate; before that it
  // is never loaded at all, so visitors who ignore it pay nothing.
  const [hasOpened, setHasOpened] = useState(false);
  const [seedPrompt, setSeedPrompt] = useState<string | null>(null);

  const open = useCallback((prompt?: string) => {
    if (prompt) setSeedPrompt(prompt);
    setHasOpened(true);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => {
    setHasOpened(true);
    setIsOpen((current) => !current);
  }, []);
  const clearSeedPrompt = useCallback(() => setSeedPrompt(null), []);

  const value = useMemo<ChatDockState>(
    () => ({ isOpen, open, close, toggle, seedPrompt, clearSeedPrompt }),
    [isOpen, open, close, toggle, seedPrompt, clearSeedPrompt]
  );

  // On a phone the dock is a full-height sheet, so the page behind it must not
  // scroll underneath.
  useEffect(() => {
    if (!isOpen) return;
    if (window.matchMedia("(min-width: 768px)").matches) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  return (
    <ChatDockContext.Provider value={value}>
      <div
        // Padding rather than margin or transform: the sticky header inside
        // narrows with its container, so it stays aligned with the content
        // instead of sliding under the panel.
        //
        // `data-chat-dock` drives the header override in globals.css. The site
        // header's desktop nav is absolutely positioned and gated on a
        // viewport query, so narrowing this container does NOT switch it to the
        // compact layout — it would keep the desktop nav and, being out of
        // flow, overlap the logo and the actions. While the dock is open
        // between xl and 1648px (1280 + the 368px dock) the CSS switches the
        // header to the compact layout it already ships; above 1648px there is
        // room for both and nothing is overridden.
        //
        // The push starts at xl so the remaining column stays readable; below
        // that the dock overlays, which is why it carries its own shadow. This
        // padding MUST stay in step with the dock's w-[23rem].
        data-chat-dock={isOpen ? "open" : "closed"}
        // The padding itself is applied in globals.css from the dock's own
        // custom properties, keyed on this attribute — see .mira-dock.
        className="transition-[padding-right] duration-300 ease-out"
      >
        {children}
      </div>

      {/* Both check the route themselves; they are client-only and load on
          demand, so the check costs nothing above them. */}
      {hasOpened ? <ChatDock isOpen={isOpen} /> : null}
      <ChatTrigger />
    </ChatDockContext.Provider>
  );
}
