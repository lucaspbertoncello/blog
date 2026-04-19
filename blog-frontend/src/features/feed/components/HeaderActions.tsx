import { Button } from "@/shared/components/common/button";
import { Link } from "@tanstack/react-router";

export type HeaderActionsProps = {
  hasAdminAccess(): boolean;
  hasWriterAccess(): boolean;
  isAuthenticated: boolean;
};

export function HeaderActions(props: HeaderActionsProps) {
  const { hasAdminAccess, hasWriterAccess, isAuthenticated } = props;

  if (!isAuthenticated) return;

  return (
    <>
      {hasAdminAccess() && (
        <Link from="/" to="/auth/signin">
          <Button variant="ghost">Acessar painel administrativo</Button>
        </Link>
      )}

      {hasWriterAccess() && (
        <Link from="/" to="/writer/articles">
          <Button variant="ghost">Acessar painel de artigos</Button>
        </Link>
      )}
    </>
  );
}
