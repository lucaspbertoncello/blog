import { Skeleton } from "@/shared/components/common/skeleton";
import { cn } from "@/shared/lib/utils";

const ROWS: { titleWidth: string; tags: string[] }[] = [
  { titleWidth: "w-2/3", tags: ["w-16", "w-12", "w-20"] },
  { titleWidth: "w-1/2", tags: ["w-14", "w-10"] },
  { titleWidth: "w-3/5", tags: ["w-20", "w-16", "w-12"] },
  { titleWidth: "w-5/8", tags: ["w-12", "w-18"] },
];

function SkeletonArticleRow({
  titleWidth,
  tags,
  isLast,
}: {
  titleWidth: string;
  tags: string[];
  isLast: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-6 py-7", !isLast && "border-b border-border")}>
      <div className="flex flex-1 flex-col gap-2.5">
        <Skeleton className={cn("h-5 rounded-sm", titleWidth)} />

        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((w, i) => (
            <Skeleton key={i} className={cn("h-5 rounded-full", w)} />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-36 rounded-sm" />
          <div className="flex gap-4">
            <Skeleton className="h-3 w-8 rounded-sm" />
            <Skeleton className="h-3 w-8 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div>
      {ROWS.map((row, index) => (
        <SkeletonArticleRow
          key={index}
          titleWidth={row.titleWidth}
          tags={row.tags}
          isLast={index === ROWS.length - 1}
        />
      ))}
    </div>
  );
}
