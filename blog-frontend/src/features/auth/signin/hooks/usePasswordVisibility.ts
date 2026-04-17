import { useState } from "react";

export function usePasswordVisibility() {
  const [showPassword, setShowPassword] = useState(false);

  return { showPassword, setShowPassword };
}
