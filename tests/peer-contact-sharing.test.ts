import assert from "node:assert/strict";
import test from "node:test";

import { connectToPeerAction } from "../app/_actions/connect-to-peer";
import { quickConnectToPeerAction } from "../app/_actions/quick-connect-to-peer";

test("retired contact-sharing form rejects old clients", async () => {
  const form = new FormData();
  form.set("peerId", "1");
  form.set("email", "student@example.com");
  form.set("phone", "+919000000000");
  const result = await connectToPeerAction({}, form);
  assert.equal(result.success, undefined);
  assert.match(result.error!, /in-app chat and calls/);
});

test("retired quick connect rejects old clients without requesting contact details", async () => {
  const result = await quickConnectToPeerAction(1, "example-university");
  assert.equal(result.success, undefined);
  assert.equal(result.missingPhone, undefined);
  assert.match(result.error!, /in-app chat and calls/);
});
