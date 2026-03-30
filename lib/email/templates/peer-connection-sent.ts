import { emailBase, iconCircle, stepRow } from "@/lib/email/base";
import { sendEmail } from "@/lib/email/brevo";

interface PeerConnectionSentParams {
  requesterName: string;
  requesterEmail: string;
  peerName: string;
  peerPhone: string | null;
  universityName: string;
}

export async function sendPeerConnectionSentEmail(params: PeerConnectionSentParams) {
  const peerFirstName = params.peerName.split(" ")[0];
  const requesterFirstName = params.requesterName.split(" ")[0];

  const whatsappBlock = params.peerPhone
    ? `<a href="https://wa.me/${params.peerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${peerFirstName}! I found your profile on Students Traffic and would love to hear about your experience at ${params.universityName}.`)}" class="btn-whatsapp">
        <table cellpadding="0" cellspacing="0" style="display:inline-table;vertical-align:middle;margin-right:8px;"><tr><td style="color:#ffffff;vertical-align:middle;">Open WhatsApp chat with ${peerFirstName}</td></tr></table>
      </a>`
    : "";

  const html = emailBase({
    previewText: `You're connected! ${peerFirstName} from ${params.universityName} will reach out to you shortly.`,
    body: `
      ${iconCircle("check", "success")}

      <h1 class="email-heading">You&rsquo;re all set, ${requesterFirstName}!</h1>
      <p class="email-subheading">
        Your request has been sent to ${params.peerName}.<br />
        They will reach out to you as soon as possible.
      </p>

      <div class="info-card">
        <div class="info-card-title">What we&rsquo;ve done</div>
        <div style="margin-bottom:0;">
          ${stepRow("mail", `Your details shared with ${peerFirstName}`, `We've sent ${peerFirstName} your name and phone number so they can reach you directly.`)}
          ${stepRow("whatsapp", `${peerFirstName}'s contact shared with you`, `${peerFirstName}'s WhatsApp contact has been shared below so you can also reach out first.`)}
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-title">Your student guide</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td class="info-label" style="padding-bottom:10px;width:110px;vertical-align:top;">Name</td>
            <td class="info-value" style="padding-bottom:10px;">${params.peerName}</td>
          </tr>
          <tr>
            <td class="info-label" style="width:110px;vertical-align:top;">University</td>
            <td class="info-value">${params.universityName}</td>
          </tr>
        </table>
      </div>

      <hr class="divider" />

      ${whatsappBlock}
      <a href="https://studentstraffic.com/students" class="btn-secondary">Browse more student guides</a>
    `,
  });

  return sendEmail({
    to: { email: params.requesterEmail, name: params.requesterName },
    subject: `${peerFirstName} will reach out to you soon — Students Traffic`,
    htmlContent: html,
  });
}
