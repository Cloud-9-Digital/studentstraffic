import { emailBase, iconCircle, stepRow } from "@/lib/email/base";
import { sendEmail } from "@/lib/email/brevo";

interface ApplicationReceivedParams {
  applicantName: string;
  applicantEmail: string;
  universityName: string;
}

export async function sendApplicationReceivedEmail(params: ApplicationReceivedParams) {
  const firstName = params.applicantName.split(" ")[0];

  const html = emailBase({
    previewText: `We've received your application, ${firstName}. Our team will review it within 2–3 business days.`,
    body: `
      ${iconCircle("clock", "pending")}

      <h1 class="email-heading">Application received</h1>
      <p class="email-subheading">
        Thanks for applying to be a student guide on Students Traffic, ${firstName}.<br />
        We're reviewing your application and will be in touch soon.
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
              <span style="display:inline-block;background-color:#fef3c7;color:#92400e;font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;letter-spacing:0.02em;">Under review</span>
            </td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom:28px;">
        ${stepRow("search", "We verify your application", "Our team will review your proof of enrollment within <strong>2–3 business days</strong>.")}
        ${stepRow("mail", "You get a confirmation", "We'll send you an update by email with the outcome.")}
        ${stepRow("user", "Your profile goes live", "Once approved, aspiring students can find and connect with you directly on WhatsApp.")}
      </div>

      <hr class="divider" />

      <p style="font-size:13px;color:#64748b;text-align:center;line-height:1.6;margin-bottom:20px;">
        While you wait, explore student guides from other universities.
      </p>
      <a href="https://studentstraffic.com/students" class="btn-primary">Browse student guides</a>
    `,
  });

  return sendEmail({
    to: { email: params.applicantEmail, name: params.applicantName },
    subject: "We've received your application — Students Traffic",
    htmlContent: html,
  });
}
