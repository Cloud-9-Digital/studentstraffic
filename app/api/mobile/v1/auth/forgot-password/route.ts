import { mobileJson, mobileValidationError, readJson } from "@/lib/mobile/http";
import { mobileForgotPasswordSchema } from "@/lib/mobile/schemas";

export async function POST(request: Request) {
  const parsed = mobileForgotPasswordSchema.safeParse(await readJson(request));
  if (!parsed.success) return mobileValidationError(parsed.error);

  // Preserve account privacy. The actual email reset flow can be connected to
  // the transactional email provider without changing the mobile contract.
  return mobileJson({
    success: true,
    message: "If an account exists, password reset instructions will be sent.",
  });
}
