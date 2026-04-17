import { RiFileUnknowLine } from "@remixicon/react";
import { Link } from "@tanstack/react-router";

export function NotFoundState() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <RiFileUnknowLine className="size-6 text-muted-foreground/30" />
      <div className="flex flex-col gap-1">
        <p className="font-sans text-sm font-semibold text-foreground/70">
          Artigo não encontrado
        </p>
        <p className="font-inter text-xs text-muted-foreground/50">
          O artigo que você está procurando não existe ou foi removido
        </p>
      </div>
      <Link
        to="/"
        className="font-inter text-xs text-muted-foreground/50 underline underline-offset-2 transition-colors hover:text-foreground"
      >
        Voltar ao feed
      </Link>
    </div>
  );
}
