import type { ArticleStatus } from "@/domain/articles/types/Article";
import type { StatusFilter } from "../ArticlesPanelModel";

export const STATUS_LABELS: Record<ArticleStatus | "all", string> = {
  all: "Todos",
  draft: "Rascunho",
  in_review: "Em revisão",
  published: "Publicado",
  rejected: "Rejeitado",
};

export const STATUS_FILTERS: Array<StatusFilter> = ["all", "draft", "in_review", "published", "rejected"];
