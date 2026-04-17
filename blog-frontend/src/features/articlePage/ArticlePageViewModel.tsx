import { useArticlePageModel } from "./ArticlePageModel";
import { ArticlePageView } from "./ArticlePageView";

export function ArticlePageViewModel() {
  const methods = useArticlePageModel();
  return <ArticlePageView {...methods} />;
}
