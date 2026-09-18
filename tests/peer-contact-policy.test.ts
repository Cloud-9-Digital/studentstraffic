import assert from "node:assert/strict";
import test from "node:test";
import { containsPeerContactDetails, peerSafeText } from "../lib/peer-contact-policy";

for (const text of [
  "My phone number is 5551234", "Email me at student@example.com", "student [at] gmail [dot] com",
  "student @ gmail . com", "+91 98765 43210", "98765-43210",
  "９８７６５４３２１０", "٩٨٧٦٥٤٣٢١٠", "۹۸۷۶۵۴۳۲۱۰", "९८७६५४३२१०",
  "98\u200b76543210", "nine eight seven six five four three two one zero",
  "wa.me/919876543210", "https://example.com/contact", "@studentguide",
  "Find me on Instagram", "My telegram username is studentguide",
]) {
  test(`blocks contact exchange: ${text}`, () => assert.equal(containsPeerContactDetails(text), true));
}
for (const text of [
  "What is hostel life like?", "The annual fee is 1500000 INR.",
  "The course lasts 6 years and starts in 2026.", "Can we call in the app at 5 pm?",
  "I use WhatsApp to talk to my family.",
]) {
  test(`allows study discussion: ${text}`, () => assert.equal(containsPeerContactDetails(text), false));
}

test("hides historic contact text while preserving study discussion", () => {
  assert.match(peerSafeText("Email me at student@example.com"), /Contact details hidden/);
  assert.equal(peerSafeText("How is the hostel?"), "How is the hostel?");
});
