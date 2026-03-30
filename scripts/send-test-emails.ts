import { sendApplicationReceivedEmail } from "../lib/email/templates/application-received";
import { sendApplicationApprovedEmail } from "../lib/email/templates/application-approved";
import { sendApplicationRejectedEmail } from "../lib/email/templates/application-rejected";
import { sendAdminNewApplicationEmail } from "../lib/email/templates/admin-new-application";
import { sendPeerConnectionSentEmail } from "../lib/email/templates/peer-connection-sent";
import { sendPeerNewRequestEmail } from "../lib/email/templates/peer-new-request";

const TEST_EMAIL = "vasireddybharatsai@gmail.com";
const TEST_NAME  = "Bharat Vasireddy";

async function run() {
  console.log("Sending test emails…\n");

  await sendApplicationReceivedEmail({
    applicantName: TEST_NAME,
    applicantEmail: TEST_EMAIL,
    universityName: "Hanoi Medical University",
  });
  console.log("✓ application-received");

  await sendApplicationApprovedEmail({
    applicantName: TEST_NAME,
    applicantEmail: TEST_EMAIL,
    universityName: "Hanoi Medical University",
    universitySlug: "hanoi-medical-university",
  });
  console.log("✓ application-approved");

  await sendApplicationRejectedEmail({
    applicantName: TEST_NAME,
    applicantEmail: TEST_EMAIL,
    universityName: "Hanoi Medical University",
    reviewNotes: "The enrollment document you provided was unclear. Please reapply with a higher-resolution scan.",
  });
  console.log("✓ application-rejected");

  await sendAdminNewApplicationEmail({
    applicationId: 999,
    applicantName: TEST_NAME,
    applicantEmail: TEST_EMAIL,
    applicantPhone: "+91 98800 12345",
    universityName: "Hanoi Medical University",
    enrollmentStatus: "current_student",
    courseName: "MBBS",
    currentYearOrBatch: "3rd Year",
  });
  console.log("✓ admin-new-application");

  await sendPeerConnectionSentEmail({
    requesterName: TEST_NAME,
    requesterEmail: TEST_EMAIL,
    peerName: "Priya Sharma",
    peerPhone: "+919876500002",
    universityName: "Hanoi Medical University",
  });
  console.log("✓ peer-connection-sent");

  await sendPeerNewRequestEmail({
    peerName: TEST_NAME,
    peerEmail: TEST_EMAIL,
    requesterName: "Rahul Gupta",
    requesterPhone: "+919876500003",
    requesterEmail: "rahul@example.com",
    universityName: "Hanoi Medical University",
  });
  console.log("✓ peer-new-request");

  console.log("\nAll 6 emails sent to", TEST_EMAIL);
}

run().catch(console.error);
