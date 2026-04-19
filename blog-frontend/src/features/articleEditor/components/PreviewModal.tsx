import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/common/dialog";
import { MarkdownRenderer } from "@/shared/components/custom/MarkdownRenderer";

export type PreviewModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
};

export function PreviewModal({ open, onClose, title, content }: PreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-sans text-xl font-bold tracking-tight">
            {title || <span className="text-muted-foreground/40">Sem título</span>}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          {content ? (
            <MarkdownRenderer content={content} />
          ) : (
            <p className="font-inter text-sm text-muted-foreground/40">
              Nenhum conteúdo para visualizar.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
