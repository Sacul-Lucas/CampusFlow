"use client"

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { GetCoursesAction } from "@/core/actions/GetCoursesAction"
import type { Course } from "@/core/lib/types/Course"
import { formatDate } from "@/core/lib/utils/dateFormatter"

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

export const ModulesAdminTable = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCourses = async () => {
    setLoading(true)

    const response = await GetCoursesAction.execute()

    if (response.status === "SUCCESS") {
      setCourses(response.data)
    } else {
      toast.error(response.data, {
        className: "!bg-red-700 !border-red-800 !text-white",
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    void fetchCourses()
  }, [])

  return (
    <div>
      <div className="space-y-1">
        <h1 className="text-sm font-medium">
          Módulos de cursos
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestão administrativa dos módulos cadastrados por curso.
        </p>
      </div>

      <Separator className="my-3" />

      <Table>
        <TableCaption>
          Lista dos módulos organizados por curso
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Curso</TableHead>
            <TableHead>Módulos</TableHead>
            <TableHead>Vídeos totais</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {courses.map((course) => (
            <TableRow key={course._id} className="cursor-pointer">
              <TableCell className="font-medium">
                {loading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  course.title
                )}
              </TableCell>

              <TableCell>
                {loading ? (
                  <Skeleton className="h-4 w-10" />
                ) : (
                  <Badge variant="secondary">
                    {course.totalModules}
                  </Badge>
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
                  <Skeleton className="h-4 w-24" />
                ) : (
                  formatDate(course.updatedAt)
                )}
              </TableCell>

              <TableCell>
                {loading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  course.totalModules > 0 ? (
                    <Badge variant="default">Possui módulos</Badge>
                  ) : (
                    <Badge variant="secondary">Sem módulos</Badge>
                  )
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
              Total de cursos: {courses.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
