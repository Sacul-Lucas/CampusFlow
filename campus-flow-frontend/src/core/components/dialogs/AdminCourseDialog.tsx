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
import { resolveMediaUrl } from "@/core/lib/utils/mediaUrl"

import {
  CreateCourseAction,
} from "@/core/actions/CreateCourseAction"

import {
  UpdateCourseAction,
} from "@/core/actions/UpdateCourseAction"

import {
  DeleteCourseAction,
} from "@/core/actions/DeleteCourseAction"

import {
  UploadCourseImageAction,
} from "@/core/actions/UploadCourseImageAction"

const courseFormSchema = z.object({
  title: z.string().min(3),

  shortDescription: z.string().min(5),

  fullDescription: z.string().min(10),

  thumbnail: z.string().min(1),

  banner: z.string().optional(),

  shortUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) =>
        !value ||
        /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[A-Za-z0-9_-]+(\?.*)?$/i.test(
          value,
        ),
      {
        message:
          'Informe um link válido de YouTube Shorts',
      },
    ),

  category: z.string().min(2),

  level: z.enum([
    "beginner",
    "intermediate",
    "advanced",
  ]),

  tags: z.string().optional(),

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

  const [isUploadingThumbnail, setIsUploadingThumbnail] =
    useState(false)
  const [isUploadingBanner, setIsUploadingBanner] =
    useState(false)

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

      thumbnail: "",

      banner: "",

      category: "",

      level: "beginner",

      tags: "",

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

        thumbnail:
          course.thumbnail || "",

        banner:
          course.banner || "",

        shortUrl:
          course.shortUrl || "",

        category:
          course.category || "",

        level:
          course.level as
            | "beginner"
            | "intermediate"
            | "advanced",

        tags:
          course.tags?.join(", ") || "",

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

        thumbnail: "",

        banner: "",

        shortUrl: "",

        category: "",

        level: "beginner",

        tags: "",

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
    const payload = {
      ...values,
      tags: values.tags
        ? values.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    }

    const response =
      await CreateCourseAction.execute(
        payload
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

  const updateCourse = async (
    values:
      z.infer<
        typeof courseFormSchema
      >
  ) => {
    const payload = {
      ...values,
      tags: values.tags
        ? values.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    }

    const response =
      await UpdateCourseAction.execute(
        payload,
        course._id
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

  const handleCourseImageUpload = async (
    file: File,
    type: "thumbnail" | "banner"
  ) => {
    if (!course._id) return

    if (type === "thumbnail") {
      setIsUploadingThumbnail(true)
    } else {
      setIsUploadingBanner(true)
    }

    const response = await UploadCourseImageAction.execute({
      courseId: course._id,
      file,
      type,
    })

    if (type === "thumbnail") {
      setIsUploadingThumbnail(false)
    } else {
      setIsUploadingBanner(false)
    }

    if (response.status === "SUCCESS") {
      form.setValue(type, response.data)
      toast.success("Imagem enviada com sucesso!", {
        className: "!bg-emerald-700 !border-emerald-800 !text-white",
      })
      onChange()
      return
    }

    toast.error(response.data, {
      className: "!bg-red-700 !border-red-800 !text-white",
    })
  }

  const deleteCourse = async () => {

    const response =
      await DeleteCourseAction.execute(
        course._id
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
                  Descrição completa
                </FieldLabel>

                <textarea
                  readOnly={!isEditable}
                  {...form.register(
                    "fullDescription"
                  )}
                  className="min-h-30 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </Field>

              <Field>
                <FieldLabel>
                  Thumbnail
                </FieldLabel>

                <Input
                  readOnly={!isEditable}
                  {...form.register("thumbnail")}
                  placeholder="/uploads/seed/js.png"
                />

                {dialogAction !== "create" && isEditable && (
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingThumbnail}
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0]
                      if (!file) return
                      void handleCourseImageUpload(file, "thumbnail")
                    }}
                    className="mt-2"
                  />
                )}

                {form.watch("thumbnail") && (
                  <img
                    src={resolveMediaUrl(form.watch("thumbnail"))}
                    alt="Prévia da thumbnail"
                    className="mt-2 h-24 w-full object-cover rounded-md"
                  />
                )}
              </Field>

              <Field>
                <FieldLabel>
                  Banner
                </FieldLabel>

                <Input
                  readOnly={!isEditable}
                  {...form.register("banner")}
                  placeholder="/uploads/seed/js-banner.png"
                />

                {dialogAction !== "create" && isEditable && (
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingBanner}
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0]
                      if (!file) return
                      void handleCourseImageUpload(file, "banner")
                    }}
                    className="mt-2"
                  />
                )}

                {form.watch("banner") && (
                  <img
                    src={resolveMediaUrl(form.watch("banner"))}
                    alt="Prévia do banner"
                    className="mt-2 h-24 w-full object-cover rounded-md"
                  />
                )}
              </Field>

              <Field>
                <FieldLabel>
                  Tags
                </FieldLabel>

                <Input
                  readOnly={!isEditable}
                  {...form.register("tags")}
                  placeholder="javascript, frontend, node"
                />

                <FieldDescription>
                  Separe as tags por vírgula.
                </FieldDescription>
              </Field>

              <FieldGroup className="grid gap-4 md:grid-cols-2">
                <Field>
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      disabled={!isEditable}
                      {...form.register("published")}
                      className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                    />
                    Publicado
                  </label>
                </Field>

                <Field>
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      disabled={!isEditable}
                      {...form.register("hasCertificate")}
                      className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                    />
                    Possui certificado
                  </label>
                </Field>
              </FieldGroup>

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