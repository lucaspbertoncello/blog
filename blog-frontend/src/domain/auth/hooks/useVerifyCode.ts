import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { verifyCode } from "../services/verifyCode";

export function useVerifyCode() {
  const methods = useMutation({
    mutationKey: ["verifyCode"],
    mutationFn: verifyCode,

    onSuccess(data) {
      toast.success(data.message);
    },

    onError(error) {
      toast.error(getApiErrorMessage(error));
    },
  });

  return methods;
}
