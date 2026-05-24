"use client"

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
  useEffect,
  useState,
  type ReactNode,
} from "react"

import { toast } from "sonner"

import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../shadcnComponents/ui/field"

import { Input } from "../shadcnComponents/ui/input"

import { Button } from "../shadcnComponents/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcnComponents/ui/select"

import type { Course } from "@/core/lib/types/Course"

import {
  CreateCourseAction,
} from "@/core/actions/CreateCourseAction"

import {
  UpdateCourseAction,
} from "@/core/actions/UpdateCourseAction"

import {
  DeleteCourseAction,
} from "@/core/actions/DeleteCourseAction"

const courseFormSchema = z.object({
  title: z.string().min(3),

  shortDescription: z.string().min(5),

  fullDescription: z.string().min(10),

  category: z.string().min(2),

  level: z.enum([
    "beginner",
    "intermediate",
    "advanced",
  ]),

  published: z.boolean(),

  hasCertificate: z.boolean(),
})

interface AdminCourseDialogProps {
  course: Course

  children: ReactNode

  onChange: () => void
}

export const AdminCourseDialog:
React.FC<AdminCourseDialogProps> = ({
  course,
  children,
  onChange,
}) => {

  const [open, setOpen] =
    useState(false)

  const [dialogAction, setDialogAction] =
    useState<
      "create" |
      "view" |
      "edit" |
      "delete" |
      null
    >(null)

  const isEditable =
    dialogAction === "edit" ||
    dialogAction === "create"

  const form = useForm<
    z.infer<typeof courseFormSchema>
  >({
    resolver:
      zodResolver(courseFormSchema),

    defaultValues: {
      title: "",

      shortDescription: "",

      fullDescription: "",

      category: "",

      level: "beginner",

      published: true,

      hasCertificate: true,
    },
  })

  const handleAction = (
    action:
      | "create"
      | "view"
      | "edit"
      | "delete"
  ) => {
    setDialogAction(action)

    setOpen(true)
  }

  const getDialogContent = () => {
    switch (dialogAction) {
      case "create":
        return {
          title: "Criar curso",

          description:
            "Crie um novo curso.",
        }

      case "view":
        return {
          title: "Visualizar curso",

          description:
            "Visualize os dados do curso.",
        }

      case "edit":
        return {
          title: "Editar curso",

          description:
            "Edite os dados do curso.",
        }

      case "delete":
        return {
          title: "Tem certeza?",

          description:
            "Essa ação não pode ser desfeita.",
        }

      default:
        return {
          title: "",

          description: "",
        }
    }
  }

  const {
    title,
    description,
  } = getDialogContent()

  useEffect(() => {
    if (!open) return

    if (
      !dialogAction ||
      dialogAction === "delete"
    ) return

    if (dialogAction !== "create") {
      form.reset({
        title: course.title,

        shortDescription:
          course.shortDescription,

        fullDescription:
          course.fullDescription,

        category:
          course.category || "",

        level:
          course.level as
            | "beginner"
            | "intermediate"
            | "advanced",

        published:
          course.published,

        hasCertificate:
          course.hasCertificate,
      })
    } else {
      form.reset({
        title: "",

        shortDescription: "",

        fullDescription: "",

        category: "",

        level: "beginner",

        published: true,

        hasCertificate: true,
      })
    }
  }, [
    open,
    dialogAction,
    form,
    course,
  ])

  const createCourse = async (
    values:
      z.infer<
        typeof courseFormSchema
      >
  ) => {

    const response =
      await CreateCourseAction.execute(
        values
      )

    switch (response.status) {
      case "SUCCESS":
        toast.success(response.data)

        onChange()

        setOpen(false)

        break

      default:
        toast.error(response.data)

        break
    }
  }

  const updateCourse = async (
    values:
      z.infer<
        typeof courseFormSchema
      >
  ) => {

    const response =
      await UpdateCourseAction.execute(
        values,
        course._id
      )

    switch (response.status) {
      case "SUCCESS":
        toast.success(response.data)

        onChange()

        setOpen(false)

        break

      default:
        toast.error(response.data)

        break
    }
  }

  const deleteCourse = async () => {

    const response =
      await DeleteCourseAction.execute(
        course._id
      )

    switch (response.status) {
      case "SUCCESS":
        toast.success(response.data)

        onChange()

        setOpen(false)

        break

      default:
        toast.error(response.data)

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
            onClick={() =>
              handleAction("create")
            }
          >
            Novo curso
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() =>
              handleAction("view")
            }
          >
            Visualizar
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() =>
              handleAction("edit")
            }
          >
            Editar
          </ContextMenuItem>

          <ContextMenuItem
            className="text-red-500"
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
              dialogAction ===
                "create"
                ? createCourse
                : updateCourse
            )}
          >

            <FieldGroup className="gap-4">

              <Field>
                <FieldLabel>
                  Título
                </FieldLabel>

                <Input
                  readOnly={!isEditable}
                  {...form.register(
                    "title"
                  )}
                />

                {form.formState.errors
                  .title && (
                  <FieldDescription className="text-red-400">
                    {
                      form.formState.errors
                        .title.message
                    }
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel>
                  Descrição curta
                </FieldLabel>

                <Input
                  readOnly={!isEditable}
                  {...form.register(
                    "shortDescription"
                  )}
                />
              </Field>

              <Field>
                <FieldLabel>
                  Categoria
                </FieldLabel>

                <Input
                  readOnly={!isEditable}
                  {...form.register(
                    "category"
                  )}
                />
              </Field>

              <Field>
                <FieldLabel>
                  Nível
                </FieldLabel>

                <Select
                  disabled={!isEditable}
                  value={form.watch(
                    "level"
                  )}
                  onValueChange={(
                    value
                  ) =>
                    form.setValue(
                      "level",
                      value as
                        | "beginner"
                        | "intermediate"
                        | "advanced"
                    )
                  }
                >

                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="beginner">
                      Iniciante
                    </SelectItem>

                    <SelectItem value="intermediate">
                      Intermediário
                    </SelectItem>

                    <SelectItem value="advanced">
                      Avançado
                    </SelectItem>

                  </SelectContent>

                </Select>
              </Field>

            </FieldGroup>

            <DialogFooter className="mt-6">

              <DialogClose asChild>
                <Button
                  variant="outline"
                >
                  Cancelar
                </Button>
              </DialogClose>

              {dialogAction !==
                "view" && (
                <Button
                  type="submit"
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
              <Button variant="outline">
                Cancelar
              </Button>
            </DialogClose>

            <Button
              variant="destructive"
              onClick={deleteCourse}
            >
              Confirmar exclusão
            </Button>

          </DialogFooter>
        )}

      </DialogContent>

    </Dialog>
  )
}