/* eslint-disable react-hooks/incompatible-library */
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/shadcnComponents/ui/dialog"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/core/components/shadcnComponents/ui/context-menu"

import {
  Eye,
  EyeClosed
} from "lucide-react"

import { Button } from "@/core/components/shadcnComponents/ui/button"

import {
  useEffect,
  useState,
  type ReactNode
} from "react"

import { Input } from "../shadcnComponents/ui/input"

import { toast } from "sonner"

import type { User } from "@/core/lib/types/User"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from "../shadcnComponents/ui/field"

import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"

import { z } from "zod"

import { adminFormSchema } from "@/core/lib/utils/userFormSchema"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcnComponents/ui/select"

import { CreateUserAction } from "@/core/actions/CreateUserAction"
import { UpdateUserAction } from "@/core/actions/UpdateUserAction"
import { DeleteUserAction } from "@/core/actions/DeleteUserAction"

import { AdminUserRole } from "@/core/lib/utils/userRole"

interface AdminDialogProps {
  user: User
  children: ReactNode
  onChange: () => void
}

export const AdminDialog: React.FC<AdminDialogProps> = ({
  user,
  children,
  onChange
}) => {
  const [open, setOpen] = useState(false)

  const [dialogAction, setDialogAction] = useState<
    "create" | "view" | "edit" | "delete" | null
  >(null)

  const [showPassword, setShowPassword] = useState(false)

  const isEditable =
    dialogAction === "edit" ||
    dialogAction === "create"

  const form = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: AdminUserRole.Student
    }
  })

  const handleAction = (
    action: "create" | "view" | "edit" | "delete"
  ) => {
    setDialogAction(action)
    setOpen(true)
  }

  const getDialogContent = () => {
    switch (dialogAction) {
      case "create":
        return {
          title: "Criar usuário",
          description:
            "Crie um novo usuário abaixo."
        }

      case "view":
        return {
          title: "Visualizar usuário",
          description:
            "Visualize os dados do usuário."
        }

      case "edit":
        return {
          title: "Editar usuário",
          description:
            "Edite os dados do usuário abaixo."
        }

      case "delete":
        return {
          title: "Tem certeza?",
          description:
            "Essa ação não pode ser desfeita."
        }

      default:
        return {
          title: "",
          description: ""
        }
    }
  }

  const { title, description } =
    getDialogContent()

  useEffect(() => {
    if (!open) return

    if (
      !dialogAction ||
      dialogAction === "delete"
    ) return

    if (dialogAction !== "create") {
      form.reset({
        username: user.username,
        email: user.email,
        password: user.password ?? "",
        role: user.role
      })
    } else {
      form.reset({
        username: "",
        email: "",
        password: "",
        role: AdminUserRole.Student
      })
    }
  }, [
    open,
    dialogAction,
    form,
    user.username,
    user.email,
    user.password,
    user.role
  ])

  const createUser = async (
    values: z.infer<typeof adminFormSchema>
  ) => {
    const {
      username,
      email,
      password,
      role
    } = values

    const response =
      await CreateUserAction.execute({
        username,
        email,
        password,
        role
      })

    switch (response.status) {
      case "SUCCESS":
        toast.success(response.data, {
          className:
            "!bg-emerald-700 !border-emerald-800 !text-white"
        })

        onChange()
        setOpen(false)

        break

      default:
        toast.error(response.data, {
          className:
            "!bg-red-700 !border-red-800 !text-white"
        })

        break
    }
  }

  const updateUser = async (
    values: z.infer<typeof adminFormSchema>
  ) => {
    const {
      username,
      email,
      role
    } = values

    const response =
      await UpdateUserAction.execute(
        {
          username,
          email,
          role
        },
        user._id
      )

    switch (response.status) {
      case "SUCCESS":
        toast.success(response.data, {
          className:
            "!bg-emerald-700 !border-emerald-800 !text-white"
        })

        onChange()
        setOpen(false)

        break

      default:
        toast.error(response.data, {
          className:
            "!bg-red-700 !border-red-800 !text-white"
        })

        break
    }
  }

  const deleteUser = async () => {
    const response =
      await DeleteUserAction.execute(user._id)

    switch (response.status) {
      case "SUCCESS":
        toast.success(response.data, {
          className:
            "!bg-emerald-700 !border-emerald-800 !text-white"
        })

        onChange()
        setOpen(false)

        break

      default:
        toast.error(response.data, {
          className:
            "!bg-red-700 !border-red-800 !text-white"
        })

        break
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          {children}
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem
            className="cursor-pointer"
            onClick={() =>
              handleAction("create")
            }
          >
            Novo usuário
          </ContextMenuItem>

          <ContextMenuItem
            className="cursor-pointer"
            onClick={() =>
              handleAction("view")
            }
          >
            Visualizar
          </ContextMenuItem>

          <ContextMenuItem
            className="cursor-pointer"
            onClick={() =>
              handleAction("edit")
            }
          >
            Editar
          </ContextMenuItem>

          <ContextMenuItem
            className="cursor-pointer text-red-500"
            onClick={() =>
              handleAction("delete")
            }
          >
            Deletar
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>

          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        {dialogAction !== "delete" && (
          <form
            onSubmit={form.handleSubmit(
              dialogAction === "create"
                ? createUser
                : updateUser
            )}
          >
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel>
                  Nome de usuário
                </FieldLabel>

                <Input
                  type="text"
                  readOnly={!isEditable}
                  {...form.register(
                    "username"
                  )}
                />

                {form.formState.errors
                  .username && (
                  <FieldDescription className="text-red-400">
                    {String(
                      form.formState.errors
                        .username.message
                    )}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel>
                  Email
                </FieldLabel>

                <Input
                  type="email"
                  readOnly={!isEditable}
                  {...form.register(
                    "email"
                  )}
                />

                {form.formState.errors
                  .email && (
                  <FieldDescription className="text-red-400">
                    {String(
                      form.formState.errors
                        .email.message
                    )}
                  </FieldDescription>
                )}
              </Field>

              {dialogAction ===
                "create" && (
                <Field>
                  <FieldLabel>
                    Senha
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="off"
                      readOnly={
                        !isEditable
                      }
                      {...form.register(
                        "password"
                      )}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <Eye />
                      ) : (
                        <EyeClosed />
                      )}
                    </button>
                  </div>

                  {form.formState.errors
                    .password && (
                    <FieldDescription className="text-red-400">
                      {String(
                        form.formState.errors
                          .password.message
                      )}
                    </FieldDescription>
                  )}
                </Field>
              )}

              <Field>
                <FieldLabel>
                  Tipo de usuário
                </FieldLabel>

                <Select
                  disabled={!isEditable}
                  value={form.watch(
                    "role"
                  )}
                  onValueChange={(
                    value
                  ) =>
                    form.setValue(
                      "role",
                      value as AdminUserRole
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="teacher">
                      Professor
                    </SelectItem>

                    <SelectItem value="student">
                      Estudante
                    </SelectItem>

                    <SelectItem value="admin">
                      Administrador
                    </SelectItem>
                  </SelectContent>
                </Select>

                {form.formState.errors
                  .role && (
                  <FieldDescription className="text-red-400">
                    {String(
                      form.formState.errors
                        .role.message
                    )}
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                >
                  Cancelar
                </Button>
              </DialogClose>

              {dialogAction !==
                "view" && (
                <Button
                  type="submit"
                  className="cursor-pointer"
                >
                  Confirmar
                </Button>
              )}
            </DialogFooter>
          </form>
        )}

        {dialogAction ===
          "delete" && (
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
              >
                Cancelar
              </Button>
            </DialogClose>

            <Button
              variant="destructive"
              onClick={deleteUser}
              className="cursor-pointer"
            >
              Confirmar exclusão
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}