import { useMutation } from "@tanstack/react-query";
import { editArticle } from "../services/editArticle";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { toast } from "sonner";

export function useEditArticle() {
  const methods = useMutation({
    mutationFn: editArticle,
    onSuccess: () => {
      toast.success("Artigo salvo com sucesso");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  return methods;
}
