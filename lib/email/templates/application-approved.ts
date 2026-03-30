import { emailBase, iconCircle, stepRow } from "@/lib/email/base";
import { sendEmail } from "@/lib/email/brevo";

interface ApplicationApprovedParams {
  applicantName: string;
  applicantEmail: string;
  universityName: string;
  universitySlug: string;
}

export async function sendApplicationApprovedEmail(params: ApplicationApprovedParams) {
  const firstName = params.applicantName.split(" ")[0];
  const profileUrl = `https://studentstraffic.com/students`;

  const html = emailBase({
    previewText: `Congratulations ${firstName}! Your profile is now live on Students Traffic.`,
    body: `
      ${iconCircle("check", "success")}

      <h1 class="email-heading">You&rsquo;re approved!</h1>
      <p class="email-subheading">
        Congratulations, ${firstName}! Your profile is now live on Students Traffic.<br />
        Aspiring students at ${params.universityName} can now find and connect with you.
      </p>

      <div class="note-box note-box-info">
        <strong>Your profile is live.</strong> Students searching for guidance at ${params.universityName} can now see your profile and request to connect with you on WhatsApp.
      </div>

      <div class="info-card">
        <div class="info-card-title">Profile details</div>
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
              <span style="display:inline-block;background-color:#dcfce7;color:#14532d;font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;letter-spacing:0.02em;">Active</span>
            </td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom:28px;">
        ${stepRow("whatsapp", "Students can now reach you on WhatsApp", "When a student requests your contact, they fill in their details first — you'll receive genuine, interested enquiries.")}
        ${stepRow("link", "Share your university page", "Help more students find your profile by sharing the link to your university page with your network.")}
      </div>

      <hr class="divider" />

      <a href="${profileUrl}" class="btn-primary">View the students page</a>
    `,
  });

  return sendEmail({
    to: { email: params.applicantEmail, name: params.applicantName },
    subject: `You're approved — your profile is live on Students Traffic`,
    htmlContent: html,
  });
}
