"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  QrCode,
  Download,
  Bell,
  BookOpen,
  Target
} from "lucide-react"

// Mock data for student view
const mockStudentClasses = [
  {
    id: "1",
    activity: { name: "Yoga - Principiantes", description: "Clases para principiantes enfocadas en posturas básicas y respiración" },
    dayOfWeek: 1,
    startTime: "16:00",
    endTime: "17:00",
    location: "Estudio Principal - Sala A",
    teacher: { firstName: "Ana", lastName: "García" },
    enrollments: [
      {
        id: "1",
        enrolledAt: "2024-01-01",
        isActive: true,
        attendances: [
          { date: "2024-01-22", status: "PRESENT", notes: "" },
          { date: "2024-01-15", status: "PRESENT", notes: "" },
          { date: "2024-01-08", status: "LATE", notes: "Llegó 10 minutos tarde" },
          { date: "2024-01-01", status: "PRESENT", notes: "" },
        ],
      },
    ],
    nextClass: "2024-01-29",
  },
  {
    id: "2",
    activity: { name: "Pilates", description: "Ejercicios de pilates para fortalecer el core y mejorar la postura" },
    dayOfWeek: 3,
    startTime: "18:00",
    endTime: "18:45",
    location: "Estudio Principal - Sala B",
    teacher: { firstName: "Carlos", lastName: "López" },
    enrollments: [
      {
        id: "2",
        enrolledAt: "2024-01-10",
        isActive: true,
        attendances: [
          { date: "2024-01-24", status: "PRESENT", notes: "" },
          { date: "2024-01-17", status: "PRESENT", notes: "" },
          { date: "2024-01-10", status: "PRESENT", notes: "" },
        ],
      },
    ],
    nextClass: "2024-01-31",
  },
]

const mockSchedule = [
  {
    day: "Lunes",
    classes: [
      {
        id: "1",
        activity: "Yoga - Principiantes",
        time: "16:00 - 17:00",
        location: "Sala A",
        teacher: "Ana García",
        status: "INSCRITO",
      },
    ],
  },
  {
    day: "Martes",
    classes: [],
  },
  {
    day: "Miércoles",
    classes: [
      {
        id: "2",
        activity: "Pilates",
        time: "18:00 - 18:45",
        location: "Sala B",
        teacher: "Carlos López",
        status: "INSCRITO",
      },
    ],
  },
  {
    day: "Jueves",
    classes: [],
  },
  {
    day: "Viernes",
    classes: [],
  },
  {
    day: "Sábado",
    classes: [],
  },
  {
    day: "Domingo",
    classes: [],
  },
]

const mockEvents = [
  {
    id: "1",
    title: "Taller de Yoga Avanzado",
    date: "2024-12-15",
    startTime: "09:00",
    endTime: "12:00",
    location: "Estudio Principal",
    ticketPrice: 15000,
    registered: true,
    ticket: {
      id: "1",
      status: "PAID",
      purchasedAt: "2024-12-01",
    },
  },
  {
    id: "2",
    title: "Festival de Verano Tiklay",
    date: "2024-12-20",
    startTime: "16:00",
    endTime: "22:00",
    location: "Parque Central",
    ticketPrice: 25000,
    registered: false,
    ticket: null,
  },
]

