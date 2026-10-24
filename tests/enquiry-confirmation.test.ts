import assert from "node:assert/strict";
import test from "node:test";
import { encodeEnquiryReceipt, enquiryReceiptCookieOptions, formatEnquiryInterest, readEnquiryReceipt, storeEnquiryReceipt } from "../lib/enquiry-confirmation";

test("a successful submission receipt preserves the submitted name and canonical university label", () => {
  const cookie = encodeEnquiryReceipt({ fullName: "  Bharat   Vasireddy ", interest: "J.P. College of Engineering", eventId: "lead-123" }, 1000);
  const receipt = readEnquiryReceipt(cookie, "lead-123", 2000);
  assert.equal(receipt?.name, "Bharat Vasireddy");
  assert.equal(receipt?.interest, "J.P. College of Engineering");
  assert.equal(enquiryReceiptCookieOptions.httpOnly, true);
  assert.equal(enquiryReceiptCookieOptions.path, "/thank-you");
  assert.equal(enquiryReceiptCookieOptions.maxAge, 900);
});

test("the success receipt is stored in the scoped HTTP-only cookie", () => {
  const calls: unknown[][] = [];
  storeEnquiryReceipt({ set: (...args) => calls.push(args) }, {
    fullName: "Bharat", interest: "J.P. College of Engineering", eventId: "success-id",
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "st_enquiry_receipt");
  assert.deepEqual(calls[0][2], enquiryReceiptCookieOptions);
  assert.equal(readEnquiryReceipt(calls[0][1] as string, "success-id")?.name, "Bharat");
});

test("expired, mismatched or malformed receipts never personalize another enquiry", () => {
  const cookie = encodeEnquiryReceipt({ fullName: "மாலதி", interest: "India", eventId: "one" }, 1000);
  assert.equal(readEnquiryReceipt(cookie, "two", 2000), undefined);
  assert.equal(readEnquiryReceipt(cookie, undefined, 2000), undefined);
  assert.equal(readEnquiryReceipt(cookie, "one", 901000), undefined);
  assert.equal(readEnquiryReceipt("%invalid", "one"), undefined);
  assert.equal(readEnquiryReceipt(encodeURIComponent("null"), "one"), undefined);
  assert.equal(readEnquiryReceipt(cookie, "one", 2000)?.name, "மாலதி");
});

test("old slug-based links use readable labels and preserve real display names", () => {
  assert.equal(formatEnquiryInterest("jp-college-of-engineering"), "J.P. College of Engineering");
  assert.equal(formatEnquiryInterest("united-kingdom"), "United Kingdom");
  assert.equal(formatEnquiryInterest("J.P. College of Engineering"), "J.P. College of Engineering");
  assert.equal(formatEnquiryInterest("study-abroad"), "study abroad");
  assert.equal(formatEnquiryInterest(undefined), "study abroad");
});
