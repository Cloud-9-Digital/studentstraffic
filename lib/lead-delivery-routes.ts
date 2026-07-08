/**
 * Single source of truth for which destinations a lead syncs to, based on
 * where it came from. Add a new flow here rather than sprinkling
 * `sourcePath === "..."` checks across lib/lead-sync.ts, background-jobs.ts,
 * and submit-lead.ts.
 */

export type LeadDeliveryFlow = "neetPredictor" | "seminar" | "default";

export type LeadDeliveryRoute = {
  crm: boolean;
  leadSquared: boolean;
  pabbly: boolean;
  whatsapp: boolean;
};

export const NEET_PREDICTOR_SOURCE_PATH = "/neet-college-predictor";
const SEMINAR_SOURCE_PATH_PREFIX = "/seminar-2026";

const ROUTES: Record<LeadDeliveryFlow, LeadDeliveryRoute> = {
  neetPredictor: { crm: false, leadSquared: true, pabbly: true, whatsapp: false },
  seminar: { crm: true, leadSquared: false, pabbly: true, whatsapp: true },
  default: { crm: true, leadSquared: false, pabbly: true, whatsapp: true },
};

export function getLeadDeliveryFlow(sourcePath: string): LeadDeliveryFlow {
  if (sourcePath === NEET_PREDICTOR_SOURCE_PATH) {
    return "neetPredictor";
  }

  if (sourcePath.startsWith(SEMINAR_SOURCE_PATH_PREFIX)) {
    return "seminar";
  }

  return "default";
}

export function getLeadDeliveryRoute(sourcePath: string): LeadDeliveryRoute {
  return ROUTES[getLeadDeliveryFlow(sourcePath)];
}
