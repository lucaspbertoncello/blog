import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/common/dropdown-menu";
import { Button } from "@/shared/components/common/button";
import { RiMoreLine } from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import type { ArticleListItem } from "../ArticlesPanelModel";
import { DeleteArticleDialog } from "@/shared/components/custom/DeleteArticleDialog";

type RowActionsProps = {
  article: ArticleListItem;
  canSubmit: boolean;
  onSubmitForReview: (articleId: string) => void;
  onDeleteArticle: (articleId: string) => void;
  isDeleting: boolean;
};

export function RowActions({ article, canSubmit, onSubmitForReview, onDeleteArticle, isDeleting }: RowActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" disabled={isDeleting}>
            <RiMoreLine className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to="/writer/articles/$articleId/edit" params={{ articleId: article.articleId }}>
              Editar
            </Link>
          </DropdownMenuItem>
          {canSubmit && (
            <DropdownMenuItem onClick={() => onSubmitForReview(article.articleId)}>
              Enviar para revisão
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setConfirmOpen(true)}
          >
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteArticleDialog
        open={confirmOpen}
        isDeleting={isDeleting}
        onConfirm={() => onDeleteArticle(article.articleId)}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
