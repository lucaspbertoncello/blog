import { useState, useMemo } from "react";
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from "@tanstack/react-table";
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
import { StatusBadge } from "@/features/articlesPanel/components/StatusBadge";
import { DeleteArticleDialog } from "@/shared/components/custom/DeleteArticleDialog";
import { RiMoreLine } from "@remixicon/react";
import { formatDate } from "@/shared/lib/utils";
import type { ArticleStatus, ArticleVisibility } from "@/domain/articles/types/Article";
import { STATUS_LABELS, STATUS_FILTERS } from "@/features/articlesPanel/constants";
import type { StatusFilter } from "@/features/articlesPanel/hooks/useArticleFilters";

type MockArticle = {
  articleId: string;
  title: string;
  authorEmail: string;
  status: ArticleStatus;
  visibility: ArticleVisibility;
  updatedAt: string;
};

const MOCK_ARTICLES: MockArticle[] = [
  { articleId: "1", title: "Introdução ao TypeScript", authorEmail: "ana@dev.blog", status: "published", visibility: "public", updatedAt: "2024-03-15" },
  { articleId: "2", title: "React Hooks na prática", authorEmail: "carlos@dev.blog", status: "in_review", visibility: "students_only", updatedAt: "2024-03-20" },
  { articleId: "3", title: "CSS Grid vs Flexbox", authorEmail: "ana@dev.blog", status: "draft", visibility: "public", updatedAt: "2024-03-22" },
  { articleId: "4", title: "Deploy com Docker e CI/CD", authorEmail: "lucas@dev.blog", status: "rejected", visibility: "students_only", updatedAt: "2024-03-10" },
  { articleId: "5", title: "Node.js Event Loop explicado", authorEmail: "carlos@dev.blog", status: "in_review", visibility: "public", updatedAt: "2024-03-25" },
];

function ArticleRowActions({ article }: { article: MockArticle }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <RiMoreLine className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Editar</DropdownMenuItem>
          {article.status === "in_review" && (
            <>
              <DropdownMenuItem>Publicar</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Rejeitar
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setConfirmOpen(true)}
          >
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteArticleDialog
        open={confirmOpen}
        isDeleting={false}
        onConfirm={() => setConfirmOpen(false)}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

export function AdminArticlesView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const articles = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_ARTICLES.filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(q) || a.authorEmail.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const columns = useMemo<ColumnDef<MockArticle>[]>(
    () => [
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
        accessorKey: "authorEmail",
        header: "Autor",
        cell: ({ row }) => (
          <span className="font-inter text-xs text-muted-foreground">{row.getValue("authorEmail")}</span>
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
            {formatDate(row.getValue("updatedAt"))}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => <ArticleRowActions article={row.original} />,
      },
    ],
    []
  );

  const table = useReactTable({ data: articles, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
      <AnimateIn delay={0}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Buscar por título ou autor..."
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
                  <TableRow key={row.id} className="border-border transition-colors hover:bg-muted/5">
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
    </>
  );
}
