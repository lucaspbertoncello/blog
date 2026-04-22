import { Outlet, Link } from "@tanstack/react-router";
import { Button } from "@/shared/components/common/button";
import { RiArrowLeftLine } from "@remixicon/react";
import { AnimateIn } from "@/shared/components/custom/AnimateIn";

const TAB_BASE = "rounded-md px-4 py-2 font-inter text-sm transition-colors";
const TAB_ACTIVE = `${TAB_BASE} bg-primary/10 text-primary`;
const TAB_INACTIVE = `${TAB_BASE} text-muted-foreground hover:text-foreground`;

export function AdminPanelLayout() {
  return (
    <div className="relative z-10 mx-auto max-w-250 px-12">
      <AnimateIn delay={0}>
        <header className="flex items-center justify-between border-b border-border py-9">
          <span className="font-sans text-base font-light tracking-tight">
            dev<span className="text-primary">.</span>blog
          </span>
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <Link to="/">
              <RiArrowLeftLine className="size-4" />
              Feed
            </Link>
          </Button>
        </header>
      </AnimateIn>

      <AnimateIn delay={80}>
        <div className="mt-8 mb-6 flex flex-col gap-6">
          <h1 className="font-sans text-xl font-bold tracking-tight">Painel de administração</h1>
          <nav className="flex gap-1">
            <Link to="/admin/articles" className={TAB_INACTIVE} activeProps={{ className: TAB_ACTIVE }}>
              Artigos
            </Link>
            <Link to="/admin/users" className={TAB_INACTIVE} activeProps={{ className: TAB_ACTIVE }}>
              Usuários
            </Link>
            <Link to="/admin/comments" className={TAB_INACTIVE} activeProps={{ className: TAB_ACTIVE }}>
              Comentários
            </Link>
          </nav>
        </div>
      </AnimateIn>

      <Outlet />
    </div>
  );
}
