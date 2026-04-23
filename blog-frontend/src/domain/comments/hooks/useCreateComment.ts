import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/apiError";
import { createComment } from "../services/createComment";

export function useCreateComment() {
  return useMutation({
    mutationFn: createComment,
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
