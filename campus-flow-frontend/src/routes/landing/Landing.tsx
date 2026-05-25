import { Button } from "@/core/components/shadcnComponents/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/core/components/shadcnComponents/ui/context-menu"

import {
  Camera,
  GraduationCap,
  MessageCircle,
  PlayCircle,
  Menu,
  X,
  GraduationCapIcon
} from "lucide-react"

import { LiquidMetal } from '@paper-design/shaders-react';

import { useState } from "react"

import campusFlowLogo from '@/assets/img/CampusFlowLogo.png'
import student from '@/assets/img/estudante.png'
import mockup from '@/assets/img/mockup-celular.png'
import { DefineApp } from "@/core/components/utils/DefineApp";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const isLogged = localStorage.getItem('token') !== null

  const features = [
    {
      icon: GraduationCap,
      title: "Trilhas de Conteúdo",
      description:
        "Aprenda com uma sequência perfeitamente estruturada direto ao ponto, do básico até o avançado.",
    },
    {
      icon: Camera,
      title: "Lives com Professores",
      description:
        "Aulas semanais ao vivo para tirar suas dúvidas direto com profissionais renomados do mercado.",
    },
    {
      icon: MessageCircle,
      title: "Fórum de Dúvidas",
      description:
        "Resolva suas questões rapidamente com suporte ativo da nossa comunidade exclusiva.",
    },
    {
      icon: PlayCircle,
      title: "Vídeos Curtos",
      description:
        "Conteúdos compactos e dinâmicos projetados para encaixar perfeitamente na sua rotina diária.",
    },
  ]

  const steps = [
    {
      title: "1. Crie sua conta",
      description:
        "Cadastro rápido e totalmente gratuito. Em menos de 2 minutos você já ganha acesso imediato dentro da plataforma.",
    },
    {
      title: "2. Escolha sua trilha",
      description:
        "Selecione a área exata que você deseja dominar hoje com trilhas organizadas por níveis.",
    },
    {
      title: "3. Estude e participe",
      description:
        "Entre nas aulas ao vivo, assista conteúdos e use o fórum sempre que surgir uma dúvida.",
    },
    {
      title: "4. Acompanhe sua evolução",
      description:
        "Visualize seu progresso em tempo real e evolua com um método estruturado.",
    },
  ]

    return (
        <DefineApp appTitle="CampusFlow" lucideIcon={GraduationCapIcon}>
            <div className="min-h-screen bg-[#001136] text-slate-50 overflow-x-hidden">
              {/* NAVBAR */}
              <header className="sticky top-0 z-50 border-b border-white/5 bg-[#001136]/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
                  <div>
                    <img
                      src={campusFlowLogo}
                      alt="Campus Flow"
                      className="w-35 object-contain lg:w-45"
                    />
                  </div>

                  {/* Desktop Nav */}
                  <nav className="hidden items-center gap-8 lg:flex">
                    <a
                      href="#funcionalidades"
                      className="text-sm text-slate-400 transition-colors hover:text-blue-500"
                    >
                      Funcionalidades
                    </a>

                    <a
                      href="#trilhas"
                      className="text-sm text-slate-400 transition-colors hover:text-blue-500"
                    >
                      Trilhas
                    </a>

                    <a
                      href="#ao-vivo"
                      className="text-sm text-slate-400 transition-colors hover:text-blue-500"
                    >
                      Ao Vivo
                    </a>

                    <a
                      href="#comunidade"
                      className="text-sm text-slate-400 transition-colors hover:text-blue-500"
                    >
                      Comunidade
                    </a>

                    <Button
                      variant="outline"
                      className="rounded-full border-blue-500 bg-transparent text-white hover:bg-blue-600"
                    >
                      Saiba Mais
                    </Button>
                  </nav>

                  {/* Mobile Menu */}
                  <button
                    type="button"
                    className="flex lg:hidden"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                  >
                    {mobileMenuOpen ? (
                      <X className="size-6" />
                    ) : (
                      <Menu className="size-6" />
                    )}
                  </button>
                </div>
                
                {/* MOBILE NAV */}
                {mobileMenuOpen && (
                  <div className="flex flex-col items-center gap-8 border-t border-white/5 bg-[#001136] px-6 py-10 lg:hidden">
                    <a href="#funcionalidades">Funcionalidades</a>
                    <a href="#trilhas">Trilhas</a>
                    <a href="#ao-vivo">Ao Vivo</a>
                    <a href="#comunidade">Comunidade</a>

                    <Button className="rounded-full bg-blue-600 hover:bg-blue-700">
                      Saiba Mais
                    </Button>
                  </div>
                )}
              </header>
            
              {/* HERO */}
              <section className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-14 px-5 py-16 lg:flex-row lg:px-10 lg:py-24">
                <div className="max-w-2xl flex-1 text-center lg:text-left">
                  <h1 className="text-4xl font-bold leading-tight lg:text-6xl">
                    Estudar com propósito.
                    <br />
                    Evoluir de verdade.
                  </h1>
            
                  <p className="mt-6 text-base leading-7 text-slate-400 lg:text-lg">
                    Trilhas de conteúdo, aulas ao vivo, fórum de dúvidas e muito mais —
                    tudo num só lugar. Feito para quem leva o aprendizado a sério.
                  </p>
            
                  <Button className="mt-8 rounded-full bg-blue-600 px-8 py-6 text-base font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-700 cursor-pointer" onClick={() => isLogged ? navigate(`/Dashboard`) : navigate(`/Login`)}>
                    {isLogged ? 'Voltar ao dashboard' : 'Começar Agora'}                    
                  </Button>
                </div>
            
                <div className="flex flex-1 justify-center">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-80 w-[320px] rounded-full bg-blue-700/20 blur-3xl" />
            
                    <img
                      src={student}
                      alt="Estudante"
                      className="relative z-10 w-full max-w-105 object-contain"
                    />
                  </div>
                </div>
              </section>
            
              {/* MANIFESTO */}
              <section className="mx-auto max-w-5xl px-5 py-20 text-center lg:px-10">
                <h2 className="text-4xl font-bold tracking-wide text-blue-500 lg:text-6xl">
                  PRA QUEM QUER IR ALÉM
                </h2>
            
                <h3 className="mt-6 text-2xl font-medium lg:text-4xl">
                  Você estuda, mas sente que algo ainda falta?
                </h3>
            
                <p className="mx-auto mt-8 max-w-4xl text-base leading-8 text-slate-400 lg:text-lg">
                  Conteúdo disperso, professores difíceis de acessar e dúvidas sem
                  resposta... A maioria das plataformas entrega apenas o básico — mas
                  aprendizado de verdade exige muito mais.
                </p>
              </section>
            
              {/* FEATURES */}
              <section
                id="funcionalidades"
                className="mx-auto max-w-7xl px-5 py-20 lg:px-10"
              >
                <div className="text-center">
                  <span className="text-4xl font-bold tracking-wide text-blue-500 lg:text-5xl">
                    FUNCIONALIDADES
                  </span>
                </div>
            
                <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {features.map((feature) => {
                    const Icon = feature.icon

                    return (
                      <ContextMenu key={feature.title}>
                        <ContextMenuTrigger>
                          <div className="rounded-2xl border border-white/5 bg-blue-500/10 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:bg-blue-500/20">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600/20">
                              <Icon className="size-7 text-blue-400" />
                            </div>

                            <h4 className="text-xl font-semibold">
                              {feature.title}
                            </h4>

                            <p className="mt-4 text-sm leading-7 text-slate-400">
                              {feature.description}
                            </p>
                          </div>
                        </ContextMenuTrigger>

                        <ContextMenuContent>
                          <ContextMenuItem>
                            Explorar funcionalidade
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    )
                  })}
                </div>
              </section>
              
              {/* STEPS */}
              <section
                id="trilhas"
                className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-3 lg:px-10"
              >
                <div className="space-y-6">
                  {steps.slice(0, 2).map((step) => (
                    <div
                      key={step.title}
                      className="rounded-2xl border-2 border-blue-700 bg-blue-500/10 p-6 transition-transform duration-300 hover:-translate-y-1"
                    >
                      <h4 className="text-xl font-semibold">{step.title}</h4>

                      <p className="mt-4 text-sm leading-7 text-slate-300">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              
                <div className="flex justify-center">
                  <img
                    src={mockup}
                    alt="Mockup"
                    className="w-full max-w-[320px] object-contain"
                  />
                </div>
              
                <div className="space-y-6">
                  {steps.slice(2, 4).map((step) => (
                    <div
                      key={step.title}
                      className="rounded-2xl border-2 border-blue-700 bg-blue-500/10 p-6 transition-transform duration-300 hover:-translate-y-1"
                    >
                      <h4 className="text-xl font-semibold">{step.title}</h4>

                      <p className="mt-4 text-sm leading-7 text-slate-300">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* FOOTER */}
              <footer className="border-t border-white/5 px-5 py-16 lg:px-10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-14 lg:flex-row">
                  <div>
                    <img
                      src={campusFlowLogo}
                      alt="Logo"
                      className="w-55 object-contain"
                    />
                  </div>
              
                  <div className="grid grid-cols-2 gap-12">
                    <div>
                      <h5 className="text-lg font-semibold">Políticas</h5>
              
                      <div className="mt-5 space-y-3">
                        <a
                          href="#"
                          className="block text-slate-400 transition-colors hover:text-blue-500"
                        >
                          Privacidade
                        </a>
              
                        <a
                          href="#"
                          className="block text-slate-400 transition-colors hover:text-blue-500"
                        >
                          Termos de Uso
                        </a>
              
                        <a
                          href="#"
                          className="block text-slate-400 transition-colors hover:text-blue-500"
                        >
                          Termos de Compras
                        </a>
                      </div>
                    </div>
              
                    <div>
                      <h5 className="text-lg font-semibold">Contato</h5>
              
                      <div className="mt-5 space-y-3">
                        <a
                          href="#"
                          className="block text-slate-400 transition-colors hover:text-blue-500"
                        >
                          Sobre Nós
                        </a>
              
                        <a
                          href="#"
                          className="block text-slate-400 transition-colors hover:text-blue-500"
                        >
                          Funcionalidades
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              
                <div className="mt-16 border-t border-white/5 pt-10">
                  <div className="flex justify-center">
                    <LiquidMetal 
                        speed={1} 
                        softness={0.1} 
                        repetition={2} 
                        shiftRed={0.3} 
                        shiftBlue={0.3} 
                        distortion={0.07} 
                        contour={0.4} 
                        scale={0.6} 
                        rotation={0} 
                        shape="diamond" 
                        angle={70} 
                        image="https://app.paper.design/file-assets/01KSB025J6YVV569AYDC858B70/01KSB06EGPJQZW9Y5R89T1KR58.svg" 
                        colorBack="#00000000" 
                        colorTint="#FFFFFF" 
                        style={{ backgroundColor: '#AAAAAC00', height: '468px', width: '2765px' }} 
                    />
                  </div>
                </div>
              </footer>
            </div>
        </DefineApp>
    )
}