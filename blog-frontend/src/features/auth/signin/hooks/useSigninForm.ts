import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useSignin } from "@/domain/auth/hooks/useSignin";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import { useUserStore } from "@/domain/users/stores/useUserStore";
import { getMe } from "@/domain/users/services/getMe";
import { useShallow } from "zustand/react/shallow";

export const signinSchema = z.object({
  email: z.string().min(1, "Email obrigatório").email("Endereço de email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export function useSigninForm() {
  const { mutate, isPending } = useSignin();
  const navigate = useNavigate({ from: "/auth/signin" });

  const { setAuthTokens } = useAuthStore(
    useShallow((state) => ({
      setAuthTokens: state.setAuthTokens,
    }))
  );

  const { setAccountData } = useUserStore(
    useShallow((state) => ({
      setAccountData: state.setAccountData,
    }))
  );

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
        onSuccess: async (response) => {
          setAuthTokens(response);
          const account = await getMe();
          setAccountData({ account });
          navigate({ to: "/" });
        },
      });
    },
  });

  return { form, isSigningIn: isPending };
}
