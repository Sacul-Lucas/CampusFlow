import { AppSidebarBody } from "@/core/components/body/AppSidebarBody"
import { useAuth } from "@/core/lib/utils/useAuth"
import { LayoutDashboardIcon } from "lucide-react"

export const Dashboard = () => {
    const { username } = useAuth()

    return (
        <AppSidebarBody appSidebarTitle="CampusFlow - Dashboard" appSidebarLucideIcon={LayoutDashboardIcon}>
            <h1>Bem vindo de volta, {username} 👋</h1>

            
        </AppSidebarBody>
    )
}