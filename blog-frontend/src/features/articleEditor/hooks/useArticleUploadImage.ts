import { useEffect, useState, type RefObject } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadArticleImage } from "@/domain/articles/hooks/useUploadArticleImage";
import { insertBlock } from "@/shared/lib/editorUtils";
import type { InsertResult } from "@/shared/lib/editorUtils";

type UseArticleUploadImageParams = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  handleInsert: (result: InsertResult) => void;
};

type ImageUploadState =
  | { phase: "idle"; fileName: string; progress: number }
  | { phase: "uploading"; fileName: string; progress: number }
  | { phase: "complete"; fileName: string; progress: number };

const IDLE_UPLOAD_STATE: ImageUploadState = {
  phase: "idle",
  fileName: "",
  progress: 0,
};

export function useArticleUploadImage({ textareaRef, handleInsert }: UseArticleUploadImageParams) {
  const { mutate: uploadArticleImage, isPending } = useUploadArticleImage();
  const [uploadState, setUploadState] = useState<ImageUploadState>(IDLE_UPLOAD_STATE);

  useEffect(() => {
    if (uploadState.phase !== "complete") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setUploadState(IDLE_UPLOAD_STATE);
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [uploadState.phase]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: ([acceptedFile]) => {
      if (!acceptedFile) {
        return;
      }

      setUploadState({
        phase: "uploading",
        fileName: acceptedFile.name,
        progress: 0,
      });

      uploadArticleImage(
        {
          file: acceptedFile,
          onProgress: (progress) => {
            setUploadState({
              phase: "uploading",
              fileName: acceptedFile.name,
              progress,
            });
          },
        },
        {
          onSuccess: (uploadedImage) => {
            setUploadState({
              phase: "complete",
              fileName: acceptedFile.name,
              progress: 100,
            });

            const textarea = textareaRef.current;

            if (!textarea) {
              return;
            }

            handleInsert(insertBlock(textarea, `![${acceptedFile.name}](${uploadedImage.fileUrl})`));
          },
          onError: () => setUploadState(IDLE_UPLOAD_STATE),
        },
      );
    },
    multiple: false,
    noClick: true,
    noKeyboard: true,
    accept: { "image/png": [], "image/jpeg": [] },
    disabled: isPending,
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
    isUploading: isPending,
    uploadProgress: uploadState.progress,
    uploadPhase: uploadState.phase,
    uploadFileName: uploadState.fileName,
  };
}
