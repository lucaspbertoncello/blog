import { useState } from "react"

export function usePasswordVisibility() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  return { showPassword, setShowPassword, setShowConfirm, showConfirm }
}
