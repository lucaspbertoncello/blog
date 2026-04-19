import { Separator } from "@/shared/components/common/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/common/tooltip";
import {
  RiBold,
  RiItalic,
  RiCodeLine,
  RiCodeBlock,
  RiH1,
  RiH2,
  RiH3,
  RiListUnordered,
  RiListOrdered,
  RiDoubleQuotesL,
  RiSeparator,
  RiImageLine,
  RiLinkM,
  RiEyeLine,
} from "@remixicon/react";
import type { RefObject } from "react";
import { insertAtCursor, prependLinePrefix, insertBlock, type InsertResult } from "@/shared/lib/editorUtils";

export type EditorToolbarProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onContentChange: (result: InsertResult) => void;
  onPreview: () => void;
  onImageUpload: () => void;
};

type ToolbarAction = {
  icon: React.ReactNode;
  label: string;
  action: (textarea: HTMLTextAreaElement) => InsertResult;
};

export function EditorToolbar({
  textareaRef,
  onContentChange,
  onPreview,
  onImageUpload,
}: EditorToolbarProps) {
  function run(action: (t: HTMLTextAreaElement) => InsertResult) {
    const ta = textareaRef.current;
    if (!ta) return;
    onContentChange(action(ta));
    setTimeout(() => {
      ta.focus();
    }, 0);
  }

  const actions: ToolbarAction[] = [
    {
      icon: <RiBold className="size-4" />,
      label: "Negrito",
      action: (t) => insertAtCursor(t, "**", "**", "texto"),
    },
    {
      icon: <RiItalic className="size-4" />,
      label: "Itálico",
      action: (t) => insertAtCursor(t, "*", "*", "texto"),
    },
    {
      icon: <RiCodeLine className="size-4" />,
      label: "Código inline",
      action: (t) => insertAtCursor(t, "`", "`", "código"),
    },
  ];

  const blockActions: ToolbarAction[] = [
    {
      icon: <RiCodeBlock className="size-4" />,
      label: "Bloco de código",
      action: (t) => insertBlock(t, "```js\n\n```"),
    },
    {
      icon: <RiH1 className="size-4" />,
      label: "Título 1",
      action: (t) => prependLinePrefix(t, "# "),
    },
    {
      icon: <RiH2 className="size-4" />,
      label: "Título 2",
      action: (t) => prependLinePrefix(t, "## "),
    },
    {
      icon: <RiH3 className="size-4" />,
      label: "Título 3",
      action: (t) => prependLinePrefix(t, "### "),
    },
    {
      icon: <RiListUnordered className="size-4" />,
      label: "Lista",
      action: (t) => prependLinePrefix(t, "- "),
    },
    {
      icon: <RiListOrdered className="size-4" />,
      label: "Lista numerada",
      action: (t) => prependLinePrefix(t, "1. "),
    },
    {
      icon: <RiDoubleQuotesL className="size-4" />,
      label: "Citação",
      action: (t) => prependLinePrefix(t, "> "),
    },
    {
      icon: <RiSeparator className="size-4" />,
      label: "Linha horizontal",
      action: (t) => insertBlock(t, "---"),
    },
    {
      icon: <RiLinkM className="size-4" />,
      label: "Link",
      action: (t) => insertAtCursor(t, "[", "](url)", "texto do link"),
    },
  ];

  return (
    <div className="flex items-center gap-0.5 border-b border-border py-2">
      {actions.map((a) => (
        <ToolbarButton key={a.label} label={a.label} onClick={() => run(a.action)}>
          {a.icon}
        </ToolbarButton>
      ))}

      <Separator orientation="vertical" className="mx-1.5 h-4" />

      {blockActions.map((a) => (
        <ToolbarButton key={a.label} label={a.label} onClick={() => run(a.action)}>
          {a.icon}
        </ToolbarButton>
      ))}

      <Separator orientation="vertical" className="mx-1.5 h-4" />

      <ToolbarButton label="Inserir imagem" onClick={onImageUpload}>
        <RiImageLine className="size-4" />
      </ToolbarButton>

      <div className="flex-1" />

      <button
        type="button"
        onClick={onPreview}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-inter text-xs text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
      >
        <RiEyeLine className="size-3.5" />
        Preview
      </button>
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="font-inter text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
