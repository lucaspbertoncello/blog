import { useState, type KeyboardEvent } from "react";
import { RiCloseLine } from "@remixicon/react";

export type TagInputProps = {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
};

export function TagInput({ tags, onAdd, onRemove }: TagInputProps) {
  const [input, setInput] = useState("");

  function confirm() {
    const trimmed = input.trim().toLowerCase().replace(/[,\s]+/g, "-");
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed);
    }
    setInput("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      confirm();
    }
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      onRemove(tags[tags.length - 1]);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 font-inter text-xs text-primary/75"
        >
          {tag}
          <button
            type="button"
            onClick={() => onRemove(tag)}
            className="ml-0.5 opacity-60 transition-opacity hover:opacity-100"
          >
            <RiCloseLine className="size-3" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={confirm}
        placeholder={tags.length === 0 ? "adicionar tag..." : "+tag"}
        className="min-w-16 bg-transparent font-inter text-xs text-muted-foreground outline-none placeholder:text-muted-foreground/40"
      />
    </div>
  );
}
