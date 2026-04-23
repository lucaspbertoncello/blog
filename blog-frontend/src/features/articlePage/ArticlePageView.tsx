import { AnimateIn } from "@/shared/components/custom/AnimateIn";
import { MarkdownRenderer } from "@/shared/components/custom/MarkdownRenderer";
import { cn, formatDate } from "@/shared/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  RiArrowLeftLine,
  RiCalendarLine,
  RiChat3Line,
  RiHeartFill,
  RiHeartLine,
  RiTimeLine,
} from "@remixicon/react";
import { LoadingState } from "./components/states/LoadingState";
import { ErrorState } from "./components/states/ErrorState";
import { NotFoundState } from "./components/states/NotFoundState";
import type { useArticlePageModel } from "./ArticlePageModel";

export type ArticlePageViewProps = ReturnType<typeof useArticlePageModel>;

export function ArticlePageView(props: ArticlePageViewProps) {
  const { article, comments, getArticleError, isFetchingArticle, like, refetchArticle } = props;

  return (
    <div className="relative z-10 mx-auto max-w-250 px-12">
      <AnimateIn delay={0}>
        <header className="flex items-center justify-between border-b border-border py-9">
          <Link to="/">
            <span className="font-sans text-base font-light tracking-tight">
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
            <div className="mt-5 flex items-center gap-5">
              <button
                type="button"
                aria-label={like.likedByMe ? "Remover curtida" : "Curtir artigo"}
                aria-pressed={like.likedByMe}
                aria-busy={like.isFetchingLikes || like.isTogglingLike}
                disabled={!like.canToggleLike}
                title={like.toggleLikeTitle}
                onClick={() => void like.onToggleLike()}
                className={cn(
                  "flex items-center gap-1.5 font-inter text-xs transition-colors",
                  like.likedByMe
                    ? "text-primary hover:text-primary/80"
                    : "text-muted-foreground/30 hover:text-primary",
                  !like.canToggleLike && "cursor-not-allowed opacity-60 hover:text-muted-foreground/30"
                )}
              >
                {like.likedByMe ? <RiHeartFill className="size-3.5" /> : <RiHeartLine className="size-3.5" />}
                {like.likesCount}
              </button>
              <span className="flex items-center gap-1.5 font-inter text-xs text-muted-foreground/30">
                <RiChat3Line className="size-3.5" />
                {comments.commentsCountLabel}
              </span>
            </div>
          </AnimateIn>

          <AnimateIn delay={380}>
            <div className="mt-8">
              <MarkdownRenderer content={article.content} />
            </div>
          </AnimateIn>

          <AnimateIn delay={420}>
            <section className="mt-12 border-t border-border pt-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-sans text-xl font-bold tracking-tight text-foreground">Comentários</h2>
                <span className="font-inter text-xs text-muted-foreground/40">
                  {comments.commentsCountLabel} comentários
                </span>
              </div>

              {comments.isCommentsUnavailable ? (
                <div className="mt-6 border-l border-border pl-4">
                  <p className="font-inter text-sm text-muted-foreground/60">
                    Entre na sua conta para ver os comentários deste artigo.
                  </p>
                  <Link
                    to="/auth/signin"
                    className="mt-3 inline-flex font-inter text-xs text-primary transition-colors hover:text-primary/80"
                  >
                    entrar
                  </Link>
                </div>
              ) : comments.isLoadingComments ? (
                <div className="mt-6 space-y-4">
                  <div className="space-y-2 border-l border-border pl-4">
                    <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
                    <div className="h-4 w-3/4 animate-pulse rounded-full bg-muted" />
                  </div>
                  <div className="space-y-2 border-l border-border pl-4">
                    <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
                    <div className="h-4 w-5/6 animate-pulse rounded-full bg-muted" />
                  </div>
                </div>
              ) : comments.comments.length === 0 ? (
                <p className="mt-6 font-inter text-sm text-muted-foreground/60">
                  Nenhum comentário publicado ainda.
                </p>
              ) : (
                <div className="mt-6 space-y-5">
                  {comments.comments.map((comment) => (
                    <article key={comment.commentId} className="border-l border-border pl-4">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-inter text-xs font-medium text-foreground/70">
                          usuário {comment.accountId.slice(0, 8)}
                        </span>
                        <time
                          dateTime={comment.createdAt}
                          className="font-inter text-xs text-muted-foreground/40"
                        >
                          {formatDate(comment.createdAt)}
                        </time>
                      </div>
                      <p className="mt-2 font-inter text-sm leading-6 whitespace-pre-wrap text-muted-foreground/80">
                        {comment.content}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </AnimateIn>

          <AnimateIn delay={460}>
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
