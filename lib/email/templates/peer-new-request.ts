import { emailBase, iconCircle } from "@/lib/email/base";
import { sendEmail } from "@/lib/email/brevo";

interface PeerNewRequestParams {
  peerName: string;
  peerEmail: string;
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;
  universityName: string;
}

export async function sendPeerNewRequestEmail(params: PeerNewRequestParams) {
  const peerFirstName = params.peerName.split(" ")[0];
  const requesterFirstName = params.requesterName.split(" ")[0];
  const whatsappUrl = `https://wa.me/${params.requesterPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${requesterFirstName}! I'm ${params.peerName} from ${params.universityName}. I saw you reached out on Students Traffic — happy to help!`)}`;

  const html = emailBase({
    previewText: `${params.requesterName} wants to connect with you about ${params.universityName}.`,
    body: `
      ${iconCircle("bell", "brand")}

      <h1 class="email-heading">New connection request</h1>
      <p class="email-subheading">
        Hi ${peerFirstName}! Someone found your profile on Students Traffic and wants to hear about your experience at ${params.universityName}.
      </p>

      <div class="info-card">
        <div class="info-card-title">Student details</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td class="info-label" style="padding-bottom:10px;width:110px;vertical-align:top;">Name</td>
            <td class="info-value" style="padding-bottom:10px;">${params.requesterName}</td>
          </tr>
          <tr>
            <td class="info-label" style="padding-bottom:10px;width:110px;vertical-align:top;">Phone</td>
            <td class="info-value" style="padding-bottom:10px;">
              <a href="${whatsappUrl}" style="color:#c2410c;font-weight:500;">${params.requesterPhone}</a>
            </td>
          </tr>
          <tr>
            <td class="info-label" style="width:110px;vertical-align:top;">University</td>
            <td class="info-value">${params.universityName}</td>
          </tr>
        </table>
      </div>

      <div class="note-box note-box-info">
        <strong>Heads up:</strong> We've let ${requesterFirstName} know you'll be in touch. A quick reply goes a long way — they may be deciding on a university right now.
      </div>

      <hr class="divider" />

      <a href="${whatsappUrl}" class="btn-whatsapp">Reply on WhatsApp</a>
    `,
  });

  return sendEmail({
    to: { email: params.peerEmail, name: params.peerName },
    subject: `New connection request from ${params.requesterName} — Students Traffic`,
    htmlContent: html,
  });
}
