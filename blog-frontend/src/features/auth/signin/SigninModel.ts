import { usePasswordVisibility } from "./hooks/usePasswordVisibility";
import { useSigninForm } from "./hooks/useSigninForm";

export function useSigninModel() {
  const passwordVisibilityControl = usePasswordVisibility();
  const signinForm = useSigninForm();

  return { passwordVisibilityControl, signinForm };
}
