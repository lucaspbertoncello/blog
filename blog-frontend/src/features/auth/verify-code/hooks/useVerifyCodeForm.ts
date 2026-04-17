import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useVerifyCode } from "@/domain/auth/hooks/useVerifyCode";

export const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Código deve ter 6 dígitos"),
});

export function useVerifyCodeForm() {
  // beforeLoad in the route guarantees email is a valid string at this point
  const { email } = useSearch({ strict: true, from: "/auth/verify-code" });
  const { mutate, isPending } = useVerifyCode();
  const navigate = useNavigate({ from: "/verify-code" });

  const form = useForm({
    defaultValues: {
      email: email!,
      code: "",
    },
    validators: {
      onChange: verifyCodeSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value, { onSuccess: () => navigate({ to: "/signin" }) });
    },
  });

  return { form, isVerifying: isPending };
}
