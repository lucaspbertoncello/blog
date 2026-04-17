import { usePasswordVisibility } from "./hooks/usePasswordVisibility";
import { useSignupForm } from "./hooks/useSignupForm";

export function useSignupModel() {
  const passwordVisibilityControl = usePasswordVisibility();
  const signupForm = useSignupForm();

  return { passwordVisibilityControl, signupForm };
}
