import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import type { Article, ArticleVisibility } from "@/domain/articles/types/Article";
import type { InsertResult } from "@/shared/lib/editorUtils";

const MOCK_FULL_ARTICLES: Article[] = [
  {
    articleId: "1",
    accountId: "acc-1",
    title: "Como usar React hooks avançados",
    slug: "como-usar-react-hooks-avancados",
    content:
      "## Introdução\n\nOs hooks do React permitem que você use estado e outros recursos do React sem escrever uma classe.\n\n## useState\n\nO hook mais básico:\n\n```tsx\nconst [count, setCount] = useState(0);\n```\n\n## useEffect\n\nPara efeitos colaterais:\n\n```tsx\nuseEffect(() => {\n  document.title = `Contagem: ${count}`;\n}, [count]);\n```",
    tags: ["react", "hooks"],
    status: "published",
    visibility: "public",
    createdAt: "2025-01-12T10:00:00.000Z",
    updatedAt: "2025-01-14T10:00:00.000Z",
  },
  {
    articleId: "3",
    accountId: "acc-1",
    title: "Introdução ao Docker e containers",
    slug: "introducao-ao-docker",
    content:
      "## O que é Docker?\n\nDocker é uma plataforma para desenvolver, enviar e executar aplicações em containers.\n\n## Comandos básicos\n\n```bash\ndocker build -t minha-app .\ndocker run -p 3000:3000 minha-app\n```",
    tags: ["docker", "devops"],
    status: "draft",
    visibility: "students_only",
    createdAt: "2025-01-03T10:00:00.000Z",
    updatedAt: "2025-01-03T10:00:00.000Z",
  },
];

export function useArticleEditorModel(articleId?: string) {
  const existing = articleId
    ? MOCK_FULL_ARTICLES.find((a) => a.articleId === articleId) ?? null
    : null;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [visibility, setVisibility] = useState<ArticleVisibility>(
    existing?.visibility ?? "public"
  );
  const [previewOpen, setPreviewOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInsert = useCallback((result: InsertResult) => {
    setContent(result.value);
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.setSelectionRange(result.selectionStart, result.selectionEnd);
      ta.focus();
    });
  }, []);

  function handleSaveDraft() {
    if (!title.trim()) {
      toast.error("Adicione um título antes de salvar.");
      return;
    }
    toast.success("Rascunho salvo.");
  }

  function handleSubmitForReview() {
    if (!title.trim() || !content.trim()) {
      toast.error("Título e conteúdo são obrigatórios para enviar para revisão.");
      return;
    }
    toast.success("Artigo enviado para revisão.");
  }

  function handleImageUpload() {
    fileInputRef.current?.click();
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      toast.error("Apenas PNG e JPEG são permitidos.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Arquivo deve ter no máximo 3MB.");
      return;
    }

    const mockUrl = `https://mock-cdn.dev/uploads/${crypto.randomUUID()}.${file.type === "image/png" ? "png" : "jpg"}`;
    const insertText = `![${file.name}](${mockUrl})`;

    const ta = textareaRef.current;
    if (ta) {
      const start = ta.selectionStart;
      const newContent =
        content.substring(0, start) + insertText + content.substring(start);
      handleInsert({ value: newContent, selectionStart: start + insertText.length, selectionEnd: start + insertText.length });
    }

    e.target.value = "";
    toast.success("Imagem inserida (mock).");
  }

  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  return {
    title,
    setTitle,
    content,
    setContent,
    tags,
    setTags,
    visibility,
    setVisibility,
    previewOpen,
    setPreviewOpen,
    textareaRef,
    fileInputRef,
    handleInsert,
    handleSaveDraft,
    handleSubmitForReview,
    handleImageUpload,
    handleFileSelected,
    canSubmit,
    isEditing: !!articleId,
  };
}
