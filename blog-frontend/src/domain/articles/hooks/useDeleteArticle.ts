import { useMutation } from "@tanstack/react-query";
import { deleteArticle } from "../services/deleteArticle";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { toast } from "sonner";

export function useDeleteArticle() {
  const methods = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      toast.success("Artigo deletado com sucesso");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  return methods;
}
