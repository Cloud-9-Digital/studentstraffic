import { emailBase, iconCircle } from "@/lib/email/base";
import { sendEmail } from "@/lib/email/brevo";

interface PeerCallRequestParams {
  peerName: string;
  peerEmail: string;
  studentName: string;
  studentEmail: string;
  message: string;
  universityName: string;
}

export async function sendPeerCallRequestEmail(params: PeerCallRequestParams) {
  const peerFirstName = params.peerName.split(" ")[0];
  const studentFirstName = params.studentName.split(" ")[0];
  const dashboardUrl = "https://studentstraffic.com/dashboard/peer/requests";

  const html = emailBase({
    previewText: `${params.studentName} wants to have a call with you about ${params.universityName}.`,
    body: `
      ${iconCircle("bell", "brand")}

      <h1 class="email-heading">New call request</h1>
      <p class="email-subheading">
        Hi ${peerFirstName}! A student wants to call you and hear about your experience at ${params.universityName}.
      </p>

      <div class="info-card">
        <div class="info-card-title">Student details</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td class="info-label" style="padding-bottom:10px;width:110px;vertical-align:top;">Name</td>
            <td class="info-value" style="padding-bottom:10px;">${params.studentName}</td>
          </tr>
          <tr>
            <td class="info-label" style="padding-bottom:10px;width:110px;vertical-align:top;">Email</td>
            <td class="info-value" style="padding-bottom:10px;">
              <a href="mailto:${params.studentEmail}" style="color:#c2410c;">${params.studentEmail}</a>
            </td>
          </tr>
          <tr>
            <td class="info-label" style="width:110px;vertical-align:top;">Message</td>
            <td class="info-value">${params.message || "No message provided."}</td>
          </tr>
        </table>
      </div>

      <div class="note-box note-box-info">
        <strong>Action required:</strong> Accept or decline this request from your dashboard. ${studentFirstName} will be notified of your decision.
      </div>

      <hr class="divider" />

      <a href="${dashboardUrl}" class="btn-primary">Review request</a>
    `,
  });

  return sendEmail({
    to: { email: params.peerEmail, name: params.peerName },
    subject: `${params.studentName} wants to call you — Students Traffic`,
    htmlContent: html,
  });
}
