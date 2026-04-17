import { RiHeartLine, RiChat3Line, RiLockLine } from "@remixicon/react";
import { Button } from "@/shared/components/common/button";
import { AnimateIn } from "@/shared/components/custom/AnimateIn";
import { cn } from "@/shared/lib/utils";
import { Link } from "@tanstack/react-router";
import type { useFeedModel } from "./FeedModel";
import { toast } from "sonner";

export type FeedViewProps = ReturnType<typeof useFeedModel>;

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function FeedView(props: FeedViewProps) {
  const { articles, userStore, authStore } = props;

  const { account, hasAdminAccess, hasWriterAccess } = userStore;
  const { clearAuthTokens, isAuthenticated } = authStore;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* === Atmospheric depth: radial purple glow from page top === */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 left-0 z-0 h-80"
        style={{
          background:
            "radial-gradient(ellipse 55% 100% at 50% 0%, oklch(0.438 0.218 303.724 / 0.1), transparent)",
        }}
      />

      {/* === Grain overlay — subtle film texture for depth === */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20 opacity-[0.022]"
        width="100%"
        height="100%"
      >
        <filter id="feed-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#feed-grain)" />
      </svg>

      {/* === Vertical grid lines — fixed, always mark the 1000px column edges === */}
      <div className="pointer-events-none fixed top-0 bottom-0 left-[calc(50%-500px)] z-0 w-px bg-muted-foreground/20" />
      <div className="pointer-events-none fixed top-0 right-[calc(50%-500px)] bottom-0 z-0 w-px bg-muted-foreground/20" />

      {/* === Page content === */}
      <div className="relative z-10 mx-auto max-w-250 px-12">
        {/* Header */}
        <AnimateIn delay={0}>
          <header className="flex items-center justify-between border-b border-border py-9">
            <span className="font-sans text-sm font-bold tracking-tight">
              dev<span className="text-primary">.</span>blog
            </span>
            <div className="flex items-center gap-3">
              {!isAuthenticated ? (
                <Link from="/" to="/auth/signin">
                  <Button>Entrar</Button>
                </Link>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => {
                    clearAuthTokens();
                    toast.success("Você deslogou de sua conta");
                  }}
                >
                  Sair
                </Button>
              )}
            </div>
          </header>
        </AnimateIn>

        {/* Section label */}
        <AnimateIn delay={150}>
          <p className="pt-1 font-inter text-xs font-semibold tracking-widest text-muted-foreground/40 uppercase">
            Artigos recentes
          </p>
        </AnimateIn>

        {/* Article list */}
        <div>
          {articles.map((article, index) => {
            return (
              <AnimateIn
                key={article.articleId}
                delay={220 + index * 65}
                className={cn("border-b border-border", index === articles.length - 1 && "border-0")}
              >
                <article className="group flex cursor-pointer items-center gap-6 py-7">
                  {/* Left: article content */}
                  <div className="flex flex-1 flex-col gap-2.5">
                    <h2
                      className={cn(
                        "font-sans text-lg leading-snug font-semibold tracking-tight text-foreground/75 transition-colors duration-200 group-hover:text-foreground",
                        article.visibility === "students_only" && "select-none blur-sm",
                      )}
                    >
                      {article.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <div
                        className={cn(
                          "flex flex-wrap gap-1.5",
                          article.visibility === "students_only" && "pointer-events-none select-none blur-sm",
                        )}
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
                      {article.visibility === "students_only" && (
                        <span className="rounded-full border border-amber-500/20 bg-amber-500/8 px-2.5 py-0.5 font-inter text-xs font-medium text-amber-500/75">
                          só para estudantes
                        </span>
                      )}
                    </div>

                    <footer className="flex items-center justify-between">
                      <span
                        className={cn(
                          "font-inter text-xs text-muted-foreground/50",
                          article.visibility === "students_only" && "select-none blur-sm",
                        )}
                      >
                        <strong className="font-medium text-muted-foreground/70">{article.authorName}</strong>
                        {" · "}
                        {formatDate(article.createdAt)}
                      </span>

                      {article.visibility !== "students_only" && (
                        <div className="flex gap-4">
                          <button className="flex items-center gap-1.5 font-inter text-xs text-muted-foreground/30 transition-colors hover:text-primary">
                            <RiHeartLine className="size-3.5" />
                            {article.likeCount}
                          </button>

                          <button className="flex items-center gap-1.5 font-inter text-xs text-muted-foreground/30 transition-colors hover:text-primary">
                            <RiChat3Line className="size-3.5" />
                            {article.commentCount}
                          </button>
                        </div>
                      )}
                    </footer>
                  </div>

                  {/* Right: lock icon + login button, vertically centered */}
                  {article.visibility === "students_only" && (
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                        <RiLockLine className="size-3.5 text-primary" />
                      </div>
                      <Link from="/" to="/auth/signin">
                        <Button>Entrar</Button>
                      </Link>
                    </div>
                  )}
                </article>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
