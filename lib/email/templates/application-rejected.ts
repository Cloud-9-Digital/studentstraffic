import { emailBase, iconCircle } from "@/lib/email/base";
import { sendEmail } from "@/lib/email/brevo";

interface ApplicationRejectedParams {
  applicantName: string;
  applicantEmail: string;
  universityName: string;
  reviewNotes?: string | null;
}

export async function sendApplicationRejectedEmail(params: ApplicationRejectedParams) {
  const firstName = params.applicantName.split(" ")[0];

  const reviewNotesBlock = params.reviewNotes
    ? `<div class="note-box note-box-warn"><strong>Feedback from our team:</strong><br />${params.reviewNotes}</div>`
    : "";

  const html = emailBase({
    previewText: `Update on your Students Traffic application, ${firstName}.`,
    body: `
      ${iconCircle("x", "error")}

      <h1 class="email-heading">Application not approved</h1>
      <p class="email-subheading">
        Hi ${firstName}, thank you for taking the time to apply.<br />
        Unfortunately, we weren&apos;t able to approve your application at this time.
      </p>

      <div class="info-card">
        <div class="info-card-title">Your application</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td class="info-label" style="padding-bottom:10px;width:110px;vertical-align:top;">Name</td>
            <td class="info-value" style="padding-bottom:10px;">${params.applicantName}</td>
          </tr>
          <tr>
            <td class="info-label" style="padding-bottom:10px;width:110px;vertical-align:top;">University</td>
            <td class="info-value" style="padding-bottom:10px;">${params.universityName}</td>
          </tr>
          <tr>
            <td class="info-label" style="width:110px;vertical-align:top;">Status</td>
            <td style="padding:2px 0;">
              <span style="display:inline-block;background-color:#fee2e2;color:#9f1239;font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;letter-spacing:0.02em;">Not approved</span>
            </td>
          </tr>
        </table>
      </div>

      ${reviewNotesBlock}

      <p style="font-size:14px;color:#475569;line-height:1.7;margin-bottom:20px;">
        Common reasons an application may not be approved include unclear proof of enrollment, mismatched details, or documents that couldn&apos;t be verified. If you believe this is a mistake or have updated documents, you&apos;re welcome to reach out to us.
      </p>

      <hr class="divider" />

      <a href="https://studentstraffic.com/join" class="btn-primary">Re-apply with updated documents</a>
      <a href="https://studentstraffic.com/students" class="btn-secondary">Browse student guides</a>
    `,
  });

  return sendEmail({
    to: { email: params.applicantEmail, name: params.applicantName },
    subject: "Update on your Students Traffic application",
    htmlContent: html,
  });
}
