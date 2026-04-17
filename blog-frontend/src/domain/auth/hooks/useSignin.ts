import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { signin } from "../services/signin";

export function useSignin() {
  const methods = useMutation({
    mutationKey: ["signin"],
    mutationFn: signin,

    onSuccess() {
      toast.success("Login realizado com sucesso");
    },

    onError(error) {
      toast.error(getApiErrorMessage(error));
    },
  });

  return methods;
}
