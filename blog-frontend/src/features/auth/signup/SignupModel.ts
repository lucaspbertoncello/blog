import { usePasswordVisibility } from "./hooks/usePasswordVisibility"
import { useSignupForm } from "./hooks/useSignupForm"

export function useSignupModel() {
  const passwordVisibilityControl = usePasswordVisibility()
  const { form } = useSignupForm()

  return { passwordVisibilityControl, form }
}
