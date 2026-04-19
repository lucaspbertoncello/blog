import { useArticlesPanelModel } from "./ArticlesPanelModel";
import { ArticlesPanelView } from "./ArticlesPanelView";

export function ArticlesPanelViewModel() {
  const model = useArticlesPanelModel();
  return <ArticlesPanelView {...model} />;
}
