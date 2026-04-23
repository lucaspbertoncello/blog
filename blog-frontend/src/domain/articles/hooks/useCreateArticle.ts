import { useMutation } from "@tanstack/react-query";
import { createArticle } from "../services/createArticle";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { toast } from "sonner";

export function useCreateArticle() {
  const methods = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      toast.success("Artigo salvo como rascunho");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  return methods;
}