export default function MyClassesStudentPage() {
  const [classes, setClasses] = useState(mockStudentClasses)
  const [schedule, setSchedule] = useState(mockSchedule)
  const [events, setEvents] = useState(mockEvents)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [isClassDetailOpen, setIsClassDetailOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const getDayName = (dayOfWeek: number) => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    return days[dayOfWeek]
  }

  const getAttendanceRate = (attendances: any[]) => {
    if (attendances.length === 0) return 0
    const presentCount = attendances.filter(a => a.status === "PRESENT" || a.status === "LATE").length
    return Math.round((presentCount / attendances.length) * 100)
  }

  const getAttendanceBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <Badge className="bg-green-100 text-green-800">Presente</Badge>
      case "ABSENT":
        return <Badge className="bg-red-100 text-red-800">Ausente</Badge>
      case "LATE":
        return <Badge className="bg-yellow-100 text-yellow-800">Tarde</Badge>
      case "EXCUSED":
        return <Badge className="bg-blue-100 text-blue-800">Excusado</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const getClassStatusBadge = (status: string) => {
    switch (status) {
      case "INSCRITO":
        return <Badge className="bg-green-100 text-green-800">Inscrito</Badge>
      case "PENDIENTE":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "CANCELADO":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const getEventStatusBadge = (registered: boolean, ticketStatus?: string) => {
    if (!registered) {
      return <Badge className="bg-gray-100 text-gray-800">No inscrito</Badge>
    }
    
    switch (ticketStatus) {
      case "PAID":
        return <Badge className="bg-green-100 text-green-800">Inscrito y pagado</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Inscrito - Pago pendiente</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800">Inscrito</Badge>
    }
  }

  const getTotalClasses = () => {
    return classes.length
  }

  const getAverageAttendance = () => {
    const allAttendances = classes.flatMap(c => c.enrollments.flatMap(e => e.attendances))
    return getAttendanceRate(allAttendances)
  }

  const getNextClass = () => {
    const today = new Date()
    const nextClasses = classes
      .flatMap(c => c.enrollments)
      .filter(e => e.isActive)
      .map(e => ({
        ...e,
        classInfo: classes.find(c => c.enrollments.some(en => en.id === e.id))
      }))
      .filter(e => {
        const classDate = new Date(e.classInfo.nextClass)
        return classDate > today
      })
      .sort((a, b) => new Date(a.classInfo.nextClass).getTime() - new Date(b.classInfo.nextClass).getTime())
    
    return nextClasses[0]
  }

  const getRegisteredEvents = () => {
    return events.filter(e => e.registered).length
  }

  const handleViewClass = (classItem: any) => {
    setSelectedClass(classItem)
    setIsClassDetailOpen(true)
  }

  const nextClass = getNextClass()

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Clases</h1>
          <p className="text-muted-foreground">
            Gestiona tus clases, horarios y progreso
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clases Activas
              </CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {getTotalClasses()}
              </div>
              <p className="text-xs text-muted-foreground">
                Inscrito actualmente
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Asistencia
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {getAverageAttendance()}%
              </div>
              <p className="text-xs text-muted-foreground">
                Promedio general
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Próxima Clase
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {nextClass ? "3 días" : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {nextClass?.classInfo?.activity?.name || "Sin clases próximas"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Eventos
              </CardTitle>
              <Target className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {getRegisteredEvents()}
              </div>
              <p className="text-xs text-muted-foreground">
                Inscrito en eventos
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList>
            <TabsTrigger value="schedule">Mi Horario</TabsTrigger>
            <TabsTrigger value="classes">Mis Clases</TabsTrigger>
            <TabsTrigger value="attendance">Asistencia</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mi Horario Semanal</CardTitle>
                <CardDescription>
                  Tu horario personal de clases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium mb-4">Calendario</h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Horario de Clases</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {schedule.map((day) => (
                        <div key={day.day} className="space-y-2">
                          <h4 className="font-medium text-lg">{day.day}</h4>
                          {day.classes.length > 0 ? (
                            <div className="space-y-2">
                              {day.classes.map((classItem) => (
                                <div key={classItem.id} className="p-3 border rounded-lg bg-white">
                                  <div className="font-medium text-sm">
                                    {classItem.activity}
                                  </div>
                                  <div className="text-xs text-muted-foreground mb-2">
                                    {classItem.time}
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{classItem.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Users className="h-3 w-3" />
                                      <span>{classItem.teacher}</span>
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    {getClassStatusBadge(classItem.status)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-3 border rounded-lg bg-gray-50 text-center text-sm text-muted-foreground">
                              Sin clases
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mis Clases Inscritas</CardTitle>
                <CardDescription>
                  Clases en las que estás actualmente inscrito
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classes.map((classItem) => {
                    const enrollment = classItem.enrollments[0]
                    const attendanceRate = getAttendanceRate(enrollment.attendances)
                    
                    return (
                      <div key={classItem.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{classItem.activity.name}</h3>
                            <div className="text-sm text-muted-foreground">
                              {getDayName(classItem.dayOfWeek)} - {classItem.startTime} a {classItem.endTime}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {classItem.location}
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Activa</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Profesor: {classItem.teacher.firstName} {classItem.teacher.lastName}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Asistencia: {attendanceRate}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewClass(classItem)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {classItem.activity.description}
                        </div>
                        
                        <div className="mt-3">
                          <div className="text-sm font-medium mb-1">Próxima clase:</div>
                          <div className="text-sm">
                            {classItem.nextClass} - {classItem.startTime}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mi Historial de Asistencia</CardTitle>
                <CardDescription>
                  Registro de tu asistencia a las clases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classes.map((classItem) => (
                    <div key={classItem.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{classItem.activity.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            {getDayName(classItem.dayOfWeek)} - {classItem.startTime} a {classItem.endTime}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {getAttendanceRate(classItem.enrollments[0].attendances)}%
                          </span>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Asistencias recientes:</div>
                        <div className="grid gap-2 md:grid-cols-2">
                          {classItem.enrollments[0].attendances
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 6)
                            .map((attendance) => (
                              <div key={attendance.date} className="flex items-center justify-between p-2 border rounded">
                                <div className="text-sm">{attendance.date}</div>
                                <div className="flex items-center space-x-2">
                                  {getAttendanceBadge(attendance.status)}
                                  {attendance.notes && (
                                    <span className="text-xs text-muted-foreground">
                                      ({attendance.notes})
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Eventos Disponibles</CardTitle>
                <CardDescription>
                  Eventos especiales y talleres
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="text-sm text-muted-foreground">
                            {event.date} - {event.startTime} a {event.endTime}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {event.location}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            ${event.ticketPrice.toLocaleString()}
                          </span>
                          {getEventStatusBadge(event.registered, event.ticket?.status)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Evento especial con actividades adicionales
                        </div>
                        
                        <div className="flex space-x-2">
                          {event.registered ? (
                            <Button variant="outline" size="sm">
                              <QrCode className="h-4 w-4 mr-1" />
                              Ver Entrada
                            </Button>
                          ) : (
                            <Button size="sm">
                              Inscribirse
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Class Detail Dialog */}
        <Dialog open={isClassDetailOpen} onOpenChange={setIsClassDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedClass?.activity?.name}</DialogTitle>
              <DialogDescription>
                Información detallada de la clase
              </DialogDescription>
            </DialogHeader>
            {selectedClass && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Información de la Clase</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {getDayName(selectedClass.dayOfWeek)} - {selectedClass.startTime} a {selectedClass.endTime}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {selectedClass.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Profesor: {selectedClass.teacher.firstName} {selectedClass.teacher.lastName}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Mis Estadísticas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Asistencia:</span>
                        <span className="font-medium">
                          {getAttendanceRate(selectedClass.enrollments[0].attendances)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Clases asistidas:</span>
                        <span className="font-medium">
                          {selectedClass.enrollments[0].attendances.filter(a => a.status === "PRESENT" || a.status === "LATE").length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Estado:</span>
                        <Badge className="bg-green-100 text-green-800">Activo</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Descripción</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedClass.activity.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Próximas Clases</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <div className="font-medium">Próxima clase:</div>
                    <div>{selectedClass.nextClass} - {selectedClass.startTime}</div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsClassDetailOpen(false)}
                  >
                    Cerrar
                  </Button>
                  <Button>
                    <Bell className="mr-2 h-4 w-4" />
                    Recordatorio
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}