import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { likeArticle } from "../services/likeArticle";

export function useLikeArticle() {
  return useMutation({
    mutationFn: likeArticle,
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
