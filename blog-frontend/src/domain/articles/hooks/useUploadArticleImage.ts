import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { uploadArticleImage } from "../services/uploadArticleImage";

export function useUploadArticleImage() {
  return useMutation({
    mutationFn: uploadArticleImage,
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
