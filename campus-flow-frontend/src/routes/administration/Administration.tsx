/* eslint-disable react-hooks/set-state-in-effect */
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/shadcnComponents/ui/table"
import { AppSidebarBody } from "@/core/components/body/AppSidebarBody"
import { Separator } from "@/core/components/shadcnComponents/ui/separator"
import { GetUsersAction } from "@/core/actions/GetUsersAction"
import type { User } from "@/core/lib/types/User"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Skeleton } from "@/core/components/shadcnComponents/ui/skeleton"
import { AdminDialog } from "@/core/components/dialogs/AdminDialog"
import { Toaster } from "@/core/components/shadcnComponents/ui/sonner"
import { formatDate } from "@/core/lib/utils/dateFormatter"
import { ShieldIcon } from "lucide-react"

export const Administration = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    
    const fetchUsers = async () => {
      setLoading(true);

      const fetchUsersRes = await GetUsersAction.execute();
      const fetchUsersMessage = fetchUsersRes.data

      switch (fetchUsersRes.status) {
        case 'SUCCESS':
          setUsers(fetchUsersMessage);
          break;

        case 'USER_NOT_FOUND':
          toast.error(fetchUsersMessage, {
            className: "!bg-red-700 !border-red-800 !text-white !align-middle"
          });
          break;
      
        case 'TOKEN_NOT_FOUND':  
        case 'INVALID_TOKEN':
        case 'ACCESS_DENIED':
        case 'UNKNOWN':
          toast.error(fetchUsersMessage, {
            className: "!bg-red-700 !border-red-800 !text-white !align-middle"
          });
          break;
      
        default:
          break;
      }
      setLoading(false);
    };

    useEffect(() => {
      fetchUsers()
    }, [])

    return (
      <AppSidebarBody appSidebarTitle="AtmosInsight - Administração" appSidebarLucideIcon={ShieldIcon} appSidebarBodyStyle="flex-col">
        <div className="mt-8 xl:max-w-[85%]! h-fit w-full">
          <div className="space-y-1">
            <h1 className="text-sm leading-none font-medium">Usuários cadastrados</h1>
            <p className="text-muted-foreground text-sm">
              Controle completo sobre os dados dos usuários registrados no sistema
            </p>
          </div>
          <Separator className="my-2" />
          <Table>
            <TableCaption>Uma lista dos usuários cadastrados (Use o botaâo direito para alterar os dados registrados)</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25">Id</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo de usuário</TableHead>
                <TableHead>Criação</TableHead>
                <TableHead>Modificação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <AdminDialog 
                  key={user._id} 
                  user={user} 
                  onChange={() => {
                    setUsers(prev => prev.filter(u => u._id !== user._id))
                    fetchUsers()
                  }}
                >
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{loading ? (<Skeleton className="h-2"/>) : user._id}</TableCell>
                    <TableCell>{loading ? (<Skeleton className="h-2"/>) : user.username}</TableCell>
                    <TableCell>{loading ? (<Skeleton className="h-2"/>) : user.email}</TableCell>
                    <TableCell>{loading ? (<Skeleton className="h-2"/>) : user.role == 'admin' ? 'Administrador' : 'Usuário padrão'}</TableCell>
                    <TableCell>{loading ? (<Skeleton className="h-2"/>) : formatDate(user.createdAt)}</TableCell>
                    <TableCell>{loading ? (<Skeleton className="h-2"/>) : formatDate(user.updatedAt)}</TableCell>
                  </TableRow>
                </AdminDialog>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>Total: {users.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <Toaster position="bottom-left"/>
      </AppSidebarBody>
    )
}