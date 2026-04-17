import { useVerifyCodeModel } from "./VerifyCodeModel";
import { VerifyCodeView } from "./VerifyCodeView";

export function VerifyCodeViewModel() {
  const methods = useVerifyCodeModel();
  return <VerifyCodeView {...methods} />;
}
