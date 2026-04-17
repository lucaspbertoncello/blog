import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useSearch } from "@tanstack/react-router";
import { useVerifyCode } from "@/domain/auth/hooks/useVerifyCode";

export const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Código deve ter 6 dígitos"),
});

export function useVerifyCodeForm() {
  const { email = "" } = useSearch({ strict: false }) as { email?: string };
  const { mutate, isPending } = useVerifyCode();

  const form = useForm({
    defaultValues: {
      email,
      code: "",
    },
    validators: {
      onChange: verifyCodeSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  return { form, isVerifying: isPending };
}
