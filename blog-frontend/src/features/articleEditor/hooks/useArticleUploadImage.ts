import type { RefObject } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadArticleImage } from "@/domain/articles/hooks/useUploadArticleImage";
import { insertBlock } from "@/shared/lib/editorUtils";
import type { InsertResult } from "@/shared/lib/editorUtils";

type UseArticleUploadImageParams = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  handleInsert: (result: InsertResult) => void;
};

export function useArticleUploadImage({ textareaRef, handleInsert }: UseArticleUploadImageParams) {
  const { mutate: uploadArticleImage, isPending } = useUploadArticleImage();

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: ([acceptedFile]) => {
      if (!acceptedFile) {
        return;
      }

      uploadArticleImage(
        { file: acceptedFile },
        {
          onSuccess: (uploadedImage) => {
            const textarea = textareaRef.current;

            if (!textarea) {
              return;
            }

            handleInsert(insertBlock(textarea, `![${acceptedFile.name}](${uploadedImage.fileUrl})`));
          },
        },
      );
    },
    multiple: false,
    noClick: true,
    noKeyboard: true,
    accept: { "image/png": [], "image/jpeg": [] },
    disabled: isPending,
  });

  return { getRootProps, getInputProps, isDragActive, open, isUploading: isPending };
}
