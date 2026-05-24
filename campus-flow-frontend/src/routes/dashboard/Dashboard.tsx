/* eslint-disable react-hooks/set-state-in-effect */
import { AppSidebarBody } from "@/core/components/body/AppSidebarBody"
import { AppSidebarCard } from "@/core/components/cards/AppSidebarCard"
import { decodeToken } from "@/core/lib/utils/tokenValidation"
import { LayoutDashboardIcon } from "lucide-react"
import { useState, useEffect } from "react"

export const Dashboard = () => {
    const [username, setUsername] = useState<string | null>(null)

    useEffect(() => {
      const token = localStorage.getItem("token")
      if (!token) return

      const decoded = decodeToken(token)
      if (!decoded) return

      setUsername(decoded.username)
    }, [])

    return (
        <AppSidebarBody appSidebarTitle="CampusFlow - Dashboard" appSidebarLucideIcon={LayoutDashboardIcon} appSidebarBodyStyle="flex-col">
            <div className="mt-8 xl:max-w-[90%]! h-auto w-full justify-center items-center align-middle">
                <div className="space-y-0.5">
                    <div className="flex flex-row">
                        <h1 className="text-2xl leading-none font-medium">Bem vindo de volta, {username} 👋</h1>
                        {/* <Button onClick={getInsights} disabled={loadingInisghts} className="flex ml-auto cursor-pointer">
                          {loadingInisghts ? 'Gerando insights…' : 'Gerar insights de IA'}
                        </Button> */}
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Resumo dos seus dados dentro da plataforma
                    </p>
                </div>
            </div>

            <div className="mt-8 xl:max-w-[90%]! h-auto w-full justify-center items-center align-middle">
                <AppSidebarCard cardTitle="Análise de desempenho">
                    <div className="flex justify-start items-center">
                        <div className="grid-cols-[repeat(1,1fr)] grid gap-2">
                            <p>Cursos concluídos: -</p>
                            <p>Simulados concluídos: -</p>
                            <p>Média geral: -</p>
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

                    <div className='gap-4 grid-cols-[repeat(2,1fr)] grid mt-8 xl:max-w-[90%]! h-auto w-full justify-center items-center align-middle'>
                        <AppSidebarCard cardTitle="Curso de Javascript" cardStyle="w-full backdrop-blur-lg bg-blue-600/10">
                            <p>do balacobaco</p>
                        </AppSidebarCard>
                        <AppSidebarCard cardTitle="Curso de Javascript" cardStyle="w-full backdrop-blur-lg bg-blue-600/10">
                            <p>do balacobaco</p>
                        </AppSidebarCard>
                        <AppSidebarCard cardTitle="Curso de Javascript" cardStyle="w-full backdrop-blur-lg bg-blue-600/10">
                            <p>do balacobaco</p>
                        </AppSidebarCard>
                        <AppSidebarCard cardTitle="Curso de Javascript" cardStyle="w-full backdrop-blur-lg bg-blue-600/10">
                            <p>do balacobaco</p>
                        </AppSidebarCard>
                    </div>
                </div>

                <div className="flex flex-col h-auto w-full justify-center items-center align-middle">
                    <div className="mt-8 xl:max-w-[90%]! h-auto w-full justify-center items-center align-middle">
                        <div className="space-y-0.5">
                            <div className="flex flex-row">
                                <h2 className="text-2xl leading-none font-medium">Em destaque 🔥</h2>
                            </div>
                        </div>
                    </div>

                    <div className='gap-4 grid-cols-[repeat(2,1fr)] grid mt-8 xl:max-w-[90%]! h-auto w-full justify-center items-center align-middle'>
                        <AppSidebarCard cardTitle="Curso de React" cardDescription="8 Módulos" cardStyle="w-full backdrop-blur-lg bg-orange-600/10">
                            <p>do balacobaco</p>
                        </AppSidebarCard>
                        <AppSidebarCard cardTitle="Curso de Typescript" cardDescription="8 Módulos" cardStyle="w-full backdrop-blur-lg bg-orange-600/10">
                            <p>do balacobaco</p>
                        </AppSidebarCard>
                        <AppSidebarCard cardTitle="Curso de MySQL" cardDescription="8 Módulos" cardStyle="w-full backdrop-blur-lg bg-orange-600/10">
                            <p>do balacobaco</p>
                        </AppSidebarCard>
                        <AppSidebarCard cardTitle="Curso de Tailwind" cardDescription="8 Módulos" cardStyle="w-full backdrop-blur-lg bg-orange-600/10">
                            <p>do balacobaco</p>
                        </AppSidebarCard>
                    </div>
                </div>
            </div>


        </AppSidebarBody>
    )
}