"use client"

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react"

import { toast, Toaster } from "sonner"

import { formatDate } from "@/core/lib/utils/dateFormatter"

import type { Course } from "@/core/lib/types/Course"

import { Separator } from "../shadcnComponents/ui/separator"
import { Skeleton } from "../shadcnComponents/ui/skeleton"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../shadcnComponents/ui/table"

import { Badge } from "../shadcnComponents/ui/badge"

import { GetCoursesAction } from "@/core/actions/GetCoursesAction"

import { AdminCourseDialog } from "../dialogs/AdminCourseDialog"

export const CoursesAdminTable = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCourses = async () => {
    setLoading(true)

    const response = await GetCoursesAction.execute()
    const message = response.data

    switch (response.status) {
      case "SUCCESS":
        setCourses(message)
        break

      default:
        toast.error(message, {
          className: "!bg-red-700 !border-red-800 !text-white",
        })
        break
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return (
    <div>
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-sm font-medium">
          Cursos cadastrados
        </h1>

        <p className="text-sm text-muted-foreground">
          Controle administrativo dos cursos da plataforma
        </p>
      </div>

      <Separator className="my-3" />

      {/* TABLE */}
      <Table>
        <TableCaption>
          Lista dos cursos cadastrados
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Nível</TableHead>
            <TableHead>Módulos</TableHead>
            <TableHead>Vídeos</TableHead>
            <TableHead>Alunos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Certificado</TableHead>
            <TableHead>Criação</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {courses.map((course) => (
            <AdminCourseDialog
              key={course._id}
              course={course}
              onChange={fetchCourses}
            >
              <TableRow className="cursor-pointer">
                <TableCell className="font-medium">
                  {loading ? (
                    <Skeleton className="h-4 w-32" />
                  ) : (
                    course.title
                  )}
                </TableCell>

                <TableCell>
                  {loading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : (
                    course.category || "-"
                  )}
                </TableCell>

                <TableCell>
                  {loading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : (
                    <Badge variant="secondary">
                      {course.level}
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  {loading ? (
                    <Skeleton className="h-4 w-10" />
                  ) : (
                    course.totalModules
                  )}
                </TableCell>

                <TableCell>
                  {loading ? (
                    <Skeleton className="h-4 w-10" />
                  ) : (
                    course.totalVideos
                  )}
                </TableCell>

                <TableCell>
                  {loading ? (
                    <Skeleton className="h-4 w-10" />
                  ) : (
                    course.totalStudents
                  )}
                </TableCell>

                <TableCell>
                  {loading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : (
                    <Badge
                      variant={
                        course.published
                          ? "default"
                          : "destructive"
                      }
                    >
                      {course.published
                        ? "Publicado"
                        : "Rascunho"}
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  {loading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : (
                    <Badge
                      variant={
                        course.hasCertificate
                          ? "default"
                          : "secondary"
                      }
                    >
                      {course.hasCertificate
                        ? "Sim"
                        : "Não"}
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  {loading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    formatDate(course.createdAt)
                  )}
                </TableCell>
              </TableRow>
            </AdminCourseDialog>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={9}>
              Total de cursos: {courses.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Toaster position="bottom-left" />
    </div>
  )
}