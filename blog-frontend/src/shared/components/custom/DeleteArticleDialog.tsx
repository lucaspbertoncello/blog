import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/shared/components/common/dialog";
import { Button } from "@/shared/components/common/button";

type DeleteArticleDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
};

export function DeleteArticleDialog({ open, onConfirm, onCancel, isDeleting }: DeleteArticleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Excluir artigo</DialogTitle>
          <DialogDescription>
            Essa ação é permanente e não pode ser desfeita. O artigo será removido definitivamente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={isDeleting}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            isLoading={isDeleting}
            onClick={onConfirm}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
