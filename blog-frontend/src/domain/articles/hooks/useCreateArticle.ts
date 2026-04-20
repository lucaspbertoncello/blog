import { useMutation } from "@tanstack/react-query";
import { createArticle } from "../services/createArticle";
import { toast } from "sonner";

export function useCreateArticle() {
  const methods = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      toast.success("Artigo salvo como rascunho");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao salvar o seu artigo como rascunho. Tente novamente");
    },
  });

  return methods;
}
