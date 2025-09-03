"use client"

import { useState } from "react"
import React from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react"

// Mock data - en una implementación real esto vendría de la API
const mockClasses = [
  {
    id: "1",
    activityName: "Yoga - Principiantes",
    teacherName: "Ana García",
    dayOfWeek: 1, // Lunes
    startTime: "16:00",
    endTime: "17:00",
    maxStudents: 20,
    enrolledStudents: 18,
    price: 45000,
    room: "Sala A"
  },
  {
    id: "2",
    activityName: "Yoga - Intermedio",
    teacherName: "Ana García",
    dayOfWeek: 1, // Lunes
    startTime: "18:00",
    endTime: "19:00",
    maxStudents: 15,
    enrolledStudents: 12,
    price: 45000,
    room: "Sala A"
  },
  {
    id: "3",
    activityName: "Pilates",
    teacherName: "Carlos López",
    dayOfWeek: 2, // Martes
    startTime: "17:00",
    endTime: "17:45",
    maxStudents: 12,
    enrolledStudents: 10,
    price: 40000,
    room: "Sala B"
  },
  {
    id: "4",
    activityName: "Meditación",
    teacherName: "María Rodríguez",
    dayOfWeek: 3, // Miércoles
    startTime: "12:00",
    endTime: "12:30",
    maxStudents: 25,
    enrolledStudents: 20,
    price: 30000,
    room: "Sala C"
  },
  {
    id: "5",
    activityName: "Yoga Avanzado",
    teacherName: "Ana García",
    dayOfWeek: 4, // Jueves
    startTime: "19:00",
    endTime: "20:30",
    maxStudents: 10,
    enrolledStudents: 8,
    price: 60000,
    room: "Sala A"
  },
  {
    id: "6",
    activityName: "Pilates",
    teacherName: "Carlos López",
    dayOfWeek: 5, // Viernes
    startTime: "18:00",
    endTime: "18:45",
    maxStudents: 12,
    enrolledStudents: 12,
    price: 40000,
    room: "Sala B"
  },
]

const mockAttendance = [
  {
    classId: "1",
    date: "2024-01-22",
    presentStudents: 16,
    absentStudents: 2,
    totalStudents: 18
  },
  {
    classId: "2",
    date: "2024-01-22",
    presentStudents: 10,
    absentStudents: 2,
    totalStudents: 12
  }
]

const daysOfWeek = [
  { id: 0, name: "Domingo" },
  { id: 1, name: "Lunes" },
  { id: 2, name: "Martes" },
  { id: 3, name: "Miércoles" },
  { id: 4, name: "Jueves" },
  { id: 5, name: "Viernes" },
  { id: 6, name: "Sábado" },
]

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
]

