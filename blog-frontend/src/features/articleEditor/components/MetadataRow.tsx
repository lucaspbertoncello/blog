import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/common/select";
import { TagInput } from "./TagInput";
import type { ArticleVisibility } from "@/domain/articles/types/Article";

export type MetadataRowProps = {
  tags: string[];
  visibility: ArticleVisibility;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onVisibilityChange: (v: ArticleVisibility) => void;
};

export function MetadataRow({
  tags,
  visibility,
  onAddTag,
  onRemoveTag,
  onVisibilityChange,
}: MetadataRowProps) {
  return (
    <div className="flex items-center gap-4 border-b border-border py-3">
      <TagInput tags={tags ?? []} onAdd={onAddTag} onRemove={onRemoveTag} />
      <span className="text-border">|</span>
      <Select value={visibility} onValueChange={(v) => onVisibilityChange(v as ArticleVisibility)}>
        <SelectTrigger className="h-auto w-auto gap-1 rounded-4xl border-0 bg-transparent px-3 py-1 font-inter text-xs text-muted-foreground shadow-none focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="p-1">
          <SelectItem value="public">
            <span className="font-inter text-xs">público</span>
          </SelectItem>
          <SelectItem value="students_only">
            <span className="font-inter text-xs">apenas alunos</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
