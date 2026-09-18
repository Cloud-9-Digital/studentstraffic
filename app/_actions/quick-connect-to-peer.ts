"use server";

export type QuickConnectState = { error?: string; success?: boolean; missingPhone?: boolean };

// Retired: old clients must not create contact-sharing requests or send emails.
export async function quickConnectToPeerAction(_peerId: number, _universitySlug: string): Promise<QuickConnectState> {
  void _peerId;
  void _universitySlug;
  return { error: "Contact sharing is unavailable. Please use in-app chat and calls." };
}
