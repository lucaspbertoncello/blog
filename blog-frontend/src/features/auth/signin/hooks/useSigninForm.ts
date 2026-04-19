import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useSignin } from "@/domain/auth/hooks/useSignin";
import { useNavigate } from "@tanstack/react-router";

export const signinSchema = z.object({
  email: z.string().min(1, "Email obrigatório").email("Endereço de email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export function useSigninForm() {
  const { mutate, isPending } = useSignin();
  const navigate = useNavigate({ from: "/auth/signin" });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: signinSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value, {
        onSuccess: () => {
          navigate({ to: "/" });
        },
      });
    },
  });

  return { form, isSigningIn: isPending };
}