export default function SchedulePage() {
  const [selectedWeek, setSelectedWeek] = useState(0)
  const [viewMode, setViewMode] = useState<"week" | "day">("week")
  const [selectedDay, setSelectedDay] = useState(1) // Lunes por defecto

  // Función para obtener las clases de un día específico
  const getClassesForDay = (dayId: number) => {
    return mockClasses.filter(cls => cls.dayOfWeek === dayId)
  }

  // Función para obtener la asistencia de una clase
  const getAttendanceForClass = (classId: string) => {
    return mockAttendance.find(att => att.classId === classId)
  }

  // Función para formatear hora
  const formatTime = (time: string) => {
    return time.slice(0, 5) // Remover segundos si existen
  }

  // Función para obtener el color según la ocupación
  const getOccupancyColor = (enrolled: number, max: number) => {
    const percentage = (enrolled / max) * 100
    if (percentage >= 90) return "bg-red-100 border-red-300"
    if (percentage >= 70) return "bg-yellow-100 border-yellow-300"
    return "bg-green-100 border-green-300"
  }

  const renderWeekView = () => {
    return (
      <div className="space-y-4">
        {/* Header de la semana */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">Semana del 15 al 21 de Enero</span>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Clase
            </Button>
          </div>
        </div>

        {/* Grid de horarios semanales */}
        <div className="grid grid-cols-8 gap-1">
          {/* Header con días de la semana */}
          <div className="p-2"></div>
          {daysOfWeek.map(day => (
            <div key={day.id} className="p-2 text-center font-medium border-b">
              {day.name}
            </div>
          ))}

          {/* Filas de horarios */}
          {timeSlots.map(time => (
            <React.Fragment key={time}>
              {/* Columna de tiempo */}
              <div className="p-2 text-sm text-muted-foreground border-r">
                {time}
              </div>
              
              {/* Columnas para cada día */}
              {daysOfWeek.map(day => {
                const classesInSlot = getClassesForDay(day.id).filter(cls => 
                  cls.startTime <= time && cls.endTime > time
                )
                
                return (
                  <div key={`${day.id}-${time}`} className="min-h-[60px] border-b border-r p-1">
                    {classesInSlot.map(cls => {
                      const attendance = getAttendanceForClass(cls.id)
                      return (
                        <div
                          key={cls.id}
                          className={`p-2 rounded-lg border text-xs ${getOccupancyColor(cls.enrolledStudents, cls.maxStudents)}`}
                        >
                          <div className="font-medium">{cls.activityName}</div>
                          <div className="text-muted-foreground">{cls.teacherName}</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs">
                              {cls.startTime} - {cls.endTime}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {cls.enrolledStudents}/{cls.maxStudents}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {cls.room}
                          </div>
                          {attendance && (
                            <div className="flex items-center mt-1 space-x-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span className="text-xs">{attendance.presentStudents}</span>
                              <XCircle className="h-3 w-3 text-red-600" />
                              <span className="text-xs">{attendance.absentStudents}</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const selectedDayData = daysOfWeek.find(day => day.id === selectedDay)
    const classesForDay = getClassesForDay(selectedDay)

    return (
      <div className="space-y-4">
        {/* Selector de día */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedDay(prev => prev > 0 ? prev - 1 : 6)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-lg">{selectedDayData?.name}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedDay(prev => prev < 6 ? prev + 1 : 0)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Clase
          </Button>
        </div>

        {/* Lista de clases del día */}
        <div className="space-y-4">
          {classesForDay.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No hay clases programadas para este día
              </CardContent>
            </Card>
          ) : (
            classesForDay.map(cls => {
              const attendance = getAttendanceForClass(cls.id)
              return (
                <Card key={cls.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{cls.activityName}</CardTitle>
                        <CardDescription>
                          Profesor: {cls.teacherName} • Sala: {cls.room}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {cls.startTime} - {cls.endTime}
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {cls.enrolledStudents}/{cls.maxStudents} estudiantes
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Capacidad: {cls.enrolledStudents}/{cls.maxStudents}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Precio: ${cls.price.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Asistencia Hoy</h4>
                        {attendance ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span className="text-xs">{attendance.presentStudents} presentes</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <XCircle className="h-3 w-3 text-red-600" />
                              <span className="text-xs">{attendance.absentStudents} ausentes</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No hay registro de hoy</span>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Acciones</h4>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Asistencia
                          </Button>
                          <Button size="sm" variant="outline">
                            <DollarSign className="h-3 w-3 mr-1" />
                            Pagos
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Horarios</h1>
          <p className="text-muted-foreground">
            Vista completa de los horarios de clases y asistencias
          </p>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clases Semanales
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockClasses.length}</div>
              <p className="text-xs text-muted-foreground">
                Activas esta semana
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Estudiantes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockClasses.reduce((sum, cls) => sum + cls.enrolledStudents, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Inscritos en todas las clases
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ocupación Promedio
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  mockClasses.reduce((sum, cls) => sum + (cls.enrolledStudents / cls.maxStudents), 0) / 
                  mockClasses.length * 100
                )}%
              </div>
              <p className="text-xs text-muted-foreground">
                De la capacidad total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Potenciales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${mockClasses.reduce((sum, cls) => sum + (cls.price * cls.enrolledStudents), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Mensuales estimados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Vista principal */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "week" | "day")}>
          <TabsList>
            <TabsTrigger value="week">Vista Semanal</TabsTrigger>
            <TabsTrigger value="day">Vista Diaria</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week" className="mt-6">
            {renderWeekView()}
          </TabsContent>
          
          <TabsContent value="day" className="mt-6">
            {renderDayView()}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}