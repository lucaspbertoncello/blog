import { RiCheckLine } from "@remixicon/react";
import { Spinner } from "@/shared/components/common/spinner";
import { cn } from "@/shared/lib/utils";

type ArticleImageUploadStatusProps = {
  fileName: string;
  progress: number;
  phase: "uploading" | "complete";
};

export function ArticleImageUploadStatus({ fileName, progress, phase }: ArticleImageUploadStatusProps) {
  return (
    <div
      className={cn(
        "mt-3 rounded-md border px-3 py-2.5 transition-colors duration-300",
        phase === "complete" ? "border-primary/20 bg-primary/5" : "border-border bg-muted/20",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          {phase === "uploading" ? (
            <Spinner className="size-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <RiCheckLine className="size-3.5 shrink-0 text-primary" />
          )}
          <p className="truncate font-mono text-xs text-foreground/70">{fileName}</p>
        </div>

        <span className="shrink-0 font-mono text-xs text-muted-foreground">{progress}%</span>
      </div>

      <div className="mt-2 h-px overflow-hidden bg-border">
        <div
          className="h-full bg-primary transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
