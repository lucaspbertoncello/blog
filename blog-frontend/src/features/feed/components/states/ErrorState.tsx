import { RiErrorWarningLine } from "@remixicon/react";
import { Button } from "@/shared/components/common/button";

export type ErrorStateProps = {
  onRetry: () => void;
};

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <RiErrorWarningLine className="size-6 text-destructive/60" />
      <div className="flex flex-col gap-1">
        <p className="font-sans text-sm font-semibold text-foreground/70">
          Erro ao carregar artigos
        </p>
        <p className="font-inter text-xs text-muted-foreground/50">
          Tente novamente em alguns instantes
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  );
}
