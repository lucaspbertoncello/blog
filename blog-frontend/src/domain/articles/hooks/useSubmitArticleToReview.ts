import { useMutation } from "@tanstack/react-query";
import { submitArticleToReviewService } from "../services/submitArticleToReview";
import { toast } from "sonner";

export function useSubmitArticleToReview() {
  const methods = useMutation({
    mutationFn: submitArticleToReviewService,
    onSuccess: () => {
      toast.success("Artigo enviado para revisão");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao enviar seu artigo para revisão. Tente novamente");
    },
  });

  return methods;
}
