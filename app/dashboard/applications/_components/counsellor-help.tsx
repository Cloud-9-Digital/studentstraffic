import Link from "next/link";
import { MessageCircle, MessagesSquare } from "lucide-react";

import { dashboardButton } from "@/components/dashboard/ui";
import { buildCounsellorWhatsappHref } from "@/lib/dashboard/application-model";
import { siteConfig } from "@/lib/constants";

/**
 * The honest version of "what happens next": counselling is free, a person
 * reviews the application with the student, and the university decides.
 */
export function CounsellorHelp({
  universityName,
  programmeLabel,
  applicationId,
  compact = false,
}: {
  universityName?: string;
  programmeLabel?: string;
  applicationId?: number;
  compact?: boolean;
}) {
  const whatsappHref = universityName
    ? buildCounsellorWhatsappHref({ universityName, programmeLabel, applicationId })
    : `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent("Hi Students Traffic, I'd like help with my university application.")}`;

  return (
    <div className="rounded-xl border border-[#e3ece9] bg-[#f6faf9] p-4">
      <p className="text-sm font-semibold text-[#0f1f1c]">Free help from a Students Traffic counsellor</p>
      <p className="mt-1 text-sm text-[#4b5563]">
        A counsellor reviews your application with you, checks your documents and contacts you about the next steps.
        Counselling is free. The university makes the admission decision, so we can&apos;t promise a place.
      </p>
      {compact ? null : (
        <p className="mt-1 text-sm text-[#4b5563]">
          For the quickest reply, message us on WhatsApp with your application reference.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={dashboardButton.primary}>
          <MessageCircle className="size-4" />
          WhatsApp a counsellor
        </a>
        <Link href="/dashboard/messages" className={dashboardButton.secondary}>
          <MessagesSquare className="size-4" />
          Ask a student guide
        </Link>
      </div>
    </div>
  );
}
