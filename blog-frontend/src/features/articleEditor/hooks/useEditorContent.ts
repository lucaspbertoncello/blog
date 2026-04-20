import { useRef } from "react";
import type { InsertResult } from "@/shared/lib/editorUtils";

export function useEditorContent(setContent: (value: string) => void) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleInsert(result: InsertResult) {
    setContent(result.value);
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.setSelectionRange(result.selectionStart, result.selectionEnd);
      ta.focus();
    });
  }

  return { textareaRef, handleInsert };
}
