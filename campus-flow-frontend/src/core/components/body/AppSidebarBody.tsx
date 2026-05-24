import type { ComponentType, ReactNode } from "react"
import { SidebarProvider, SidebarTrigger } from "@/core/components/shadcnComponents/ui/sidebar"
import { AppSidebar } from "@/core/components/layouts/AppSidebarLayout"
import { DefineApp } from "../utils/DefineApp"
import { AuthProvider } from "../providers/AuthProvider"
import type { LucideProps } from "lucide-react"

interface bodyProps {
    appSidebarTitle: string
    appSidebarIcon?: string
    appSidebarBodyStyle?: string
    appSidebarLucideIcon?: ComponentType<LucideProps>
    children: ReactNode
}

export const AppSidebarBody: React.FC<bodyProps> = ({
    appSidebarTitle,
    appSidebarIcon,
    appSidebarBodyStyle,
    appSidebarLucideIcon: LucideIcon,
    children
}) => {
    return (
        <DefineApp appTitle={appSidebarTitle} appIcon={appSidebarIcon} lucideIcon={LucideIcon}>
            <AuthProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <div className="h-fit">
                        <SidebarTrigger className="cursor-pointer"/>
                    </div>
                    <main className={`flex items-center w-full ${appSidebarBodyStyle}`}>
                        {children}
                    </main>
                </SidebarProvider>
            </AuthProvider>
        </DefineApp>
    )
}