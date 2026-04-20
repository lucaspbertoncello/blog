import { Dialog, DialogContent } from "@/shared/components/common/dialog";
import { MarkdownRenderer } from "@/shared/components/custom/MarkdownRenderer";
import { formatDate } from "@/shared/lib/utils";
import { RiCalendarLine, RiChat3Line, RiHeartLine, RiTimeLine } from "@remixicon/react";

export type PreviewModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
};

export function PreviewModal({
  open,
  onClose,
  title,
  content,
  tags,
  createdAt,
  updatedAt,
}: PreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-8xl max-h-[90vh] overflow-y-auto sm:w-[60vw]">
        <article className="mx-auto w-full max-w-full min-w-0 pb-16 wrap-break-word">
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 font-inter text-xs font-medium text-primary/75"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-6 font-sans text-3xl leading-tight font-bold tracking-tight text-foreground">
            {title || <span className="text-muted-foreground/40">Sem título</span>}
          </h1>

          <div className="mt-5 flex items-center gap-5 border-b border-border pb-8">
            <span className="flex items-center gap-1.5 font-inter text-xs text-muted-foreground/50">
              <RiCalendarLine className="size-3.5" />
              {createdAt ? formatDate(createdAt) : "-"}
            </span>
            <span className="flex items-center gap-1.5 font-inter text-xs text-muted-foreground/50">
              <RiTimeLine className="size-3.5" />
              ~2 min de leitura
            </span>
          </div>

          <div className="mt-5 flex items-center gap-5">
            <button className="flex items-center gap-1.5 font-inter text-xs text-muted-foreground/30 transition-colors hover:text-primary">
              <RiHeartLine className="size-3.5" />-
            </button>
            <button className="flex items-center gap-1.5 font-inter text-xs text-muted-foreground/30 transition-colors hover:text-primary">
              <RiChat3Line className="size-3.5" />-
            </button>
          </div>

          <div className="mt-8">
            {content ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p className="font-inter text-sm text-muted-foreground/40">Nenhum conteúdo para visualizar.</p>
            )}
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <span className="font-inter text-xs text-muted-foreground/40">
              atualizado em {updatedAt ? formatDate(updatedAt) : "-"}
            </span>
          </div>
        </article>
      </DialogContent>
    </Dialog>
  );
}
