import { useMutation } from "@tanstack/react-query";
import { editArticle } from "../services/editArticle";
import { toast } from "sonner";

export function useEditArticle() {
  const methods = useMutation({
    mutationFn: editArticle,
    onSuccess: () => {
      toast.success("Artigo salvo com sucesso");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao salvar o seu artigo. Tente novamente");
    },
  });

  return methods;
}
