import type { Article } from "@/domain/articles/types/Article";
import { useArticleEditorForm } from "./hooks/useArticleEditorForm";
import { useEditorContent } from "./hooks/useEditorContent";

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
  const articleBeingEdited = articleId
    ? (MOCK_FULL_ARTICLES.find((a) => a.articleId === articleId) ?? null)
    : null;

  const articleForm = useArticleEditorForm({ articleBeingEdited });
  const editor = useEditorContent((v) => articleForm.form.setFieldValue("content", v));

  return {
    articleForm,
    editor,
    isEditing: !!articleId,
  };
}
