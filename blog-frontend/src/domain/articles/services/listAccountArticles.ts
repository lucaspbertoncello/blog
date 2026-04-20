import { httpClient } from "@/shared/lib/httpClient";
import type { Article } from "../types/Article";

export async function listAccountArticles(params: ListAccountArticlesService.Params) {
  const { data } = await httpClient.get<ListAccountArticlesService.Response>(
    `/accounts/${params.accountId}/articles`
  );

  return data;
}

export namespace ListAccountArticlesService {
  export type Params = { accountId: string };
  export type Response = { count: number; articles: Article[] };
}
