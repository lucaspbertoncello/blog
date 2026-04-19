import { useParams } from "@tanstack/react-router";
import { useArticleEditorModel } from "./ArticleEditorModel";
import { ArticleEditorView } from "./ArticleEditorView";

export function ArticleEditorViewModel() {
  const { articleId } = useParams({ strict: false });
  const model = useArticleEditorModel(articleId);
  return <ArticleEditorView {...model} />;
}
