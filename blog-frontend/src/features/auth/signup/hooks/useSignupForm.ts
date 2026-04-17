import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useSignup } from "@/domain/auth/hooks/useSignup";

export const signupSchema = z
  .object({
    email: z.string().min(1, "Email obrigatório").email("Endereço de email inválido"),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export function useSignupForm() {
  const { mutate, isPending } = useSignup();

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
      mutate(value);
    },
  });

  return { form, isCreatingAccount: isPending };
}
