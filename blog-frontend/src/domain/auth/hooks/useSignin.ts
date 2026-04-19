import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { signin } from "../services/signin";
import { useAuthStore } from "../stores/useAuthStore";
import { useUserStore } from "@/domain/users/stores/useUserStore";
import { getMe } from "@/domain/users/services/getMe";

export function useSignin() {
  const setAuthTokens = useAuthStore((state) => state.setAuthTokens);
  const setAccountData = useUserStore((state) => state.setAccountData);

  const methods = useMutation({
    mutationKey: ["signin"],
    mutationFn: signin,

    async onSuccess(data) {
      setAuthTokens(data);
      const account = await getMe();
      setAccountData({ account });
      toast.success("Login realizado com sucesso");
    },

    onError(error) {
      toast.error(getApiErrorMessage(error));
    },
  });

  return methods;
}
