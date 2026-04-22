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
import { RiMoreLine } from "@remixicon/react";
import type { UserRoles } from "@/domain/users/types/User";

type MockUser = {
  accountId: string;
  email: string;
  role: UserRoles;
  createdAt: string;
};

const MOCK_USERS: MockUser[] = [
  { accountId: "1", email: "lucas@dev.blog", role: "admin", createdAt: "2024-01-01" },
  { accountId: "2", email: "ana@dev.blog", role: "writer", createdAt: "2024-01-10" },
  { accountId: "3", email: "carlos@dev.blog", role: "writer", createdAt: "2024-01-15" },
  { accountId: "4", email: "mario@dev.blog", role: "student", createdAt: "2024-02-03" },
  { accountId: "5", email: "julia@dev.blog", role: "student", createdAt: "2024-02-20" },
];

const ROLE_VARIANTS: Record<UserRoles, string> = {
  admin: "bg-primary/10 text-primary border-primary/20",
  writer: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  student: "bg-muted/50 text-muted-foreground border-border",
};

const ROLE_LABELS: Record<UserRoles, string> = {
  admin: "Admin",
  writer: "Writer",
  student: "Estudante",
};

function RoleBadge({ role }: { role: UserRoles }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-inter text-xs font-medium ${ROLE_VARIANTS[role]}`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

function UserRowActions({ user }: { user: MockUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <RiMoreLine className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Tornar Estudante</DropdownMenuItem>
        <DropdownMenuItem>Tornar Writer</DropdownMenuItem>
        <DropdownMenuItem>Tornar Admin</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdminUsersView() {
  const [search, setSearch] = useState("");

  const users = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_USERS.filter((u) => u.email.toLowerCase().includes(q));
  }, [search]);

  const columns = useMemo<ColumnDef<MockUser>[]>(
    () => [
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="font-inter text-sm font-medium text-foreground/80">
            {row.getValue("email")}
          </span>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <RoleBadge role={row.getValue("role")} />,
      },
      {
        id: "actions",
        cell: ({ row }) => <UserRowActions user={row.original} />,
      },
    ],
    []
  );

  const table = useReactTable({ data: users, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
      <AnimateIn delay={0}>
        <div className="mb-4">
          <Input
            placeholder="Buscar por email..."
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
                    Nenhum usuário encontrado.
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
            {users.length} usuário{users.length !== 1 ? "s" : ""} encontrado
            {users.length !== 1 ? "s" : ""}
          </p>
        </div>
      </AnimateIn>
    </>
  );
}
