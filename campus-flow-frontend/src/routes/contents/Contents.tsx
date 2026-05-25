/* eslint-disable react-hooks/set-state-in-effect */
import { GetCoursesAction } from "@/core/actions/GetCoursesAction"
import { AppSidebarBody } from "@/core/components/body/AppSidebarBody"
import { AppSidebarCard } from "@/core/components/cards/AppSidebarCard"
import { Button } from "@/core/components/shadcnComponents/ui/button"
import { Field } from "@/core/components/shadcnComponents/ui/field"
import { Input } from "@/core/components/shadcnComponents/ui/input"
import type { Course } from "@/core/lib/types/Course"
import { GraduationCap, FilterIcon, SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const Contents = () => {
    const navigate = useNavigate()
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")

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

    useEffect(() => {
        console.log(courses)
    }, [courses])

    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <AppSidebarBody
          appSidebarTitle="CampusFlow - Conteúdos"
          appSidebarLucideIcon={GraduationCap}
          appSidebarBodyStyle="flex-col"
        >
            <div className="mt-8 xl:max-w-[90%]! h-auto w-full">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <Field>
                        <div className="relative w-full">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                            <Input
                                type="text"
                                placeholder="Pesquisar cursos"
                                className="pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </Field>

                    <Button type="button" className="cursor-pointer">
                        <FilterIcon />
                    </Button>
                </div>
            </div>

            <div className="mt-8 xl:max-w-[90%]! w-full">
                <h2 className="text-2xl font-medium">
                    Cursos disponíveis
                </h2>
            </div>

            {courses.length === 0 ?
                <div className="mt-16 xl:max-w-[90%]! w-full flex justify-center items-center">
                    <p className="font-medium text-muted-foreground">Sem cursos disponíveis</p>
                </div> 
            :
            <></>}

            <div className="gap-4 grid grid-cols-4 mt-8 xl:max-w-[90%]! w-full">
                {loading ? 
                    Array.from({ length: 4 }).map((_, i) => (
                      <AppSidebarCard
                        key={i}
                        cardTitle="Carregando..."
                        cardStyle="w-full backdrop-blur-lg bg-blue-600/10 max-h-[50dvh]"
                      >
                        <p>Carregando...</p>
                      </AppSidebarCard>
                    ))
                : 
                    filteredCourses.map((course) => (
                        <div
                          key={course._id}
                          className="cursor-pointer"
                          onClick={() => navigate(`/Course/${course._id}`)}
                        >
                            <AppSidebarCard
                                cardTitle={course.title}
                                cardStyle="w-full backdrop-blur-lg bg-blue-600/10 max-h-[50dvh] transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
                                cardDescription={`${course.totalStudents} alunos • ${course.totalVideos} vídeos`}
                            >
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-32 object-cover rounded-md mb-3"
                                />
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        {course.shortDescription || "Sem descrição"}
                                    </p>

                                    <div className="flex gap-3 text-xs text-muted-foreground">
                                        <span>{course.totalModules} módulos</span>
                                    </div>
                                </div>
                            </AppSidebarCard>
                        </div>
                    ))
                }
            </div>
        </AppSidebarBody>
    )
}