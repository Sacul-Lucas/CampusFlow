import { AppSidebarBody } from "@/core/components/body/AppSidebarBody"
import { AppSidebarCard } from "@/core/components/cards/AppSidebarCard";
import { ThemeDropdown } from "@/core/components/dropdown/ThemeDropdown"
import { Settings } from "lucide-react";

export const SettingsPage = () => {
    return (
        <AppSidebarBody appSidebarTitle="AtmosInsight - Configurações" appSidebarLucideIcon={Settings} appSidebarBodyStyle="flex-col">
            <div className="mt-8 xl:max-w-[90%]! h-fit w-full flex justify-center align-middle">
                <AppSidebarCard cardTitle="Configurações" cardDescription="Ajuste as opções conforme suas preferências" cardAction={<ThemeDropdown />}>
                    {null}
                </AppSidebarCard>
            </div>
        </AppSidebarBody>
    )
}