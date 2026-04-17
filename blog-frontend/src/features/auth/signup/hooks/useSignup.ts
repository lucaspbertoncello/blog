import { useMutation } from "@tanstack/react-query";
import { signup } from "../services/signup";
import { toast } from "sonner";

export function useSignup() {
  const methods = useMutation({
    mutationKey: ["signup"],
    mutationFn: signup,

    onSuccess() {
      toast.success("Conta criada com sucesso");
    },

    onError() {
      toast.error("Algo deu errado ao criar sua conta. Tente novamente");
    },
  });

  return methods;
}
