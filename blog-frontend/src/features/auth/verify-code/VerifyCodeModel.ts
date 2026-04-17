import { useResendCooldown } from "./hooks/useResendCooldown";
import { useVerifyCodeForm } from "./hooks/useVerifyCodeForm";

export function useVerifyCodeModel() {
  const resendCooldown = useResendCooldown();
  const verifyCodeForm = useVerifyCodeForm();

  return { resendCooldown, verifyCodeForm };
}
