import { useMemo } from "react";
import {
  useReactTable, getCoreRowModel, flexRender, type ColumnDef,
} from "@tanstack/react-table";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/components/common/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/shared/components/common/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/shared/components/common/dialog";
import { Button } from "@/shared/components/common/button";
import { Input } from "@/shared/components/common/input";
import { Skeleton } from "@/shared/components/common/skeleton";
import { AnimateIn } from "@/shared/components/custom/AnimateIn";
import { StatusBadge } from "@/features/articlesPanel/components/StatusBadge";
import { STATUS_LABELS, STATUS_FILTERS } from "@/features/articlesPanel/constants";
import { RiMoreLine } from "@remixicon/react";
import type { useAdminArticlesSection } from "../hooks/useAdminArticlesSection";
import type { AdminArticleItem, AdminArticleStatusFilter } from "../hooks/useAdminArticlesSection";

export type AdminArticlesViewProps = ReturnType<typeof useAdminArticlesSection>;

const COL_COUNT = 5;

function ArticleTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="border-border hover:bg-transparent">
          <TableCell><Skeleton className="h-4 w-64" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

function PublishDialog({
  open, onConfirm, onCancel, isLoading,
}: { open: boolean; onConfirm: () => void; onCancel: () => void; isLoading: boolean }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Publicar artigo</DialogTitle>
          <DialogDescription>
            O artigo será publicado imediatamente e ficará visível para os leitores conforme a configuração de visibilidade. Tem certeza?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={isLoading}>Cancelar</Button>
          </DialogClose>
          <Button onClick={onConfirm} isLoading={isLoading}>Publicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RejectDialog({
  open, onConfirm, onCancel, isLoading,
}: { open: boolean; onConfirm: () => void; onCancel: () => void; isLoading: boolean }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Rejeitar artigo</DialogTitle>
          <DialogDescription>
            O artigo voltará ao status rejeitado. O autor poderá editá-lo e reenviar para revisão. Confirma?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={isLoading}>Cancelar</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm} isLoading={isLoading}>Rejeitar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDialog({
  open, onConfirm, onCancel, isLoading,
}: { open: boolean; onConfirm: () => void; onCancel: () => void; isLoading: boolean }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Excluir artigo</DialogTitle>
          <DialogDescription>
            Essa ação é permanente e não pode ser desfeita. O artigo será removido definitivamente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={isLoading}>Cancelar</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm} isLoading={isLoading}>Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type RowActionsProps = {
  article: AdminArticleItem;
  onPublish: () => void;
  onReject: () => void;
  onDelete: () => void;
};

function ArticleRowActions({ article, onPublish, onReject, onDelete }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <RiMoreLine className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {article.status === "in_review" && (
          <>
            <DropdownMenuItem onClick={onPublish}>Publicar</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onReject}>
              Rejeitar
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdminArticlesView(props: AdminArticlesViewProps) {
  const {
    articles, isLoading, isError, refetch,
    search, setSearch,
    statusFilter, setStatusFilter,
    totalCount,
    publishConfirmId, setPublishConfirmId,
    rejectConfirmId, setRejectConfirmId,
    deleteConfirmId, setDeleteConfirmId,
    onPublishConfirm, onRejectConfirm, onDeleteConfirm,
    isPublishing, isRejecting, isDeleting,
  } = props;

  const columns = useMemo<ColumnDef<AdminArticleItem>[]>(() => [
    {
      accessorKey: "title",
      header: "Título",
      cell: ({ row }) => (
        <div
          className="max-w-72 overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(to right, black 65%, transparent 100%)",
            maskImage: "linear-gradient(to right, black 65%, transparent 100%)",
          }}
        >
          <span className="block font-inter text-sm font-medium whitespace-nowrap text-foreground/80">
            {row.getValue("title")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "visibility",
      header: "Visibilidade",
      cell: ({ row }) => (
        <span className="font-inter text-xs text-muted-foreground">
          {row.getValue("visibility") === "public" ? "público" : "apenas alunos"}
        </span>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Atualizado em",
      cell: ({ row }) => (
        <span className="font-inter text-xs text-muted-foreground">
          {new Date(row.getValue("updatedAt")).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ArticleRowActions
          article={row.original}
          onPublish={() => setPublishConfirmId(row.original.articleId)}
          onReject={() => setRejectConfirmId(row.original.articleId)}
          onDelete={() => setDeleteConfirmId(row.original.articleId)}
        />
      ),
    },
  ], [setPublishConfirmId, setRejectConfirmId, setDeleteConfirmId]);

  const table = useReactTable({ data: articles, columns, getCoreRowModel: getCoreRowModel() });

  const busyIds = new Set([publishConfirmId, rejectConfirmId, deleteConfirmId].filter(Boolean));

  return (
    <>
      <AnimateIn delay={0}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-72 font-inter text-sm"
          />
          <div className="flex gap-1">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s as AdminArticleStatusFilter)}
                className={`rounded-md px-3 py-1.5 font-inter text-xs transition-colors ${
                  statusFilter === s
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </AnimateIn>

      <AnimateIn delay={60}>
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-border hover:bg-transparent">
                  {hg.headers.map((header) => (
                    <TableHead key={header.id} className="font-inter text-xs text-muted-foreground">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <ArticleTableSkeleton />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={COL_COUNT} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <p className="font-inter text-sm text-muted-foreground">Erro ao carregar artigos.</p>
                      <Button variant="outline" size="sm" onClick={refetch}>Tentar novamente</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={COL_COUNT} className="py-12 text-center font-inter text-sm text-muted-foreground">
                    Nenhum artigo encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={`border-border transition-colors hover:bg-muted/5 ${
                      busyIds.has(row.original.articleId) ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 mb-12 font-inter text-xs text-muted-foreground/50">
          {isLoading ? "Carregando..." : `${totalCount} artigo${totalCount !== 1 ? "s" : ""} no total`}
        </p>
      </AnimateIn>

      <PublishDialog
        open={!!publishConfirmId}
        onConfirm={onPublishConfirm}
        onCancel={() => setPublishConfirmId(null)}
        isLoading={isPublishing}
      />
      <RejectDialog
        open={!!rejectConfirmId}
        onConfirm={onRejectConfirm}
        onCancel={() => setRejectConfirmId(null)}
        isLoading={isRejecting}
      />
      <DeleteDialog
        open={!!deleteConfirmId}
        onConfirm={onDeleteConfirm}
        onCancel={() => setDeleteConfirmId(null)}
        isLoading={isDeleting}
      />
    </>
  );
}
