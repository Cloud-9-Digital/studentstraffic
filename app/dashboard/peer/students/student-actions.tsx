"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { openGuideConversationFromBookingAction } from "@/app/_actions/guide-chat";
import { FormSubmitButton } from "@/components/dashboard/chat/form-submit-button";
import { dashboardButton } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";
import { PeerStartCallButton } from "../requests/peer-start-call-button";
import { RequestActions } from "../requests/request-actions";

const small = "px-3 py-1.5 text-xs";

/** The next useful step for a student: Accept/Decline, Message, Start call. */
export function StudentActions({
  studentName,
  universityName,
  bookingId,
  conversationId,
  unreadCount = 0,
  canAccept,
  canMessage,
  canCall,
  showAccept = true,
}: {
  studentName: string;
  universityName: string;
  bookingId: number | null;
  conversationId: number | null;
  unreadCount?: number;
  canAccept: boolean;
  canMessage: boolean;
  canCall: boolean;
  showAccept?: boolean;
}) {
  const messageLabel = unreadCount > 0 ? `Reply (${unreadCount})` : "Message";

  return (
    <div className="flex flex-wrap items-start gap-2">
      {canAccept && showAccept && bookingId != null ? (
        <RequestActions bookingId={bookingId} studentName={studentName} />
      ) : null}
      {canMessage && conversationId != null ? (
        <Link href={`/dashboard/peer/messages?conversation=${conversationId}`} className={cn(dashboardButton.secondary, small)}>
          <MessageCircle className="size-3.5" />
          {messageLabel}
        </Link>
      ) : canMessage && bookingId != null ? (
        <form action={openGuideConversationFromBookingAction}>
          <input type="hidden" name="bookingId" value={bookingId} />
          <input type="hidden" name="redirectPath" value="/dashboard/peer/messages" />
          <FormSubmitButton className={cn(dashboardButton.secondary, small)} pendingLabel="Opening…">
            <MessageCircle className="size-3.5" />
            {messageLabel}
          </FormSubmitButton>
        </form>
      ) : null}
      {canCall && bookingId != null ? (
        <PeerStartCallButton bookingId={bookingId} studentName={studentName} universityName={universityName} />
      ) : null}
    </div>
  );
}
