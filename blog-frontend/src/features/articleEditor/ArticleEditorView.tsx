import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/components/common/button";
import { AnimateIn } from "@/shared/components/custom/AnimateIn";
import { RiArrowLeftLine } from "@remixicon/react";
import { EditorToolbar } from "./components/EditorToolbar";
import { MetadataRow } from "./components/MetadataRow";
import { PreviewModal } from "./components/PreviewModal";
import type { useArticleEditorModel } from "./ArticleEditorModel";

export type ArticleEditorViewProps = ReturnType<typeof useArticleEditorModel>;

export function ArticleEditorView(props: ArticleEditorViewProps) {
  const {
    title,
    setTitle,
    content,
    setContent,
    tags,
    setTags,
    visibility,
    setVisibility,
    previewOpen,
    setPreviewOpen,
    textareaRef,
    fileInputRef,
    handleInsert,
    handleSaveDraft,
    handleSubmitForReview,
    handleImageUpload,
    handleFileSelected,
    canSubmit,
    isEditing,
  } = props;

  return (
    <div className="relative z-10 mx-auto max-w-250 px-12">
      <AnimateIn delay={0}>
        <header className="flex items-center justify-between border-b border-border py-9">
          <Link
            to="/writer/articles"
            className="flex items-center gap-1.5 font-inter text-xs text-muted-foreground/50 transition-colors hover:text-foreground"
          >
            <RiArrowLeftLine className="size-3.5" />
            painel de artigos
          </Link>

          <div className="flex items-center gap-2">
            {/* Show contextual label based on whether we're editing or creating */}
            <span className="font-inter text-xs text-muted-foreground/40">
              {isEditing ? "Editando artigo" : "Novo artigo"}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSaveDraft}>
              Salvar rascunho
            </Button>
            <Button
              size="sm"
              disabled={!canSubmit}
              onClick={handleSubmitForReview}
              className="bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
            >
              Enviar para revisão
            </Button>
          </div>
        </header>
      </AnimateIn>

      <AnimateIn delay={60}>
        <div className="mx-auto max-w-4xl py-8">
          {/* Title */}
          <textarea
            rows={1}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            placeholder="Título do artigo..."
            className="w-full resize-none overflow-hidden bg-transparent font-sans text-3xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/20"
          />

          {/* Metadata row */}
          <MetadataRow
            tags={tags}
            visibility={visibility}
            onAddTag={(tag) => setTags((prev) => [...prev, tag])}
            onRemoveTag={(tag) => setTags((prev) => prev.filter((t) => t !== tag))}
            onVisibilityChange={setVisibility}
          />

          {/* Toolbar */}
          <EditorToolbar
            textareaRef={textareaRef}
            onContentChange={handleInsert}
            onPreview={() => setPreviewOpen(true)}
            onImageUpload={handleImageUpload}
          />

          {/* Editor */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            placeholder="Escreva seu conteúdo em markdown..."
            className="mt-4 min-h-96 w-full resize-none bg-transparent font-mono text-sm leading-7 text-foreground/80 outline-none placeholder:text-muted-foreground/20"
          />
        </div>
      </AnimateIn>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={handleFileSelected}
      />

      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={title}
        content={content}
      />
    </div>
  );
}
