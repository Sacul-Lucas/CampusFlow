import { 
    ChevronUp, 
    Home, 
    Settings, 
    User2, 
    LayoutDashboardIcon, 
    Shield, 
    Play, 
    GraduationCap, 
    Radio,
    // BookOpen, 
    // BadgeQuestionMark, 
    // AwardIcon 
} from "lucide-react"
import { useAuth } from "@/core/lib/utils/useAuth";
import { Toaster } from "sonner";
import { 
    Sidebar, 
    SidebarContent, 
    SidebarGroup, 
    SidebarGroupLabel, 
    SidebarGroupContent, 
    SidebarMenu, 
    SidebarMenuItem, 
    SidebarMenuButton, 
    SidebarFooter 
} from "../shadcnComponents/ui/sidebar";
import { DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuItem 
} from "../shadcnComponents/ui/dropdown-menu";
import campusFlowLogo from "@/assets/img/CampusFlowLogo.png"

const items = [
    {
        title: "Página principal",
        url: "/CampusFlow",
        icon: Home,
    },
    {
        title: "Dashboard",
        url: "/CampusFlow/Dashboard",
        icon: LayoutDashboardIcon,
    },
    {
        title: "Conteúdos",
        url: "/CampusFlow/Contents",
        icon: GraduationCap,
    },
    {
        title: "Vídeos curtos",
        url: "/CampusFlow/ShortVideos",
        icon: Play,
    },
    {
        title: "Aulas ao vivo",
        url: "/CampusFlow/Live",
        icon: Radio,
    },
    // {
    //     title: "Simulados",
    //     url: "/CampusFlow/MockExams",
    //     icon: BookOpen,
    // },
    // {
    //     title: "Fórum de dúvidas",
    //     url: "/CampusFlow/Questions",
    //     icon: BadgeQuestionMark,
    // },
    // {
    //     title: "Certificados",
    //     url: "/CampusFlow/Certifications",
    //     icon: AwardIcon,
    // },
    {
        title: "Administração",
        url: "/CampusFlow/Administration",
        icon: Shield,
        roles: ["admin"]
    },
    {
        title: "Configurações",
        url: "/CampusFlow/Settings",
        icon: Settings,
    },
]

export function AppSidebar() {
  const { role, username, logout } = useAuth()

  return (
    <Sidebar collapsible="icon">
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel className="h-[15dvh]">
                    <div className="flex flex-col gap-4">
                        <img
                          className="w-full"
                          src={campusFlowLogo}
                        />
                        CampusFlow
                    </div>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items
                        .filter(item => !item.roles || item.roles.includes(role!))
                        .map((item) => (
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton asChild {...(location.pathname === item.url ? { isActive: true } : {})}>
                                <a href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton className="cursor-pointer">
                            <User2 /> {username}
                            <ChevronUp className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="top"
                            className="w-[--radix-popper-anchor-width]"
                        >
                        <DropdownMenuItem className="cursor-pointer">
                            <span>Conta</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <span>Histórico</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={logout} className="cursor-pointer">
                            Sair
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>

        <Toaster position="bottom-left"/>
    </Sidebar>
  )
}