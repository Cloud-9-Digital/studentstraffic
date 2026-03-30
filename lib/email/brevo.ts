import { env } from "@/lib/env";

export interface SendEmailOptions {
  to: { email: string; name?: string } | Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  if (!env.hasBrevo) {
    console.warn("[email] BREVO_API_KEY not set — skipping email send.");
    return false;
  }

  const recipients = Array.isArray(options.to) ? options.to : [options.to];

  const body = {
    sender: {
      name: "Students Traffic",
      email: env.brevoSenderEmail,
    },
    replyTo: options.replyTo ?? {
      email: env.brevoReplyToEmail,
      name: "Students Traffic",
    },
    to: recipients,
    subject: options.subject,
    htmlContent: options.htmlContent,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": env.brevoApiKey!,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[email] Brevo error ${response.status}:`, text);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[email] Failed to send email:", err);
    return false;
  }
}
