import { useMutation } from "@tanstack/react-query";
import { rejectArticle } from "../services/rejectArticle";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/apiError";

export function useRejectArticle() {
  return useMutation({
    mutationFn: rejectArticle,
    onSuccess: () => toast.success("Artigo rejeitado"),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
