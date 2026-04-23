import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { unlikeArticle } from "../services/unlikeArticle";

export function useUnlikeArticle() {
  return useMutation({
    mutationFn: unlikeArticle,
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
