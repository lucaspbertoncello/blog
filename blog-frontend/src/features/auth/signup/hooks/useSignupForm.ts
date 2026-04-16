import { useForm } from "@tanstack/react-form"
import { z } from "zod"

export const signupSchema = z
  .object({
    email: z.string().min(1, "Email obrigatório").email("Endereço de email inválido"),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export type SignupSchema = z.infer<typeof signupSchema>

export function useSignupForm() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: signupSchema,
    },
    onSubmit: ({ value }) => {
      console.log(value)
    },
  })

  return { form }
}
