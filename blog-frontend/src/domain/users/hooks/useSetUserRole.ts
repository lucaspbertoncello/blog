import { useMutation } from "@tanstack/react-query";
import { setUserRole } from "../services/setUserRole";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/apiError";

export function useSetUserRole() {
  return useMutation({
    mutationFn: setUserRole,
    onSuccess: () => toast.success("Role do usuário atualizada"),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
