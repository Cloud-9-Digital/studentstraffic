import assert from "node:assert/strict";
import test from "node:test";

import { getProgrammeEligibilityItems } from "../lib/program-eligibility";

test("programme admissions text does not hide exact qualification and admission-category restrictions", () => {
  const items = getProgrammeEligibilityItems(
    ["Qualify JAM in Physics and meet the required degree aggregate."],
    {
      eligibleAudiences: ["Applicants using the verified regular domestic route"],
      restrictions: [
        "Accepted degrees: B.Sc. Physics or B.Sc. Applied Physics with the specified semester subjects.",
        "Overseas admission and tuition require a separate category assessment.",
      ],
    },
  );
  assert.ok(items.some((item) => item.includes("Qualify JAM")));
  assert.ok(items.some((item) => item.includes("B.Sc. Applied Physics")));
  assert.ok(items.some((item) => item.includes("Overseas admission and tuition")));
  assert.ok(items.some((item) => item.includes("regular domestic route")));
});
