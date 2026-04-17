import { RiHeartLine, RiChat3Line, RiLockLine } from "@remixicon/react";
import { Button } from "@/shared/components/common/button";
import { AnimateIn } from "@/shared/components/custom/AnimateIn";
import { cn } from "@/shared/lib/utils";
import { Link } from "@tanstack/react-router";
import type { useFeedModel } from "./FeedModel";
import { toast } from "sonner";
import { AtmosphericDepth } from "./components/AtmosphericDepth";
import { GrainOverlay } from "./components/GrainOverlay";
import { VerticalGridLines } from "./components/VerticalGridLines";

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
      <AtmosphericDepth />
      <GrainOverlay />
      <VerticalGridLines />

      <div className="relative z-10 mx-auto max-w-250 px-12">
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

        <AnimateIn delay={150}>
          <p className="pt-1 font-inter text-xs font-semibold tracking-widest text-muted-foreground/40 uppercase">
            Artigos recentes
          </p>
        </AnimateIn>

        <div>
          {articles.map((article, index) => {
            const cannotSee = article.visibility === "students_only" && !isAuthenticated;

            return (
              <AnimateIn
                key={article.articleId}
                delay={220 + index * 65}
                className={cn("border-b border-border", index === articles.length - 1 && "border-0")}
              >
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
                        className={cn(
                          "flex flex-wrap gap-1.5",
                          cannotSee && "pointer-events-none blur-sm select-none"
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

                  {cannotSee && (
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
