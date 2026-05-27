import { emailBase, iconCircle } from "@/lib/email/base";
import { sendEmail } from "@/lib/email/brevo";

interface PeerCallAcceptedParams {
  studentName: string;
  studentEmail: string;
  peerName: string;
  universityName: string;
}

export async function sendPeerCallAcceptedEmail(params: PeerCallAcceptedParams) {
  const studentFirstName = params.studentName.split(" ")[0];
  const peerFirstName = params.peerName.split(" ")[0];
  const callsUrl = "https://studentstraffic.com/dashboard/calls";

  const html = emailBase({
    previewText: `${params.peerName} accepted your call request. You can now start a call from your dashboard.`,
    body: `
      ${iconCircle("check", "success")}

      <h1 class="email-heading">Your request was accepted!</h1>
      <p class="email-subheading">
        Great news, ${studentFirstName}! ${params.peerName} has accepted your call request.<br />
        Head to your dashboard to start the call whenever you&rsquo;re ready.
      </p>

      <div class="info-card">
        <div class="info-card-title">Your guide</div>
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

      <div class="note-box note-box-info">
        <strong>Tip:</strong> Make sure you have a quiet space and a stable internet connection before starting the call.
      </div>

      <hr class="divider" />

      <a href="${callsUrl}" class="btn-primary">Start your call with ${peerFirstName}</a>
    `,
  });

  return sendEmail({
    to: { email: params.studentEmail, name: params.studentName },
    subject: `${peerFirstName} accepted your call request — Students Traffic`,
    htmlContent: html,
  });
}
