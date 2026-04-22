import type { ArticleStatus } from "@/domain/articles/types/Article";
import { STATUS_LABELS } from "../constants/index";

const variants: Record<ArticleStatus, string> = {
  draft: "bg-muted/50 text-muted-foreground border-border",
  in_review: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  published: "bg-primary/10 text-primary border-primary/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-inter text-xs font-medium ${variants[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
