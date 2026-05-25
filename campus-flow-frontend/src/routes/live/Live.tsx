/* eslint-disable react-hooks/set-state-in-effect */
import { AppSidebarBody } from '@/core/components/body/AppSidebarBody'
import { AppSidebarCard } from '@/core/components/cards/AppSidebarCard'
import { GetLivesAction } from '@/core/actions/GetLivesAction'
import type { LiveItem } from '@/core/actions/GetLivesAction'
import { Button } from '@/core/components/shadcnComponents/ui/button'
import { Field } from '@/core/components/shadcnComponents/ui/field'
import { Input } from '@/core/components/shadcnComponents/ui/input'
import { Radio, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const statusLabels: Record<LiveItem['status'], string> = {
  scheduled: 'Agendada',
  live: 'Ao vivo',
  finished: 'Finalizada',
}

const statusClasses: Record<LiveItem['status'], string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  live: 'bg-emerald-100 text-emerald-700',
  finished: 'bg-slate-100 text-slate-900',
}

export const Live = () => {
  const navigate = useNavigate()
  const [lives, setLives] = useState<LiveItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    void fetchLives()
  }, [])

  const fetchLives = async () => {
    setLoading(true)
    const response = await GetLivesAction.execute()

    if (response.status === 'SUCCESS') {
      setLives(response.data)
    } else {
      toast.error(response.data, {
        className: '!bg-red-700 !border-red-800 !text-white',
      })
    }

    setLoading(false)
  }

  const filteredLives = lives.filter((live) =>
    `${live.title} ${live.courseTitle}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  return (
    <AppSidebarBody
      appSidebarTitle="CampusFlow - Lives"
      appSidebarLucideIcon={Radio}
      appSidebarBodyStyle="flex-col"
    >
      <div className="mt-8 xl:max-w-[90%]! h-auto w-full">
        <div className="flex flex-row gap-2 items-center justify-center">
          <Field>
            <div className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Pesquisar lives"
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </Field>
          <Button type="button" className="cursor-pointer">
            Filtrar
          </Button>
        </div>
      </div>

      <div className="mt-8 xl:max-w-[90%]! w-full">
        <h2 className="text-2xl font-medium">Aulas ao vivo disponíveis</h2>
      </div>

      {lives.length === 0 && !loading ? (
        <div className="mt-16 xl:max-w-[90%]! w-full flex justify-center items-center">
          <p className="font-medium text-muted-foreground">Nenhuma live encontrada</p>
        </div>
      ) : null}

      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-8 xl:max-w-[90%]! w-full">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <AppSidebarCard
                key={i}
                cardTitle="Carregando..."
                cardStyle="w-full backdrop-blur-lg bg-blue-600/10 max-h-[50dvh]"
              >
                <p>Carregando...</p>
              </AppSidebarCard>
            ))
          : filteredLives.map((live) => {
              const scheduledDate = new Date(live.scheduledDate)
              const dateLabel = scheduledDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
              const timeLabel = scheduledDate.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })

              return (
                <div
                  key={live._id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/Course/${live.courseId}`)}
                >
                  <AppSidebarCard
                    cardTitle={live.title}
                    cardDescription={`${live.courseTitle} • ${dateLabel}`}
                    cardStyle="w-full backdrop-blur-lg bg-blue-600/10 transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <img
                      src={live.thumbnail ?? live.banner}
                      alt={live.title}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-muted-foreground">{live.courseTitle}</span>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${statusClasses[live.status]}`}
                        >
                          {statusLabels[live.status]}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{live.description}</p>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <span>{dateLabel}</span>
                        <span>{timeLabel}</span>
                      </div>
                    </div>
                  </AppSidebarCard>
                </div>
              )
            })}
      </div>
    </AppSidebarBody>
  )
}
