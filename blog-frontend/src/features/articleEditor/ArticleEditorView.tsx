import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/components/common/button";
import { AnimateIn } from "@/shared/components/custom/AnimateIn";
import { RiArrowLeftLine, RiDeleteBin2Line, RiUploadCloud2Line } from "@remixicon/react";
import { getFieldError } from "@/shared/lib/form";
import { EditorToolbar } from "./components/EditorToolbar";
import { MetadataRow } from "./components/MetadataRow";
import { PreviewModal } from "./components/PreviewModal";
import { ArticleStatusBadge } from "./components/ArticleStatusBadge";
import { DeleteArticleDialog } from "@/shared/components/custom/DeleteArticleDialog";
import type { useArticleEditorModel } from "./ArticleEditorModel";

export type ArticleEditorViewProps = ReturnType<typeof useArticleEditorModel>;

export function ArticleEditorView(props: ArticleEditorViewProps) {
  const { articleForm, editor, articleId, isEditing, isLoadingArticle, imageUpload } = props;
  const {
    form,
    previewOpen,
    setPreviewOpen,
    handleSubmit,
    handleDelete,
    isSavingArticleToDraft,
    isSubmittingArticle,
    isSavingExistingArticle,
    isDeletingArticle,
    isSavingExistingButtonDisabled,
    currentArticleStatus,
  } = articleForm;
  const { textareaRef, handleInsert } = editor;
  const { getRootProps, getInputProps, isDragActive, open } = imageUpload;

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  if (isLoadingArticle) {
    return (
      <div className="relative z-10 mx-auto flex max-w-250 items-center justify-center px-12 py-32">
        <span className="font-inter text-sm text-muted-foreground">Carregando artigo...</span>
      </div>
    );
  }

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
            <span className="font-inter text-xs text-muted-foreground/40">
              {isEditing ? "Editando artigo" : "Novo artigo"}
            </span>
            <form.Subscribe>
              {!isEditing ? (
                <Button
                  size="sm"
                  isLoading={isSavingArticleToDraft}
                  onClick={() => handleSubmit({ articleActionType: "saveToDrafts" })}
                >
                  Criar como rascunho
                </Button>
              ) : (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    isLoading={isDeletingArticle}
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteConfirmOpen(true)}
                  >
                    <RiDeleteBin2Line className="size-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    isLoading={isSavingExistingArticle}
                    onClick={() => handleSubmit({ articleActionType: "saveExistingArticle" })}
                    disabled={isSavingExistingButtonDisabled}
                  >
                    Salvar artigo
                  </Button>

                  <Button
                    size="sm"
                    isLoading={isSubmittingArticle}
                    disabled={currentArticleStatus === "in_review"}
                    onClick={() => handleSubmit({ articleActionType: "submitArticleToRevision" })}
                  >
                    Enviar para revisão
                  </Button>
                </>
              )}
            </form.Subscribe>
          </div>
        </header>
      </AnimateIn>

      <AnimateIn delay={60}>
        <div className="mx-auto max-w-4xl py-8">
          {/* Title */}
          <form.Field name="title">
            {(field) => (
              <div>
                <textarea
                  rows={1}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  placeholder="Título do artigo..."
                  className="w-full resize-none overflow-hidden bg-transparent font-sans text-3xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/20"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-xs text-destructive">{getFieldError(field.state.meta.errors[0])}</p>
                )}
              </div>
            )}
          </form.Field>

          {/* Article status */}
          {isEditing && currentArticleStatus && <ArticleStatusBadge status={currentArticleStatus} />}

          {/* Metadata row */}
          <form.Field name="tags">
            {(tagsField) => (
              <form.Field name="visibility">
                {(visibilityField) => (
                  <MetadataRow
                    tags={tagsField.state.value}
                    visibility={visibilityField.state.value}
                    onAddTag={(tag) => tagsField.handleChange([...tagsField.state.value, tag])}
                    onRemoveTag={(tag) =>
                      tagsField.handleChange(tagsField.state.value.filter((t) => t !== tag))
                    }
                    onVisibilityChange={(v) => visibilityField.handleChange(v)}
                  />
                )}
              </form.Field>
            )}
          </form.Field>

          {/* Toolbar */}
          <EditorToolbar
            textareaRef={textareaRef}
            onContentChange={handleInsert}
            onPreview={() => setPreviewOpen(true)}
            onImageUpload={open}
          />

          {/* Editor */}
          <form.Field name="content">
            {(field) => (
              <div {...getRootProps()} className="relative">
                <input {...getInputProps()} />
                {isDragActive && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-primary/30 bg-background/90 backdrop-blur-sm">
                    <RiUploadCloud2Line className="size-12 text-primary/40" />
                    <p className="mt-3 font-mono text-sm text-muted-foreground/70">Solte a imagem aqui</p>
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  spellCheck={false}
                  placeholder="Escreva seu conteúdo em markdown..."
                  className="mt-4 min-h-96 w-full resize-none bg-transparent font-mono text-sm leading-7 text-foreground/80 outline-none placeholder:text-muted-foreground/20"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-xs text-destructive">{getFieldError(field.state.meta.errors[0])}</p>
                )}
              </div>
            )}
          </form.Field>
        </div>
      </AnimateIn>

      <DeleteArticleDialog
        open={deleteConfirmOpen}
        isDeleting={isDeletingArticle}
        onConfirm={() => handleDelete(articleId!)}
        onCancel={() => setDeleteConfirmOpen(false)}
      />

      <form.Subscribe
        selector={(state) => ({
          title: state.values.title,
          content: state.values.content,
          tags: state.values.tags,
        })}
      >
        {({ title, content, tags }) => (
          <PreviewModal
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
            title={title}
            content={content}
            tags={tags ?? []}
          />
        )}
      </form.Subscribe>
    </div>
  );
}
