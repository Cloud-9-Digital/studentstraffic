import { emailBase, iconCircle } from "@/lib/email/base";
import { sendEmail } from "@/lib/email/brevo";
import { env } from "@/lib/env";

interface AdminNewApplicationParams {
  applicationId: number;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  universityName: string;
  enrollmentStatus: "current_student" | "alumnus" | string;
  courseName?: string | null;
  currentYearOrBatch?: string | null;
}

export async function sendAdminNewApplicationEmail(params: AdminNewApplicationParams) {
  const reviewUrl = `${env.siteUrl}/admin/peer-applications/${params.applicationId}`;
  const statusLabel = params.enrollmentStatus === "current_student" ? "Current student" : "Alumnus";
  const courseLabel = [params.courseName, params.currentYearOrBatch].filter(Boolean).join(" · ") || "—";

  const html = emailBase({
    previewText: `New peer guide application from ${params.applicantName} (${params.universityName}).`,
    body: `
      ${iconCircle("bell", "info")}

      <h1 class="email-heading">New application to review</h1>
      <p class="email-subheading">
        A new peer guide application has been submitted and is waiting for your review.
      </p>

      <div class="info-card">
        <div class="info-card-title">Applicant details</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td class="info-label" style="padding-bottom:10px;width:130px;vertical-align:top;">Name</td>
            <td class="info-value" style="padding-bottom:10px;">${params.applicantName}</td>
          </tr>
          <tr>
            <td class="info-label" style="padding-bottom:10px;width:130px;vertical-align:top;">University</td>
            <td class="info-value" style="padding-bottom:10px;">${params.universityName}</td>
          </tr>
          <tr>
            <td class="info-label" style="padding-bottom:10px;width:130px;vertical-align:top;">Status</td>
            <td class="info-value" style="padding-bottom:10px;">${statusLabel}</td>
          </tr>
          <tr>
            <td class="info-label" style="padding-bottom:10px;width:130px;vertical-align:top;">Course / Year</td>
            <td class="info-value" style="padding-bottom:10px;">${courseLabel}</td>
          </tr>
          <tr>
            <td class="info-label" style="width:130px;vertical-align:top;">Phone</td>
            <td class="info-value">${params.applicantPhone}</td>
          </tr>
        </table>
      </div>

      <hr class="divider" />

      <a href="${reviewUrl}" class="btn-primary">Review application &rarr;</a>
    `,
  });

  return sendEmail({
    to: { email: env.brevoAdminEmail, name: "Students Traffic Admin" },
    subject: `New peer application: ${params.applicantName} — ${params.universityName}`,
    htmlContent: html,
  });
}
