import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useSignin } from "@/domain/auth/hooks/useSignin";

export const signinSchema = z.object({
  email: z.string().min(1, "Email obrigatório").email("Endereço de email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export function useSigninForm() {
  const { mutate, isPending } = useSignin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: signinSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  return { form, isSigningIn: isPending };
}
