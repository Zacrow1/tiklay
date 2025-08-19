"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { useUserRole } from "@/hooks/use-user-role"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { CreateStudentDialog } from "@/components/quick-actions/create-student-dialog"
import { CreateActivityDialog } from "@/components/quick-actions/create-activity-dialog"
import { CreateEventDialog } from "@/components/quick-actions/create-event-dialog"
import { CreatePaymentDialog } from "@/components/quick-actions/create-payment-dialog"

export default function Home() {
  const { role } = useUserRole()

  const handleCreateStudent = (student: any) => {
    console.log('Student created:', student)
    // Aquí puedes agregar lógica adicional como mostrar una notificación
  }

  const handleCreateActivity = (activity: any) => {
    console.log('Activity created:', activity)
    // Aquí puedes agregar lógica adicional como mostrar una notificación
  }

  const handleCreateEvent = (event: any) => {
    console.log('Event created:', event)
    // Aquí puedes agregar lógica adicional como mostrar una notificación
  }

  const handleCreatePayment = (payment: any) => {
    console.log('Payment created:', payment)
    // Aquí puedes agregar lógica adicional como mostrar una notificación
  }

  const getDashboardContent = () => {
    switch (role) {
      case "ADMIN":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Bienvenido al panel de administración de Tiklay
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Estudiantes
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">245</div>
                  <p className="text-xs text-muted-foreground">
                    +12% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ingresos del Mes
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,450,000</div>
                  <p className="text-xs text-muted-foreground">
                    +8% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Clases Activas
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">
                    +2 nuevas esta semana
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tasa de Asistencia
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">
                    +3% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>
                    Últimas acciones en el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nuevo estudiante registrado</p>
                      <p className="text-xs text-muted-foreground">María García - Hace 5 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pago recibido</p>
                      <p className="text-xs text-muted-foreground">Juan Pérez - $45,000 - Hace 1 hora</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Clase cancelada</p>
                      <p className="text-xs text-muted-foreground">Yoga - Hoy 15:00 - Hace 2 horas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>
                    Tareas comunes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CreateStudentDialog onCreateStudent={handleCreateStudent} />
                  <CreateActivityDialog onCreateActivity={handleCreateActivity} />
                  <CreateEventDialog onCreateEvent={handleCreateEvent} />
                  <CreatePaymentDialog onCreatePayment={handleCreatePayment} />
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "TEACHER":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Mi Dashboard</h1>
              <p className="text-muted-foreground">
                Bienvenido, Profesor
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mis Estudiantes
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">32</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Clases Hoy
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Asistencia Hoy
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28/32</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Próxima Clase
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">16:00</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Mis Clases de Hoy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Yoga - Principiantes</h3>
                    <p className="text-sm text-muted-foreground">14:00 - 15:00</p>
                  </div>
                  <Badge>Finalizada</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Yoga - Intermedio</h3>
                    <p className="text-sm text-muted-foreground">16:00 - 17:00</p>
                  </div>
                  <Badge variant="outline">Próxima</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "STUDENT":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Mi Dashboard</h1>
              <p className="text-muted-foreground">
                Bienvenido a Tiklay
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Próxima Clase
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Hoy</div>
                  <p className="text-xs text-muted-foreground">
                    Yoga - 16:00
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Estado de Pago
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Al día</div>
                  <p className="text-xs text-muted-foreground">
                    Próximo pago: 15/12
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Asistencia
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">
                    Este mes
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Eventos
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">
                    Este mes
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Mis Clases</CardTitle>
                <CardDescription>
                  Tu horario de clases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Yoga - Principiantes</h3>
                    <p className="text-sm text-muted-foreground">Lunes y Miércoles - 16:00</p>
                  </div>
                  <Badge>Activa</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Pilates</h3>
                    <p className="text-sm text-muted-foreground">Viernes - 18:00</p>
                  </div>
                  <Badge>Activa</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return <div>Loading...</div>
    }
  }

  return (
    <MainLayout>
      {getDashboardContent()}
    </MainLayout>
  )
}