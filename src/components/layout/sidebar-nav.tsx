"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  DollarSign, 
  CalendarDays, 
  MessageSquare,
  Settings,
  LogOut,
  Calculator
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUserRole } from "@/hooks/use-user-role"

const navigation = {
  ADMIN: [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Estudiantes", href: "/students", icon: Users },
    { name: "Clases", href: "/classes", icon: Calendar },
    { name: "Finanzas", href: "/finances", icon: DollarSign },
    { name: "Pagos Profesores", href: "/teacher-payments", icon: Calculator },
    { name: "Eventos", href: "/events", icon: CalendarDays },
    { name: "Comunicación", href: "/communication", icon: MessageSquare },
    { name: "Configuración", href: "/settings", icon: Settings },
  ],
  TEACHER: [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Mis Estudiantes", href: "/my-students", icon: Users },
    { name: "Mis Clases", href: "/my-classes", icon: Calendar },
    { name: "Comunicación", href: "/communication", icon: MessageSquare },
  ],
  STUDENT: [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Mis Clases", href: "/my-classes", icon: Calendar },
    { name: "Pagos", href: "/payments", icon: DollarSign },
    { name: "Eventos", href: "/events", icon: CalendarDays },
  ],
}

export function SidebarNav() {
  const pathname = usePathname()
  const { role } = useUserRole()
  const userNavigation = navigation[role] || navigation.STUDENT

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-bold text-primary">Tiklay</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {userNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <Button variant="outline" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}