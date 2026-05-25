/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import { AppSidebarBody } from "@/core/components/body/AppSidebarBody"
import { AppSidebarCard } from "@/core/components/cards/AppSidebarCard"
import { GetEnrolledCoursesAction } from "@/core/actions/GetEnrolledCoursesAction"
import { GetFeaturedCoursesAction } from "@/core/actions/GetFeaturedCoursesAction"
import type { Course } from "@/core/lib/types/Course"
import { decodeToken } from "@/core/lib/utils/tokenValidation"
import { LayoutDashboardIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const Dashboard = () => {
    const [username, setUsername] = useState<string | null>(null)
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
    const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      const token = localStorage.getItem("token")
      if (!token) return

      const decoded = decodeToken(token)
      if (!decoded) return

      setUsername(decoded.username)
    }, [])

    useEffect(() => {
      void fetchDashboardCourses()
    }, [])

    const fetchDashboardCourses = async () => {
      setLoading(true)

      const [enrolledResponse, featuredResponse] = await Promise.all([
        GetEnrolledCoursesAction.execute(),
        GetFeaturedCoursesAction.execute(),
      ])

      if (enrolledResponse.status === "SUCCESS") {
        setEnrolledCourses(enrolledResponse.data)
      } else {
        toast.error(enrolledResponse.data, {
          className: "!bg-red-700 !border-red-800 !text-white",
        })
      }

      if (featuredResponse.status === "SUCCESS") {
        setFeaturedCourses(featuredResponse.data)
      } else {
        toast.error(featuredResponse.data, {
          className: "!bg-red-700 !border-red-800 !text-white",
        })
      }

      setLoading(false)
    }

    const averageProgress =
      enrolledCourses.length > 0
        ? Math.round(
            enrolledCourses.reduce(
              (sum, course) => sum + (course.progressPercent ?? 0),
              0,
            ) / enrolledCourses.length,
          )
        : 0

    const navigate = useNavigate()

    return (
        <AppSidebarBody appSidebarTitle="CampusFlow - Dashboard" appSidebarLucideIcon={LayoutDashboardIcon} appSidebarBodyStyle="flex-col">
            <div className="mt-8 xl:max-w-[90%]! h-auto w-full justify-center items-center align-middle">
                <div className="space-y-0.5">
                    <div className="flex flex-row">
                        <h1 className="text-2xl leading-none font-medium">Bem vindo de volta, {username} 👋</h1>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Resumo dos seus dados dentro da plataforma
                    </p>
                </div>
            </div>

            <div className="mt-8 xl:max-w-[90%]! h-auto w-full justify-center items-center align-middle">
                <AppSidebarCard cardTitle="Análise de desempenho">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-md bg-slate-950/5 p-4">
                            <p className="text-sm text-muted-foreground">Cursos matriculados</p>
                            <p className="text-2xl font-semibold">{enrolledCourses.length}</p>
                        </div>
                        <div className="rounded-md bg-slate-950/5 p-4">
                            <p className="text-sm text-muted-foreground">Progresso médio</p>
                            <p className="text-2xl font-semibold">{averageProgress}%</p>
                        </div>
                        <div className="rounded-md bg-slate-950/5 p-4">
                            <p className="text-sm text-muted-foreground">Cursos em destaque</p>
                            <p className="text-2xl font-semibold">{featuredCourses.length}</p>
                        </div>
                    </div>
                </AppSidebarCard>
            </div>

            <div className="flex flex-col gap-4 h-auto w-full justify-center items-center align-middle">
                <div className="flex flex-col h-auto w-full justify-center items-center align-middle">
                    <div className="mt-8 xl:max-w-[90%]! h-auto w-full justify-center items-center align-middle">
                        <div className="space-y-0.5">
                            <div className="flex flex-row">
                                <h2 className="text-2xl leading-none font-medium">Em andamento</h2>
                            </div>
                        </div>
                    </div>

                    {enrolledCourses.length === 0 && !loading ? (
                      <div className="mt-6 xl:max-w-[90%]! w-full">
                        <AppSidebarCard cardTitle="Nenhum curso matriculado">
                          <p>Você ainda não está matriculado em nenhum curso.</p>
                        </AppSidebarCard>
                      </div>
                    ) : (
                      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-8 xl:max-w-[90%]! w-full">
                        {loading ?
                          Array.from({ length: 2 }).map((_, i) => (
                            <AppSidebarCard
                              key={i}
                              cardTitle="Carregando..."
                              cardStyle="w-full backdrop-blur-lg bg-blue-600/10 max-h-[50dvh]"
                            >
                              <p>Carregando...</p>
                            </AppSidebarCard>
                          )) :
                          enrolledCourses.map((course) => (
                            <div
                              key={course._id}
                              className="cursor-pointer"
                              onClick={() => navigate(`/Course/${course._id}`)}
                            >
                              <AppSidebarCard
                                cardTitle={course.title}
                                cardDescription={`${course.totalModules} módulos • ${course.totalVideos} vídeos`}
                                cardStyle="w-full backdrop-blur-lg bg-blue-600/10 transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
                              >
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-32 object-cover rounded-md mb-3"
                              />
                              <div className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                  {course.shortDescription || "Sem descrição"}
                                </p>
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Progresso</span>
                                    <span>{course.progressPercent ?? 0}%</span>
                                  </div>
                                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                    <div
                                      className="h-full rounded-full bg-emerald-500"
                                      style={{ width: `${course.progressPercent ?? 0}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-3 text-xs text-muted-foreground">
                                  <span>{course.totalStudents} alunos</span>
                                  <span>{course.totalHours}h</span>
                                </div>
                              </div>
                            </AppSidebarCard>
                          </div>
                          ))
                        }
                      </div>
                    )}
                </div>

                <div className="flex flex-col h-auto w-full justify-center items-center align-middle">
                    <div className="mt-8 xl:max-w-[90%]! h-auto w-full justify-center items-center align-middle">
                        <div className="space-y-0.5">
                            <div className="flex flex-row">
                                <h2 className="text-2xl leading-none font-medium">Cursos em destaque 🔥</h2>
                            </div>
                        </div>
                    </div>

                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-8 xl:max-w-[90%]! w-full">
                        {featuredCourses.map((course) => (
                            <div
                              key={course._id}
                              className="cursor-pointer"
                              onClick={() => navigate(`/Course/${course._id}`)}
                            >
                              <AppSidebarCard
                                cardTitle={course.title}
                                cardDescription={`${course.totalStudents} alunos • ${course.totalVideos} vídeos`}
                                cardStyle="w-full backdrop-blur-lg bg-orange-600/10 transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/20"
                              >
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-32 object-cover rounded-md mb-3"
                                />
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        {course.shortDescription || "Sem descrição"}
                                    </p>
                                    <div className="flex gap-3 text-xs text-muted-foreground">
                                        <span>{course.totalModules} módulos</span>
                                    </div>
                                </div>
                            </AppSidebarCard>
                        </div>
                        ))}
                    </div>
                </div>
            </div>


        </AppSidebarBody>
    )
}