import type { ArticleStatus } from "@/domain/articles/types/Article";

const STATUS_CONFIG: Record<ArticleStatus, { label: string; dotClass: string }> = {
  draft: { label: "Rascunho", dotClass: "bg-muted-foreground/40" },
  in_review: { label: "Em revisão", dotClass: "bg-sky-400" },
  published: { label: "Publicado", dotClass: "bg-primary" },
  rejected: { label: "Rejeitado", dotClass: "bg-red-400" },
};

export function ArticleStatusBadge({ status }: { status: ArticleStatus }) {
  const { label, dotClass } = STATUS_CONFIG[status];
  return (
    <span className="flex items-center gap-1.5 font-inter text-xs text-muted-foreground/50">
      <span className={`size-1.5 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}
