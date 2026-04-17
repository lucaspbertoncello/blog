import { Skeleton } from "@/shared/components/common/skeleton";
import { cn } from "@/shared/lib/utils";

const CONTENT_LINES = [
  "w-full", "w-11/12", "w-full", "w-4/5",
  "w-full", "w-full", "w-3/4",
];

export function LoadingState() {
  return (
    <div className="mx-auto max-w-160 pb-24">
      <Skeleton className="mt-10 h-3 w-20 rounded-sm" />

      <div className="mt-10 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      <Skeleton className="mt-6 h-9 w-3/4 rounded-sm" />
      <Skeleton className="mt-2 h-9 w-1/2 rounded-sm" />

      <div className="mt-5 flex items-center gap-5 border-b border-border pb-8">
        <Skeleton className="h-3 w-28 rounded-sm" />
        <Skeleton className="h-3 w-20 rounded-sm" />
      </div>

      <div className="mt-8 space-y-3">
        {CONTENT_LINES.map((w, i) => (
          <Skeleton key={i} className={cn("h-3.5 rounded-sm", w)} />
        ))}
        <Skeleton className="mt-6 h-5 w-48 rounded-sm" />
        {["w-full", "w-full", "w-5/6", "w-full", "w-2/3"].map((w, i) => (
          <Skeleton key={`b-${i}`} className={cn("h-3.5 rounded-sm", w)} />
        ))}
      </div>
    </div>
  );
}
