import { AnimateIn } from "@/shared/components/custom/AnimateIn";
import { cn } from "@/shared/lib/utils";
import type { useFeedModel } from "./FeedModel";
import { AtmosphericDepth } from "./components/AtmosphericDepth";
import { GrainOverlay } from "./components/GrainOverlay";
import { VerticalGridLines } from "./components/VerticalGridLines";
import { ArticleItem } from "./components/ArticleItem";
import { SigninAction } from "./components/SigninAction";
import { LogoutAction } from "./components/LogoutAction";
import { HeaderActions } from "./components/HeaderActions";
import { LoadingState } from "./components/states/LoadingState";
import { ErrorState } from "./components/states/ErrorState";
import { EmptyState } from "./components/states/EmptyState";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import { useShallow } from "zustand/react/shallow";
import { useUserStore } from "@/domain/users/stores/useUserStore";

export type FeedViewProps = ReturnType<typeof useFeedModel>;

export function FeedView(props: FeedViewProps) {
  const { articles, isLoadingPublishedArticles, listArticlesError, refetchArticles } = props;

  const authStore = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      clearAuthTokens: state.clearAuthTokens,
    }))
  );
  const userStore = useUserStore(
    useShallow((state) => ({
      account: state.account,
      hasAdminAccess: state.hasAdminAccess,
      hasWriterAccess: state.hasWriterAccess,
    }))
  );

  const { isAuthenticated } = authStore;
  const { hasAdminAccess, hasWriterAccess } = userStore;

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
              {!isAuthenticated ? <SigninAction /> : <LogoutAction />}
              <HeaderActions
                hasAdminAccess={hasAdminAccess}
                hasWriterAccess={hasWriterAccess}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </header>
        </AnimateIn>

        <div>
          {isLoadingPublishedArticles && (
            <AnimateIn delay={220}>
              <LoadingState />
            </AnimateIn>
          )}

          {!isLoadingPublishedArticles && listArticlesError && (
            <AnimateIn delay={220}>
              <ErrorState onRetry={refetchArticles} />
            </AnimateIn>
          )}

          {!isLoadingPublishedArticles && !listArticlesError && articles.length === 0 && (
            <AnimateIn delay={220}>
              <EmptyState />
            </AnimateIn>
          )}

          {!isLoadingPublishedArticles &&
            !listArticlesError &&
            articles.map((article, index) => {
              return (
                <AnimateIn
                  key={article.articleId}
                  delay={220 + index * 65}
                  className={cn("border-b border-border", index === articles.length - 1 && "border-0")}
                >
                  <ArticleItem article={article} isAuthenticated={isAuthenticated} key={article.articleId} />
                </AnimateIn>
              );
            })}
        </div>
      </div>
    </div>
  );
}
