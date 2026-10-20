/**
 * The CRM organization's active `state` select options, verified through
 * GET /api/v1/lead-fields. Keep this allowlist aligned before adding new
 * fields — a value outside it is dropped silently by the CRM.
 *
 * Its own module so both the CRM payload builder and the public forms that
 * must offer exactly these values can read it, without a form pulling the CRM
 * field mapping into the browser bundle.
 */
export const CRM_INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi",
  "Puducherry", "Ladakh", "Jammu and Kashmir",
] as const;
