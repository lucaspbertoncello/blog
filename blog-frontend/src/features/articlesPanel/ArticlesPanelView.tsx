import { useMemo } from "react";
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/common/table";
import { Button } from "@/shared/components/common/button";
import { Input } from "@/shared/components/common/input";
import { AnimateIn } from "@/shared/components/custom/AnimateIn";
import { Spinner } from "@/shared/components/common/spinner";
import { RiAddLine, RiArrowLeftLine } from "@remixicon/react";
import { formatDate } from "@/shared/lib/utils";
import { Link } from "@tanstack/react-router";
import type { useArticlesPanelModel } from "./ArticlesPanelModel";
import type { ArticleListItem, StatusFilter } from "./ArticlesPanelModel";
import { STATUS_LABELS, STATUS_FILTERS } from "./constants/index";
import { StatusBadge } from "./components/StatusBadge";
import { RowActions } from "./components/RowActions";

export type ArticlesPanelViewProps = ReturnType<typeof useArticlesPanelModel>;

export function ArticlesPanelView(props: ArticlesPanelViewProps) {
  const {
    articles,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isLoading,
    onSubmitForReview,
    canSubmitArticleForReview,
    submittingId,
  } = props;

  const columns = useMemo<ColumnDef<ArticleListItem>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Título",
        cell: ({ row }) => (
          <div
            className="max-w-80 overflow-hidden"
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
        cell: ({ row }) =>
          submittingId === row.original.articleId ? (
            <Spinner className="text-muted-foreground" />
          ) : (
            <StatusBadge status={row.getValue("status")} />
          ),
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
            {formatDate(row.getValue("updatedAt"))}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <RowActions
            article={row.original}
            canSubmit={canSubmitArticleForReview(row.original)}
            onSubmitForReview={onSubmitForReview}
          />
        ),
      },
    ],
    [canSubmitArticleForReview, onSubmitForReview, submittingId]
  );

  const table = useReactTable({
    data: articles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative z-10 mx-auto max-w-250 px-12">
      <AnimateIn delay={0}>
        <header className="flex items-center justify-between border-b border-border py-9">
          <span className="font-sans text-base font-light tracking-tight">
            dev<span className="text-primary">.</span>blog
          </span>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <Link to="/">
                <RiArrowLeftLine className="size-4" />
                Feed
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/writer/articles/new">
                <RiAddLine className="size-4" />
                Novo artigo
              </Link>
            </Button>
          </div>
        </header>
      </AnimateIn>

      <AnimateIn delay={80}>
        <div className="mt-8 mb-4 flex flex-col gap-4">
          <h1 className="font-sans text-xl font-bold tracking-tight">Painel de artigos</h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                  onClick={() => setStatusFilter(s as StatusFilter)}
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
        </div>
      </AnimateIn>

      <AnimateIn delay={140}>
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
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-12 text-center font-inter text-sm text-muted-foreground"
                  >
                    Carregando artigos...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-12 text-center font-inter text-sm text-muted-foreground"
                  >
                    Nenhum artigo encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={`border-border transition-colors hover:bg-muted/5 ${
                      submittingId === row.original.articleId ? "pointer-events-none opacity-50" : ""
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

        <div className="mt-3 mb-12">
          <p className="font-inter text-xs text-muted-foreground/50">
            {articles.length} artigo{articles.length !== 1 ? "s" : ""} encontrado
            {articles.length !== 1 ? "s" : ""}
          </p>
        </div>
      </AnimateIn>
    </div>
  );
}
