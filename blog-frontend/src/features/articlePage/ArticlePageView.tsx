import { AnimateIn } from "@/shared/components/custom/AnimateIn";
import { MarkdownRenderer } from "@/shared/components/custom/MarkdownRenderer";
import { formatDate } from "@/shared/lib/utils";
import { Link } from "@tanstack/react-router";
import { RiArrowLeftLine, RiCalendarLine, RiTimeLine } from "@remixicon/react";
import { LoadingState } from "./components/states/LoadingState";
import { ErrorState } from "./components/states/ErrorState";
import { NotFoundState } from "./components/states/NotFoundState";
import type { useArticlePageModel } from "./ArticlePageModel";

export type ArticlePageViewProps = ReturnType<typeof useArticlePageModel>;

export function ArticlePageView(props: ArticlePageViewProps) {
  const { article, getArticleError, isFetchingArticle, refetchArticle } = props;

  return (
    <div className="relative z-10 mx-auto max-w-250 px-12">
        <AnimateIn delay={0}>
          <header className="flex items-center justify-between border-b border-border py-9">
            <Link to="/">
              <span className="font-sans text-sm font-bold tracking-tight">
                dev<span className="text-primary">.</span>blog
              </span>
            </Link>
          </header>
        </AnimateIn>

        {isFetchingArticle && (
          <AnimateIn delay={80}>
            <LoadingState />
          </AnimateIn>
        )}

        {!isFetchingArticle && getArticleError && (
          <AnimateIn delay={80}>
            <ErrorState onRetry={refetchArticle} />
          </AnimateIn>
        )}

        {!isFetchingArticle && !getArticleError && !article && (
          <AnimateIn delay={80}>
            <NotFoundState />
          </AnimateIn>
        )}

        {!isFetchingArticle && !getArticleError && article && (
          <article className="mx-auto max-w-160 pb-24">
            <AnimateIn delay={80}>
              <Link
                to="/"
                className="mt-10 inline-flex items-center gap-1.5 font-inter text-xs text-muted-foreground/50 transition-colors hover:text-foreground"
              >
                <RiArrowLeftLine className="size-3.5" />
                voltar ao feed
              </Link>
            </AnimateIn>

            <AnimateIn delay={140}>
              <div className="mt-10 flex flex-wrap items-center gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 font-inter text-xs font-medium text-primary/75"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </AnimateIn>

            <AnimateIn delay={200}>
              <h1 className="mt-6 font-sans text-3xl leading-tight font-bold tracking-tight text-foreground">
                {article.title}
              </h1>
            </AnimateIn>

            <AnimateIn delay={260}>
              <div className="mt-5 flex items-center gap-5 border-b border-border pb-8">
                <span className="flex items-center gap-1.5 font-inter text-xs text-muted-foreground/50">
                  <RiCalendarLine className="size-3.5" />
                  {formatDate(article.createdAt)}
                </span>
                <span className="flex items-center gap-1.5 font-inter text-xs text-muted-foreground/50">
                  <RiTimeLine className="size-3.5" />
                  ~2 min de leitura
                </span>
              </div>
            </AnimateIn>

            <AnimateIn delay={320}>
              <div className="mt-8">
                <MarkdownRenderer content={article.content} />
              </div>
            </AnimateIn>

            <AnimateIn delay={400}>
              <div className="mt-12 border-t border-border pt-8">
                <div className="flex items-center justify-between">
                  <span className="font-inter text-xs text-muted-foreground/40">
                    atualizado em {formatDate(article.updatedAt)}
                  </span>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 font-inter text-xs text-muted-foreground/50 transition-colors hover:text-foreground"
                  >
                    <RiArrowLeftLine className="size-3.5" />
                    voltar ao feed
                  </Link>
                </div>
              </div>
            </AnimateIn>
          </article>
        )}
    </div>
  );
}
