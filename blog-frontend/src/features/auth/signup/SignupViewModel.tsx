import { useSignupModel } from "./SignupModel";
import { SignupView } from "./SignupView";

export function SignupViewModel() {
  const methods = useSignupModel();
  return <SignupView {...methods} />;
}
