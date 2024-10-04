"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Smartphone, CalendarDays, Split, Workflow, Settings, ListChecks, Zap, MessageSquareText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UsageCounter } from "../usage-counter";
import { Button } from "../ui/button";
import useStore from "@/hooks/useStore";
import useAuthStore from "@/hooks/use-user";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-[#5528ff]"
  },
  {
    label: "Whastapp",
    icon: Smartphone,
    href: "/whatsapp",
    color: "text-[#5528ff]"
  },
  {
    label: "Agendamentos",
    icon: CalendarDays,
    href: "/agendamentos",
    color: "text-[#5528ff]"
  },
  {
    label: "Disparos Rápidos",
    icon: Zap,
    href: "/disparos-rapidos",
    color: "text-[#5528ff]"
  },
  // {
  //   label: "Redirecionadores",
  //   icon: Split,
  //   href: "/redirecionadores",
  //   color: "text-[#5528ff]"
  // },
  // {
  //   label: "Workflows",
  //   icon: Workflow,
  //   href: "/workflows",
  //   color: "text-[#5528ff]"
  // },
  {
    label: "Listas de disparo",
    icon: ListChecks,
    href: "/listas-de-disparo",
    color: "text-[#5528ff]"
  },
  {
    label: "Listas de mensagens",
    icon: MessageSquareText,
    href: "/listas-de-mensagens",
    color: "text-[#5528ff]"
  },
  // {
  //   label: "Configurações",
  //   icon: Settings,
  //   href: "/configuracoes",
  //   color: "text-[#5528ff]"
  // },
]

export function Root() {
  const pathname = usePathname();
  const router = useRouter();
  const authStore = useStore(useAuthStore, state => state);
  const handleLogout = () => {
    authStore?.logout();
    router.push("/login");
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-100">
      <div className="px-3 py-2 flex-1">
        <Link href={"/dashboard"} className="flex items-center pl-3 mb-14 md:mb-7">
          <div className="relative w-32 h-8 mr-4 md:w-24">
            <Image fill src="/logo.svg" alt="zapgate" priority />
          </div>
        </Link>
        <div className="space-y-3 md:space-y-1">
          {routes.map((route) => (
            <Link href={route.href} key={route.href} className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-[#5528ff] hover:bg-black/5 rounded-lg transition", pathname === route.href ? "text-[#5528ff] bg-black/5" : "text-zinc-500")}>
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3 md:h-3 md:w-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Button variant="ghost" onClick={handleLogout}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
        Sair
      </Button>
    </div>
  )
}
