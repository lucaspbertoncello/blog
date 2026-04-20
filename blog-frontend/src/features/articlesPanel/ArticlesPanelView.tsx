import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/common/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/common/dropdown-menu";
import { Button } from "@/shared/components/common/button";
import { Input } from "@/shared/components/common/input";
import { AnimateIn } from "@/shared/components/custom/AnimateIn";
import { RiAddLine, RiMoreLine } from "@remixicon/react";
import { formatDate } from "@/shared/lib/utils";
import { Link } from "@tanstack/react-router";
import type { useArticlesPanelModel } from "./ArticlesPanelModel";
import type { ArticleListItem, StatusFilter } from "./ArticlesPanelModel";
import type { ArticleStatus } from "@/domain/articles/types/Article";

export type ArticlesPanelViewProps = ReturnType<typeof useArticlesPanelModel>;

const STATUS_LABELS: Record<ArticleStatus | "all", string> = {
  all: "Todos",
  draft: "Rascunho",
  in_review: "Em revisão",
  published: "Publicado",
  rejected: "Rejeitado",
};

const STATUS_FILTERS: Array<ArticleStatus | "all"> = [
  "all",
  "draft",
  "in_review",
  "published",
  "rejected",
];

function StatusBadge({ status }: { status: ArticleStatus }) {
  const variants: Record<ArticleStatus, string> = {
    draft: "bg-muted/50 text-muted-foreground border-border",
    in_review: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    published: "bg-primary/10 text-primary border-primary/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-inter text-xs font-medium ${variants[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

type RowActionsProps = {
  article: ArticleListItem;
};

function RowActions({ article }: RowActionsProps) {
  const canSubmit = article.status === "draft" || article.status === "rejected";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <RiMoreLine className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/writer/articles/$articleId/edit" params={{ articleId: article.articleId }}>
            Editar
          </Link>
        </DropdownMenuItem>
        {canSubmit && (
          <DropdownMenuItem>
            Enviar para revisão
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ArticlesPanelView(props: ArticlesPanelViewProps) {
  const { articles, search, setSearch, statusFilter, setStatusFilter } = props;

  const columns = useMemo<ColumnDef<ArticleListItem>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Título",
        cell: ({ row }) => (
          <span className="font-inter text-sm font-medium text-foreground/80">
            {row.getValue("title")}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
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
        cell: ({ row }) => <RowActions article={row.original} />,
      },
    ],
    []
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
          <span className="font-sans text-sm font-bold tracking-tight">
            dev<span className="text-primary">.</span>blog
          </span>
          <Link to="/writer/articles/new">
            <Button size="sm" className="gap-1.5">
              <RiAddLine className="size-4" />
              Novo artigo
            </Button>
          </Link>
        </header>
      </AnimateIn>

      <AnimateIn delay={80}>
        <div className="mt-8 mb-4 flex flex-col gap-4">
          <h1 className="font-sans text-xl font-bold tracking-tight">
            Painel de artigos
          </h1>

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
                    <TableHead
                      key={header.id}
                      className="font-inter text-xs text-muted-foreground"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
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
                    className="border-border transition-colors hover:bg-muted/5"
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
            {articles.length} artigo{articles.length !== 1 ? "s" : ""} encontrado{articles.length !== 1 ? "s" : ""}
          </p>
        </div>
      </AnimateIn>
    </div>
  );
}
