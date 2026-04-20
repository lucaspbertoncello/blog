import { useMutation } from "@tanstack/react-query";
import { deleteArticle } from "../services/deleteArticle";
import { toast } from "sonner";

export function useDeleteArticle() {
  const methods = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      toast.success("Artigo deletado com sucesso");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao deletar seu artigo. Tente novamente");
    },
  });

  return methods;
}
