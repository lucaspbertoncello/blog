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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/shared/components/common/dialog";
import { RiMoreLine } from "@remixicon/react";
import { formatDate } from "@/shared/lib/utils";

type MockComment = {
  commentId: string;
  text: string;
  authorEmail: string;
  articleTitle: string;
  articleSlug: string;
  createdAt: string;
};

const MOCK_COMMENTS: MockComment[] = [
  {
    commentId: "1",
    text: "Ótimo artigo! Muito bem explicado, parabéns pelo conteúdo.",
    authorEmail: "carlos@dev.blog",
    articleTitle: "Introdução ao TypeScript",
    articleSlug: "intro-typescript",
    createdAt: "2024-03-16",
  },
  {
    commentId: "2",
    text: "Tenho dúvidas sobre o useEffect, poderia explicar melhor o ciclo de vida?",
    authorEmail: "mario@dev.blog",
    articleTitle: "React Hooks na prática",
    articleSlug: "react-hooks",
    createdAt: "2024-03-21",
  },
  {
    commentId: "3",
    text: "Prefiro flexbox para a maioria dos layouts, grid só uso em casos específicos.",
    authorEmail: "julia@dev.blog",
    articleTitle: "CSS Grid vs Flexbox",
    articleSlug: "css-grid-vs-flexbox",
    createdAt: "2024-03-23",
  },
  {
    commentId: "4",
    text: "Esse conteúdo sobre Docker mudou minha forma de trabalhar no dia a dia.",
    authorEmail: "ana@dev.blog",
    articleTitle: "Deploy com Docker e CI/CD",
    articleSlug: "deploy-docker-cicd",
    createdAt: "2024-03-26",
  },
];

function DeleteCommentDialog({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Excluir comentário</DialogTitle>
          <DialogDescription>
            Essa ação é permanente e não pode ser desfeita. O comentário será removido definitivamente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CommentRowActions({ comment }: { comment: MockComment }) {
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
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setConfirmOpen(true)}
          >
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteCommentDialog
        open={confirmOpen}
        onConfirm={() => setConfirmOpen(false)}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

export function AdminCommentsView() {
  const [search, setSearch] = useState("");

  const comments = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_COMMENTS.filter(
      (c) =>
        c.authorEmail.toLowerCase().includes(q) ||
        c.articleTitle.toLowerCase().includes(q)
    );
  }, [search]);

  const columns = useMemo<ColumnDef<MockComment>[]>(
    () => [
      {
        accessorKey: "text",
        header: "Comentário",
        cell: ({ row }) => (
          <div
            className="max-w-80 overflow-hidden"
            style={{
              WebkitMaskImage: "linear-gradient(to right, black 65%, transparent 100%)",
              maskImage: "linear-gradient(to right, black 65%, transparent 100%)",
            }}
          >
            <span className="block font-inter text-sm whitespace-nowrap text-foreground/80">
              {row.getValue("text")}
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
        accessorKey: "articleTitle",
        header: "Artigo",
        cell: ({ row }) => (
          <span className="font-inter text-xs text-muted-foreground">{row.getValue("articleTitle")}</span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Data",
        cell: ({ row }) => (
          <span className="font-inter text-xs text-muted-foreground">
            {formatDate(row.getValue("createdAt"))}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => <CommentRowActions comment={row.original} />,
      },
    ],
    []
  );

  const table = useReactTable({ data: comments, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
      <AnimateIn delay={0}>
        <div className="mb-4">
          <Input
            placeholder="Buscar por autor ou artigo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-72 font-inter text-sm"
          />
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
                    Nenhum comentário encontrado.
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
            {comments.length} comentário{comments.length !== 1 ? "s" : ""} encontrado
            {comments.length !== 1 ? "s" : ""}
          </p>
        </div>
      </AnimateIn>
    </>
  );
}
