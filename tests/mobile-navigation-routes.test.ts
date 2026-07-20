import assert from "node:assert/strict";
import test from "node:test";

import { usesMobileBottomNavigation } from "@/components/site/mobile-navigation-routes";

test("uses persistent navigation on discovery routes only", () => {
  assert.equal(usesMobileBottomNavigation("/"), true);
  assert.equal(usesMobileBottomNavigation("/universities"), true);
  assert.equal(usesMobileBottomNavigation("/countries/germany"), true);
  assert.equal(usesMobileBottomNavigation("/cities/berlin"), true);
  assert.equal(usesMobileBottomNavigation("/courses/computer-science"), true);
  assert.equal(usesMobileBottomNavigation("/university/technical-university-of-munich"), false);
  assert.equal(usesMobileBottomNavigation("/blog/study-in-germany"), false);
  assert.equal(usesMobileBottomNavigation("/contact"), false);
});
