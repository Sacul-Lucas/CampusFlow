import { AppSidebarBody } from "@/core/components/body/AppSidebarBody"
import { AppSidebarCard } from "@/core/components/cards/AppSidebarCard"
import { Button } from "@/core/components/shadcnComponents/ui/button"
import { Field } from "@/core/components/shadcnComponents/ui/field"
import { Input } from "@/core/components/shadcnComponents/ui/input"
import { GraduationCap, FilterIcon, SearchIcon } from "lucide-react"

export const Contents = () => {
    return (
        <AppSidebarBody appSidebarTitle="CampusFlow - Conteúdos" appSidebarLucideIcon={GraduationCap} appSidebarBodyStyle="flex-col">
            <div className="mt-8 xl:max-w-[90%]! h-auto w-full justify-center items-center align-middle">
                <div className="space-y-0.5">
                    <div className="flex flex-row gap-2 justify-center items-center">
                        <Field>
                            <div className="relative w-full">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                                <Input
                                    id="input-demo-api-key"
                                    type="text"
                                    placeholder="Pesquisar cursos"
                                    className="pl-10"
                                />
                            </div>
                        </Field>

                        <Button
                            type="button"
                            className="cursor-pointer"
                        >
                            <FilterIcon />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 h-auto w-full justify-center items-center align-middle">
                <div className="flex flex-col h-auto w-full justify-center items-center align-middle">
                    <div className="mt-8 xl:max-w-[90%]! h-auto w-full justify-center items-center align-middle">
                        <div className="space-y-0.5">
                            <div className="flex flex-row">
                                <h2 className="text-2xl leading-none font-medium">Cursos disponíveis</h2>
                            </div>
                        </div>
                    </div>

                    <div className='gap-4 grid-cols-[repeat(4,1fr)] grid mt-8 xl:max-w-[90%]! h-auto w-full justify-center items-center align-middle'>
                        <AppSidebarCard cardTitle="Curso de Javascript" cardStyle="w-full backdrop-blur-lg bg-blue-600/10 max-w-full max-h-[50dvh]">
                            <p>do balacobaco</p>
                        </AppSidebarCard>
                        <AppSidebarCard cardTitle="Curso de Javascript" cardStyle="w-full backdrop-blur-lg bg-blue-600/10 max-w-full max-h-[50dvh]">
                            <p>do balacobaco</p>
                        </AppSidebarCard>
                        <AppSidebarCard cardTitle="Curso de Javascript" cardStyle="w-full backdrop-blur-lg bg-blue-600/10 max-w-full max-h-[50dvh]">
                            <p>do balacobaco</p>
                        </AppSidebarCard>
                        <AppSidebarCard cardTitle="Curso de Javascript" cardStyle="w-full backdrop-blur-lg bg-blue-600/10 max-w-full max-h-[50dvh]">
                            <p>do balacobaco</p>
                        </AppSidebarCard>
                    </div>
                </div>
            </div>
        </AppSidebarBody>
    )
}