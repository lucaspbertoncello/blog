import { useParams } from "@tanstack/react-router";
import { useArticleEditorModel } from "./ArticleEditorModel";
import { ArticleEditorView } from "./ArticleEditorView";

export function ArticleEditorViewModel() {
  // strict: false — shared between /new (no param) and /$articleId/edit
  const { articleId } = useParams({ strict: false });
  const model = useArticleEditorModel(articleId);
  return <ArticleEditorView {...model} />;
}
