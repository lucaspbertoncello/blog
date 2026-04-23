import { useMutation } from "@tanstack/react-query";
import { submitArticleToReviewService } from "../services/submitArticleToReview";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { toast } from "sonner";

export function useSubmitArticleToReview() {
  const methods = useMutation({
    mutationFn: submitArticleToReviewService,
    onSuccess: () => {
      toast.success("Artigo enviado para revisão");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  return methods;
}
