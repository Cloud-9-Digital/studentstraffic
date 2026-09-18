"use server";

export type ConnectToPeerState = { error?: string; success?: boolean; missingPhone?: boolean };

// Retired: old clients must not create contact-sharing requests or send emails.
export async function connectToPeerAction(_prevState: ConnectToPeerState, _formData: FormData): Promise<ConnectToPeerState> {
  void _prevState;
  void _formData;
  return { error: "Contact sharing is unavailable. Please use in-app chat and calls." };
}
