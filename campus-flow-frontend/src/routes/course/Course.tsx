"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */

import { AppSidebarBody } from "@/core/components/body/AppSidebarBody"
import { AppSidebarCard } from "@/core/components/cards/AppSidebarCard"

import { Button } from "@/core/components/shadcnComponents/ui/button"

import { Skeleton } from "@/core/components/shadcnComponents/ui/skeleton"

import { EnrollCourseAction } from "@/core/actions/EnrollCourseAction"

import { GetCourseByIdAction } from "@/core/actions/GetCourseByIdAction"

import { GetCourseProgressAction } from "@/core/actions/GetCourseProgressAction"

import { UnenrollCourseAction } from "@/core/actions/UnenrollCourseAction"

import type { Course } from "@/core/lib/types/Course"

import { decodeToken } from "@/core/lib/utils/tokenValidation"
import { resolveMediaUrl } from "@/core/lib/utils/mediaUrl"

import {
  ArrowLeft,
  BookOpen,
  Layers,
  Star,
  Users,
  Video,
} from "lucide-react"

import {
  useEffect,
  useState,
} from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import { toast } from "sonner"

interface CourseProgress {
  percentage: number
  completedVideos: string[]
  currentVideo: string
  currentModule: string
  completed: boolean
  watchedMinutes: number
  lastAccessAt: string
}

