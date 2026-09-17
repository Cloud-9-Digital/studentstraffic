/**
 * Single source of truth for which destinations a lead syncs to, based on
 * where it came from. Add a new flow here rather than sprinkling
 * `sourcePath === "..."` checks across lib/lead-sync.ts, background-jobs.ts,
 * and submit-lead.ts.
 */

export type LeadDeliveryFlow = "neetPredictor" | "seminar" | "default";

export type LeadDeliveryRoute = {
  crm: boolean;
  pabbly: boolean;
  whatsapp: boolean;
};

export const NEET_PREDICTOR_SOURCE_PATH = "/neet-college-predictor";
const SEMINAR_SOURCE_PATH_PREFIX = "/seminar-2026";

// Pabbly is off for every flow: its automation scenario sends its own WhatsApp
// message on receipt regardless of the whatsapp flag below, which caused
// unwanted/duplicate messages we don't control from this codebase. WhatsApp
// now goes through WATI directly (the whatsapp flag), and Google Sheets
// logging goes through lib/google-sheets.ts -- neither depends on Pabbly.
//
// LeadSquared was a fourth destination and the predictor flow's only one,
// taking just the leads that scored under 400. It is retired across every
// Aieraa repo, so that flow now goes to the CRM — and goes in full: the CRM is
// the single system of record, so a predictor lead is worth having there
// whatever the score.
const ROUTES: Record<LeadDeliveryFlow, LeadDeliveryRoute> = {
  neetPredictor: { crm: true, pabbly: false, whatsapp: false },
  seminar: { crm: true, pabbly: false, whatsapp: true },
  default: { crm: true, pabbly: false, whatsapp: true },
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
