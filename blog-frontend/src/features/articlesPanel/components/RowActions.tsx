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

type RowActionsProps = {
  article: ArticleListItem;
  canSubmit: boolean;
  onSubmitForReview: (articleId: string) => void;
};

export function RowActions({ article, canSubmit, onSubmitForReview }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