export const CoursePage = () => {
  const navigate = useNavigate()

  const { courseId } =
    useParams<{ courseId: string }>()

  const [course, setCourse] =
    useState<Course | null>(null)

  const [progress, setProgress] =
    useState<CourseProgress | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [actionLoading, setActionLoading] =
    useState(false)

  const [isEnrolled, setIsEnrolled] =
    useState(false)

  const [userId, setUserId] =
    useState<string | null>(null)

  useEffect(() => {
    const token =
      localStorage.getItem("token")

    if (!token) return

    const decoded = decodeToken(token)

    if (!decoded) return

    setUserId(decoded.sub)
  }, [])

  useEffect(() => {
    void fetchCourseDetails()
  }, [courseId, userId])

  const fetchCourseDetails = async () => {
    if (!courseId) return

    setLoading(true)

    const courseResponse =
      await GetCourseByIdAction.execute(
        courseId
      )

    if (
      courseResponse.status !==
      "SUCCESS"
    ) {
      toast.error(courseResponse.data, {
        className:
          "!bg-red-700 !border-red-800 !text-white",
      })

      setLoading(false)

      return
    }

    const courseData =
      courseResponse.data as Course

    setCourse(courseData)

    const enrolled =
      checkEnrolled(
        courseData,
        userId
      )

    setIsEnrolled(enrolled)

    if (enrolled) {
      const progressResponse =
        await GetCourseProgressAction.execute(
          courseId
        )

      if (
        progressResponse.status ===
        "SUCCESS"
      ) {
        setProgress(
          progressResponse.data
        )
      } else {
        setProgress(null)
      }
    } else {
      setProgress(null)
    }

    setLoading(false)
  }

  const checkEnrolled = (
    courseData: Course,
    currentUserId: string | null
  ) => {
    if (!currentUserId) return false

    return courseData.students.some(
      (student) => {
        if (!student) return false

        return typeof student ===
          "string"
          ? student === currentUserId
          : student._id ===
              currentUserId
      }
    )
  }

  const getTeacherName = () => {
    if (!course)
      return "Professor desconhecido"

    if (
      typeof course.teacher ===
      "string"
    )
      return "Professor"

    return (
      course.teacher.username ||
      "Professor"
    )
  }

  const courseRating = () => {
    if (
      !course?.reviews ||
      course.reviews.length === 0
    )
      return 0

    const total =
      course.reviews.reduce(
        (sum, review) =>
          sum +
          (review.rating || 0),
        0
      )

    return Math.round(
      total /
        course.reviews.length
    )
  }

  const getModuleStatus = (
    moduleIndex: number
  ) => {
    if (!progress || !course)
      return "Não iniciado"

    const module =
      course.modules[moduleIndex]

    if (
      !module ||
      module.videos.length === 0
    )
      return "Não iniciado"

    const completedCount =
      module.videos.filter(
        (video) =>
          progress.completedVideos.includes(
            video.title
          )
      ).length

    if (completedCount === 0)
      return "Não iniciado"

    if (
      completedCount ===
      module.videos.length
    )
      return "Concluído"

    return "Em andamento"
  }

  const getLiveStatus = (
    live: any
  ) => {
    if (live.isFinished) {
      return "finished"
    }

    const now = new Date()

    const scheduled =
      new Date(live.scheduledDate)

    const diffInMinutes =
      (scheduled.getTime() -
        now.getTime()) /
      (1000 * 60)

    if (
      diffInMinutes <= 120 &&
      diffInMinutes >= -120
    ) {
      return "live"
    }

    return "scheduled"
  }

  const getLiveStatusLabel = (
    status: string
  ) => {
    switch (status) {
      case "live":
        return "Ao vivo"

      case "finished":
        return "Finalizada"

      default:
        return "Agendada"
    }
  }

  const getLiveStatusClass = (
    status: string
  ) => {
    switch (status) {
      case "live":
        return "bg-emerald-100 text-emerald-700"

      case "finished":
        return "bg-slate-100 text-slate-900"

      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  const formatLiveDate = (
    value: string
  ) => {
    const date = new Date(value)

    return date.toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    )
  }

  const formatLiveTime = (
    value: string
  ) => {
    const date = new Date(value)

    return date.toLocaleTimeString(
      "pt-BR",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )
  }

  const handleEnroll = async () => {
    if (!courseId) return

    setActionLoading(true)

    const response =
      await EnrollCourseAction.execute(
        courseId
      )

    if (
      response.status ===
      "SUCCESS"
    ) {
      toast.success(response.data, {
        className:
          "!bg-emerald-700 !border-emerald-800 !text-white",
      })

      await fetchCourseDetails()
    } else {
      toast.error(response.data, {
        className:
          "!bg-red-700 !border-red-800 !text-white",
      })
    }

    setActionLoading(false)
  }

  const handleUnenroll = async () => {
    if (!courseId) return

    setActionLoading(true)

    const response =
      await UnenrollCourseAction.execute(
        courseId
      )

    if (
      response.status ===
      "SUCCESS"
    ) {
      toast.success(response.data, {
        className:
          "!bg-emerald-700 !border-emerald-800 !text-white",
      })

      await fetchCourseDetails()
    } else {
      toast.error(response.data, {
        className:
          "!bg-red-700 !border-red-800 !text-white",
      })
    }

    setActionLoading(false)
  }

  const renderReview = (
    review: any
  ) => {
    const author =
      typeof review.user ===
      "string"
        ? "Aluno"
        : review.user
            ?.username || "Aluno"

    return (
      <div
        key={review._id}
        className="
          rounded-lg
          border
          border-slate-200
          bg-slate-950/5
          p-4
        "
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">
              {author}
            </p>

            <p className="text-xs text-muted-foreground">
              Nota:
              {" "}
              {review.rating}/5
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            {new Date(
              review.createdAt
            ).toLocaleDateString()}
          </div>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          {review.comment ||
            "Sem comentário"}
        </p>
      </div>
    )
  }

  const renderQuestion = (
    question: any
  ) => {
    const author =
      typeof question.user ===
      "string"
        ? "Aluno"
        : question.user
            ?.username || "Aluno"

    return (
      <div
        key={question._id}
        className="
          rounded-lg
          border
          border-slate-200
          bg-slate-950/5
          p-4
        "
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">
              {author}
            </p>

            <p className="text-xs text-muted-foreground">
              {question.isAnswered
                ? "Respondida"
                : "Pendente"}
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            {new Date(
              question.createdAt
            ).toLocaleDateString()}
          </div>
        </div>

        <p className="mt-3 font-medium">
          {question.message}
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          {question.answer
            ? `Resposta: ${question.answer}`
            : "Aguardando resposta"}
        </p>
      </div>
    )
  }

  if (loading || !course) {
    return (
      <AppSidebarBody
        appSidebarTitle="CampusFlow - Curso"
        appSidebarLucideIcon={
          BookOpen
        }
        appSidebarBodyStyle="flex-col"
      >
        <div className="mt-8 xl:max-w-[90%]! w-full space-y-6">
          <Skeleton className="h-10 w-72" />

          <Skeleton className="h-72 w-full rounded-3xl" />

          <Skeleton className="h-48 w-full rounded-3xl" />

          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </AppSidebarBody>
    )
  }

  return (
    <AppSidebarBody
      appSidebarTitle="CampusFlow - Curso"
      appSidebarLucideIcon={
        BookOpen
      }
      appSidebarBodyStyle="flex-col"
    >
      <div className="mt-8 xl:max-w-[90%]! w-full space-y-8">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

          <div className="space-y-4">

            <Button
              variant="secondary"
              size="sm"
              className="cursor-pointer"
              onClick={() =>
                navigate(-1)
              }
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold">
                {course.title}
              </h1>

              <p className="text-sm text-muted-foreground">
                {course.shortDescription}
              </p>
            </div>

          </div>

          <div className="flex flex-col gap-3">

            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span>
                {course.level}
              </span>

              <span>•</span>

              <span>
                {course.category ||
                  "Sem categoria"}
              </span>
            </div>

            <div className="flex gap-2 flex-wrap">

              <Button
                onClick={
                  isEnrolled
                    ? handleUnenroll
                    : handleEnroll
                }
                disabled={
                  actionLoading ||
                  !userId
                }
                className="cursor-pointer"
              >
                {isEnrolled
                  ? "Desistir do curso"
                  : "Matricular-se"}
              </Button>

              <span className="inline-flex items-center rounded-full bg-slate-950/5 px-3 py-1 text-xs text-muted-foreground">
                {isEnrolled
                  ? "Matriculado"
                  : "Não matriculado"}
              </span>

            </div>

          </div>

        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">

          <div className="space-y-4">

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950/5">

              <img
                src={resolveMediaUrl(course.banner || course.thumbnail)}
                alt={course.title}
                className="h-72 w-full object-cover"
              />

            </div>

            <AppSidebarCard cardTitle="Detalhes do curso">

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-md bg-slate-950/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    Professor
                  </p>

                  <p className="text-base font-semibold">
                    {getTeacherName()}
                  </p>
                </div>

                <div className="rounded-md bg-slate-950/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    Progressão do usuário
                  </p>

                  <p className="text-base font-semibold">
                    {progress
                      ? `${progress.percentage}%`
                      : "—"}
                  </p>
                </div>

                <div className="rounded-md bg-slate-950/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    Alunos
                  </p>

                  <p className="text-base font-semibold">
                    {course.totalStudents}
                  </p>
                </div>

                <div className="rounded-md bg-slate-950/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    Avaliação média
                  </p>

                  <p className="text-base font-semibold">
                    {courseRating()}/5
                  </p>
                </div>

              </div>

            </AppSidebarCard>

            <AppSidebarCard cardTitle="Sobre o curso">

              <p className="text-sm leading-7 text-muted-foreground">
                {course.fullDescription ||
                  "Nenhuma descrição completa disponível."}
              </p>

            </AppSidebarCard>

            <AppSidebarCard
              cardTitle="Módulos"
              cardDescription={`${course.modules.length} módulos disponíveis`}
            >

              <div className="space-y-4">

                {course.modules.length ? (
                  course.modules.map(
                    (
                      module,
                      moduleIndex
                    ) => (
                      <div
                        key={
                          moduleIndex
                        }
                        className="
                          rounded-2xl
                          border
                          border-slate-200
                          bg-slate-950/5
                          p-4
                        "
                      >

                        <div className="flex items-center justify-between gap-4">

                          <div>
                            <h3 className="text-lg font-semibold">
                              {
                                module.title
                              }
                            </h3>

                            <p className="text-sm text-muted-foreground">
                              {module.description ||
                                "Sem descrição do módulo."}
                            </p>
                          </div>

                          <span className="text-xs uppercase text-muted-foreground">
                            {getModuleStatus(
                              moduleIndex
                            )}
                          </span>

                        </div>

                        <div className="mt-4 space-y-2">

                          {module.videos.map(
                            (
                              video,
                              videoIndex
                            ) => {
                              const completed =
                                progress?.completedVideos.includes(
                                  video.title
                                )

                              return (
                                <div
                                  key={
                                    videoIndex
                                  }
                                  className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white/5
                                    p-3
                                  "
                                >

                                  <div className="flex items-center justify-between gap-3">

                                    <div>
                                      <p className="font-medium">
                                        {
                                          video.title
                                        }
                                      </p>

                                      <p className="text-xs text-muted-foreground">
                                        {
                                          video.durationInMinutes
                                        }
                                        {" "}
                                        min
                                      </p>
                                    </div>

                                    <span
                                      className={`
                                        rounded-full
                                        px-2
                                        py-1
                                        text-[11px]
                                        ${
                                          completed
                                            ? "bg-emerald-500/10 text-emerald-300"
                                            : "bg-slate-950/10 text-muted-foreground"
                                        }
                                      `}
                                    >
                                      {completed
                                        ? "Concluído"
                                        : "Pendente"}
                                    </span>

                                  </div>

                                </div>
                              )
                            }
                          )}

                        </div>

                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhum módulo cadastrado ainda.
                  </p>
                )}

              </div>

            </AppSidebarCard>

          </div>

          <div className="space-y-4">

            <AppSidebarCard cardTitle="Resumo rápido">

              <div className="space-y-3">

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />

                  <span>
                    {
                      course.totalStudents
                    }
                    {" "}
                    alunos
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Layers className="h-4 w-4" />

                  <span>
                    {
                      course.totalModules
                    }
                    {" "}
                    módulos •
                    {" "}
                    {
                      course.totalVideos
                    }
                    {" "}
                    vídeos
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Video className="h-4 w-4" />

                  <span>
                    {
                      course.totalHours
                    }
                    {" "}
                    horas
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4" />

                  <span>
                    {courseRating()}
                    /5 em
                    {" "}
                    {
                      course.reviews
                        .length
                    }
                    {" "}
                    avaliações
                  </span>
                </div>

              </div>

            </AppSidebarCard>

            <AppSidebarCard
              cardTitle="Lives"
              cardDescription={`${course.lives.length} disponíveis`}
            >

              <div className="space-y-4">

                {course.lives.length ? (
                  course.lives.map(
                    (
                      live,
                      index
                    ) => {
                      const status =
                        getLiveStatus(
                          live
                        )

                      return (
                        <div
                          key={index}
                          className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-slate-950/5
                            p-4
                          "
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">

                              <h3 className="text-base font-semibold truncate">
                                {
                                  live.title
                                }
                              </h3>

                              <p className="text-xs text-muted-foreground mt-1">
                                {formatLiveDate(
                                  live.scheduledDate
                                )}
                                {" • "}
                                {formatLiveTime(
                                  live.scheduledDate
                                )}
                              </p>

                            </div>

                            <span
                              className={`
                                rounded-full
                                px-3
                                py-1
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.2em]
                                ${getLiveStatusClass(
                                  status
                                )}
                              `}
                            >
                              {getLiveStatusLabel(
                                status
                              )}
                            </span>

                          </div>

                          <p className="mt-3 text-sm text-muted-foreground">
                            {live.description ||
                              "Sem descrição da live."}
                          </p>

                          {live.liveUrl ? (
                            <a
                              href={
                                live.liveUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="
                                mt-4
                                inline-flex
                                items-center
                                rounded-full
                                bg-slate-950/25
                                px-3
                                py-2
                                text-sm
                                font-medium
                                text-slate-900
                                transition
                                hover:bg-slate-100
                              "
                            >
                              Acessar transmissão
                            </a>
                          ) : null}

                        </div>
                      )
                    }
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma live programada para este curso.
                  </p>
                )}

              </div>

            </AppSidebarCard>

            <AppSidebarCard
              cardTitle="Dúvidas"
              cardDescription={`${course.questions.length} perguntas`}
            >

              <div className="space-y-3">

                {course.questions.length ? (
                  course.questions.map(
                    renderQuestion
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Ainda não há dúvidas neste curso.
                  </p>
                )}

              </div>

            </AppSidebarCard>

            <AppSidebarCard
              cardTitle="Avaliações"
              cardDescription={`${course.reviews.length} avaliações`}
            >

              <div className="space-y-3">

                {course.reviews.length ? (
                  course.reviews.map(
                    renderReview
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma avaliação registrada ainda.
                  </p>
                )}

              </div>

            </AppSidebarCard>

          </div>

        </div>

      </div>
    </AppSidebarBody>
  )
}