import { cn, formatDate } from "@/shared/lib/utils";
import { RiChat3Line, RiHeartLine, RiLockLine } from "@remixicon/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/common/tooltip";
import { Link } from "@tanstack/react-router";
import type { Article } from "@/domain/articles/types/Article";

export type ArticleItemProps = {
  article: Omit<Article, "accountId" | "status" | "content">;
  isAuthenticated: boolean;
};

export function ArticleItem(props: ArticleItemProps) {
  const { article, isAuthenticated } = props;

  const cannotSee = article.visibility === "students_only" && !isAuthenticated;

  return (
    <Link to="/articles/$articleSlug" params={{ articleSlug: article.slug }}>
      <article className="group flex cursor-pointer items-center gap-6 py-7">
        <div className="flex flex-1 flex-col gap-2.5">
          <h2
            className={cn(
              "font-sans text-lg leading-snug font-semibold tracking-tight text-foreground/75 transition-colors duration-200 group-hover:text-foreground",
              cannotSee && "blur-sm select-none"
            )}
          >
            {article.title}
          </h2>

          <div className="flex flex-wrap items-center gap-1.5">
            <div
              className={cn("flex flex-wrap gap-1.5", cannotSee && "pointer-events-none blur-sm select-none")}
            >
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 font-inter text-xs font-medium text-primary/75"
                >
                  {tag}
                </span>
              ))}
            </div>
            {cannotSee && (
              <span className="rounded-full border border-amber-500/20 bg-amber-500/8 px-2.5 py-0.5 font-inter text-xs font-medium text-amber-500/75">
                só para estudantes
              </span>
            )}
          </div>

          <footer className="flex items-center justify-between">
            <span
              className={cn(
                "font-inter text-xs text-muted-foreground/50",
                cannotSee && "blur-sm select-none"
              )}
            >
              {formatDate(article.createdAt)}
            </span>

            {article.visibility !== "students_only" && (
              <div className="flex gap-4">
                <button className="flex items-center gap-1.5 font-inter text-xs text-muted-foreground/30 transition-colors hover:text-primary">
                  <RiHeartLine className="size-3.5" />
                  32
                </button>

                <button className="flex items-center gap-1.5 font-inter text-xs text-muted-foreground/30 transition-colors hover:text-primary">
                  <RiChat3Line className="size-3.5" />2
                </button>
              </div>
            )}
          </footer>
        </div>

        {cannotSee && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex size-8 shrink-0 cursor-default items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                <RiLockLine className="size-3.5 text-primary" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <Link from="/" to="/auth/signin" className="hover:underline">
                Entre na plataforma para acessar este artigo
              </Link>
            </TooltipContent>
          </Tooltip>
        )}
      </article>
    </Link>
  );
}
