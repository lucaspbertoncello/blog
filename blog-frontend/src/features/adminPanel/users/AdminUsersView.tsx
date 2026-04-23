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
import { RiMoreLine } from "@remixicon/react";
import type { useAdminUsersSection } from "../hooks/useAdminUsersSection";
import type { User, UserRoles } from "../hooks/useAdminUsersSection";

export type AdminUsersViewProps = ReturnType<typeof useAdminUsersSection>;

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
const ALL_ROLES: UserRoles[] = ["admin", "writer", "student"];

function RoleBadge({ role }: { role: UserRoles }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-inter text-xs font-medium ${ROLE_VARIANTS[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  );
}

function UserTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="border-border hover:bg-transparent">
          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
          <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

type ChangeRoleDialogProps = {
  user: { accountId: string; currentRole: UserRoles } | null;
  onConfirm: (accountId: string, role: UserRoles) => void;
  onCancel: () => void;
  isLoading: boolean;
};

function ChangeRoleDialog({ user, onConfirm, onCancel, isLoading }: ChangeRoleDialogProps) {
  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Alterar role do usuário</DialogTitle>
          <DialogDescription>
            Selecione a nova role. A alteração tem efeito imediato.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {ALL_ROLES.map((role) => (
            <Button
              key={role}
              variant={user?.currentRole === role ? "outline" : "ghost"}
              className="justify-start gap-2"
              disabled={isLoading || user?.currentRole === role}
              onClick={() => user && onConfirm(user.accountId, role)}
            >
              <RoleBadge role={role} />
              <span className="font-inter text-sm">{ROLE_LABELS[role]}</span>
              {user?.currentRole === role && (
                <span className="ml-auto font-inter text-xs text-muted-foreground">atual</span>
              )}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={isLoading}>Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AdminUsersView(props: AdminUsersViewProps) {
  const {
    users, isLoading, isError, refetch,
    search, setSearch,
    totalCount,
    roleChangeTarget, setRoleChangeTarget,
    onChangeRole, isChangingRole,
  } = props;

  const columns = useMemo<ColumnDef<User>[]>(() => [
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
      accessorKey: "createdAt",
      header: "Membro desde",
      cell: ({ row }) => (
        <span className="font-inter text-xs text-muted-foreground">
          {new Date(row.getValue("createdAt")).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <RiMoreLine className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                setRoleChangeTarget({ accountId: row.original.accountId, currentRole: row.original.role })
              }
            >
              Alterar role
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [setRoleChangeTarget]);

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
              {isLoading ? (
                <UserTableSkeleton />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <p className="font-inter text-sm text-muted-foreground">Erro ao carregar usuários.</p>
                      <Button variant="outline" size="sm" onClick={refetch}>Tentar novamente</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center font-inter text-sm text-muted-foreground">
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
        <p className="mt-3 mb-12 font-inter text-xs text-muted-foreground/50">
          {isLoading ? "Carregando..." : `${totalCount} usuário${totalCount !== 1 ? "s" : ""} no total`}
        </p>
      </AnimateIn>

      <ChangeRoleDialog
        user={roleChangeTarget}
        onConfirm={onChangeRole}
        onCancel={() => setRoleChangeTarget(null)}
        isLoading={isChangingRole}
      />
    </>
  );
}
