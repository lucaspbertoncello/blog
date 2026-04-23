import { ApplicationError } from "../../../errors/ApplicationError";
import { Article } from "../../../types/Article";

type Params = {
  article: Pick<Article, "accountId">;
  accountId?: string | null | undefined;
  role?: string | null | undefined;
  message?: string | undefined;
};

export function assertWriterOwnsArticle({
  article,
  accountId,
  role,
  message = "Acesso negado",
}: Params) {
  if (role === "writer" && article.accountId !== accountId) {
    throw new ApplicationError(message);
  }
}
