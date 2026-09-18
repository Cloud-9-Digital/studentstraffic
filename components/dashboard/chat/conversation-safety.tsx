"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

export function ConversationSafety({ conversationId, blockedByMe, onChanged }: { conversationId: number; blockedByMe: boolean; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [reason, setReason] = useState("harassment");
  const [details, setDetails] = useState("");
  const [notice, setNotice] = useState("");
  async function submit(operation: "block" | "unblock" | "report") {
    if (pending) return;
    setPending(true); setNotice("");
    try {
      const response = await fetch(`/api/dashboard/chat/conversations/${conversationId}/safety`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ operation, reason, details }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save. Please try again.");
      setNotice(operation === "report" ? "Report submitted privately to our team. You can also block this conversation." : operation === "block" ? "Blocked. Neither of you can message or call until all blocks are removed." : "Your block has been removed.");
      onChanged();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Unable to save."); }
    finally { setPending(false); }
  }
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><button type="button" className="rounded-lg border px-2 py-2 text-xs focus-visible:ring-2">Safety</button></DialogTrigger>
    <DialogContent><DialogTitle>Conversation safety</DialogTitle><DialogDescription>Keep communication on Students Traffic. Never send money or share contact details with another member.</DialogDescription>
      <p className="text-sm">Blocking stops chat and ends current calls. You can remove your block here later.</p>
      <button type="button" disabled={pending} onClick={() => void submit(blockedByMe ? "unblock" : "block")} className="rounded-lg border px-3 py-2 focus-visible:ring-2 disabled:opacity-50">{blockedByMe ? "Unblock conversation" : "Block conversation"}</button>
      <form className="space-y-3" onSubmit={event => { event.preventDefault(); void submit("report"); }}>
        <label className="block text-sm">Report reason<select value={reason} onChange={event => setReason(event.target.value)} className="mt-1 block w-full rounded border p-2"><option value="harassment">Harassment or abusive behaviour</option><option value="contact_sharing">Asking to exchange contact details</option><option value="misleading_information">Misleading information or payment request</option><option value="other">Something else</option></select></label>
        <label className="block text-sm">What happened?<textarea value={details} onChange={event => setDetails(event.target.value)} required minLength={10} maxLength={2000} rows={4} className="mt-1 block w-full rounded border p-2" /></label>
        <button disabled={pending} className="rounded-lg bg-[#0f3d37] px-4 py-2 text-white focus-visible:ring-2 disabled:opacity-50">{pending ? "Saving…" : "Send private report"}</button>
      </form><p aria-live="polite" className="text-sm">{notice}</p>
    </DialogContent></Dialog>;
}
