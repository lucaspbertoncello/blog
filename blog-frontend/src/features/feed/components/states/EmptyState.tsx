import { RiQuillPenLine } from "@remixicon/react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <RiQuillPenLine className="size-6 text-muted-foreground/30" />
      <div className="flex flex-col gap-1">
        <p className="font-sans text-sm font-semibold text-foreground/70">
          Nenhum artigo publicado ainda
        </p>
        <p className="font-inter text-xs text-muted-foreground/50">
          Volte em breve
        </p>
      </div>
    </div>
  );
}
