import { useMutation } from "@tanstack/react-query";
import { publishArticle } from "../services/publishArticle";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/apiError";

export function usePublishArticle() {
  return useMutation({
    mutationFn: publishArticle,
    onSuccess: () => toast.success("Artigo publicado com sucesso"),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
