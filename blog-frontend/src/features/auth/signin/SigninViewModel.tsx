import { useSigninModel } from "./SigninModel";
import { SigninView } from "./SigninView";

export function SigninViewModel() {
  const methods = useSigninModel();
  return <SigninView {...methods} />;
}
