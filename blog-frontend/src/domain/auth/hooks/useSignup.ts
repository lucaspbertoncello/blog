import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { signup } from "../services/signup";

export function useSignup() {
  const methods = useMutation({
    mutationKey: ["signup"],
    mutationFn: signup,

    onSuccess() {
      toast.success("Conta criada com sucesso");
    },

    onError(error) {
      toast.error(getApiErrorMessage(error));
    },
  });

  return methods;
}
