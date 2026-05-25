"use client"

import { useState } from "react"
import { ShieldIcon, UsersIcon, BookOpenIcon, LayersIcon } from "lucide-react"
import { AppSidebarBody } from "@/core/components/body/AppSidebarBody"
import { UserAdminTable } from "@/core/components/tables/UserAdminTable"
import { CoursesAdminTable } from "@/core/components/tables/CoursesAdminTable"
import { ModulesAdminTable } from "@/core/components/tables/ModulesAdminTable"

type AdminTab =
  | "users"
  | "courses"
  | "modules"
  | "settings"

export const Administration = () => {
  const [activeTab, setActiveTab] =
    useState<AdminTab>("users")

  return (
    <AppSidebarBody
      appSidebarTitle="AtmosInsight - Administração"
      appSidebarLucideIcon={ShieldIcon}
      appSidebarBodyStyle="flex-col"
    >
      {/* NAVBAR */}

      <div className="mt-8 w-full xl:max-w-[85%]">

        <div
          className="
            flex
            flex-row
            items-center
            gap-2
            rounded-xl
            border
            bg-background/40
            p-2
            backdrop-blur-lg
          "
        >

          {/* USERS */}

          <button
            onClick={() => setActiveTab("users")}
            className={
              `
              flex
              items-center
              gap-2
              rounded-lg
              px-4
              py-2
              text-sm
              transition-all
              cursor-pointer
              ${              activeTab === "users"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"}
              `

            }
          >
            <UsersIcon className="h-4 w-4" />
            Usuários
          </button>

          {/* COURSES */}

          <button
            onClick={() => setActiveTab("courses")}
            className={
              `
              flex
              items-center
              gap-2
              rounded-lg
              px-4
              py-2
              text-sm
              transition-all
              cursor-pointer
              ${              activeTab === "courses"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"}
              `

            }
          >
            <BookOpenIcon className="h-4 w-4" />
            Cursos
          </button>

          <button
            onClick={() => setActiveTab("modules")}
            className={
              `
              flex
              items-center
              gap-2
              rounded-lg
              px-4
              py-2
              text-sm
              transition-all
              cursor-pointer
              ${              activeTab === "modules"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"}
              `

            }
          >
            <LayersIcon className="h-4 w-4" />
            Módulos
          </button>

        </div>
      </div>

      {/* CONTENT */}

      <div className="mt-6 w-full xl:max-w-[85%]">

        {activeTab === "users" && (
          <UserAdminTable />
        )}

        {activeTab === "courses" && (
          <div>
            <CoursesAdminTable />
          </div>
        )}

        {activeTab === "modules" && (
          <div>
            <ModulesAdminTable />
          </div>
        )}

      </div>

    </AppSidebarBody>
  )
}