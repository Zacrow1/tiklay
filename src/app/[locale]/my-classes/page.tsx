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
import { 
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  MessageSquare,
  QrCode,
  Download,
  Share2
} from "lucide-react"

// Mock data for teacher classes
const mockTeacherClasses = [
  {
    id: "1",
    activity: { name: "Yoga - Principiantes", duration: 60 },
    dayOfWeek: 1,
    startTime: "16:00",
    endTime: "17:00",
    location: "Estudio Principal - Sala A",
    maxStudents: 20,
    enrollments: [
      {
        id: "1",
        student: { firstName: "María", lastName: "García" },
        enrolledAt: "2024-01-01",
        isActive: true,
      },
      {
        id: "2",
        student: { firstName: "Juan", lastName: "Pérez" },
        enrolledAt: "2024-01-05",
        isActive: true,
      },
      {
        id: "3",
        student: { firstName: "Laura", lastName: "Martínez" },
        enrolledAt: "2024-01-10",
        isActive: true,
      },
    ],
    attendances: [
      {
        id: "1",
        studentId: "1",
        date: "2024-01-22",
        status: "PRESENT",
        notes: "",
        student: { firstName: "María", lastName: "García" },
      },
      {
        id: "2",
        studentId: "2",
        date: "2024-01-22",
        status: "PRESENT",
        notes: "",
        student: { firstName: "Juan", lastName: "Pérez" },
      },
      {
        id: "3",
        studentId: "3",
        date: "2024-01-22",
        status: "LATE",
        notes: "Llegó 10 minutos tarde",
        student: { firstName: "Laura", lastName: "Martínez" },
      },
    ],
  },
  {
    id: "2",
    activity: { name: "Yoga - Intermedio", duration: 60 },
    dayOfWeek: 1,
    startTime: "18:00",
    endTime: "19:00",
    location: "Estudio Principal - Sala A",
    maxStudents: 15,
    enrollments: [
      {
        id: "4",
        student: { firstName: "Ana", lastName: "López" },
        enrolledAt: "2024-01-08",
        isActive: true,
      },
      {
        id: "5",
        student: { firstName: "Carlos", lastName: "Rodríguez" },
        enrolledAt: "2024-01-12",
        isActive: true,
      },
    ],
    attendances: [
      {
        id: "4",
        studentId: "4",
        date: "2024-01-22",
        status: "PRESENT",
        notes: "",
        student: { firstName: "Ana", lastName: "López" },
      },
      {
        id: "5",
        studentId: "5",
        date: "2024-01-22",
        status: "ABSENT",
        notes: "Enfermo",
        student: { firstName: "Carlos", lastName: "Rodríguez" },
      },
    ],
  },
  {
    id: "3",
    activity: { name: "Meditación", duration: 30 },
    dayOfWeek: 3,
    startTime: "17:00",
    endTime: "17:30",
    location: "Estudio Principal - Sala B",
    maxStudents: 12,
    enrollments: [
      {
        id: "6",
        student: { firstName: "Sofía", lastName: "González" },
        enrolledAt: "2024-01-15",
        isActive: true,
      },
    ],
    attendances: [
      {
        id: "6",
        studentId: "6",
        date: "2024-01-24",
        status: "PRESENT",
        notes: "",
        student: { firstName: "Sofía", lastName: "González" },
      },
    ],
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
        students: 18,
        maxStudents: 20,
      },
      {
        id: "2",
        activity: "Yoga - Intermedio",
        time: "18:00 - 19:00",
        location: "Sala A",
        students: 12,
        maxStudents: 15,
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
        id: "3",
        activity: "Meditación",
        time: "17:00 - 17:30",
        location: "Sala B",
        students: 8,
        maxStudents: 12,
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

export default function MyClassesPage() {
  const [classes, setClasses] = useState(mockTeacherClasses)
  const [schedule, setSchedule] = useState(mockSchedule)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

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

  const updateAttendanceStatus = (attendanceId: string, status: string) => {
    setClasses(prev => prev.map(classItem => ({
      ...classItem,
      attendances: classItem.attendances.map(att => 
        att.id === attendanceId ? { ...att, status } : att
      )
    })))
  }

  const getTodayClasses = () => {
    const today = new Date().getDay()
    return classes.filter(c => c.dayOfWeek === today)
  }

  const getTotalStudents = () => {
    return classes.reduce((sum, c) => sum + c.enrollments.length, 0)
  }

  const getAverageAttendance = () => {
    const allAttendances = classes.flatMap(c => c.attendances)
    return getAttendanceRate(allAttendances)
  }

  const getTodayAttendance = () => {
    const todayClasses = getTodayClasses()
    const todayAttendances = todayClasses.flatMap(c => c.attendances)
    return {
      present: todayAttendances.filter(a => a.status === "PRESENT").length,
      total: todayAttendances.length,
    }
  }

  const handleTakeAttendance = (classItem: any) => {
    setSelectedClass(classItem)
    setIsAttendanceDialogOpen(true)
  }

  const todayAttendance = getTodayAttendance()

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Clases</h1>
          <p className="text-muted-foreground">
            Gestiona tus clases, horarios y asistencias
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clases Hoy
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {getTodayClasses().length}
              </div>
              <p className="text-xs text-muted-foreground">
                Programadas para hoy
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Estudiantes
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {getTotalStudents()}
              </div>
              <p className="text-xs text-muted-foreground">
                En todas tus clases
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Asistencia Hoy
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {todayAttendance.total > 0 ? `${todayAttendance.present}/${todayAttendance.total}` : '0/0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Presentes hoy
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Asistencia General
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {getAverageAttendance()}%
              </div>
              <p className="text-xs text-muted-foreground">
                Promedio general
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList>
            <TabsTrigger value="schedule">Horario Semanal</TabsTrigger>
            <TabsTrigger value="today">Clases de Hoy</TabsTrigger>
            <TabsTrigger value="all">Todas las Clases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Horario Semanal</CardTitle>
                <CardDescription>
                  Tu horario de clases para toda la semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {schedule.map((day) => (
                    <div key={day.day} className="space-y-3">
                      <h3 className="font-medium text-lg">{day.day}</h3>
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
                                  <span>{classItem.students}/{classItem.maxStudents}</span>
                                </div>
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="today" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Clases de Hoy</CardTitle>
                <CardDescription>
                  Tus clases programadas para hoy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getTodayClasses().map((classItem) => {
                    const todayAttendances = classItem.attendances.filter(a => a.date === selectedDate)
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
                                {classItem.enrollments.length}/{classItem.maxStudents} estudiantes
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">
                                {todayAttendances.filter(a => a.status === "PRESENT").length}/{todayAttendances.length} presentes
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleTakeAttendance(classItem)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Tomar Asistencia
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Avisar
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-2">Estudiantes:</div>
                          <div className="flex flex-wrap gap-2">
                            {classItem.enrollments.map((enrollment) => (
                              <Badge key={enrollment.id} variant="outline">
                                {enrollment.student.firstName} {enrollment.student.lastName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {getTodayClasses().length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No tienes clases programadas para hoy
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Todas las Clases</CardTitle>
                <CardDescription>
                  Listado completo de tus clases asignadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classes.map((classItem) => {
                    const attendanceRate = getAttendanceRate(classItem.attendances)
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
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{attendanceRate}%</span>
                            {attendanceRate >= 80 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {classItem.enrollments.length}/{classItem.maxStudents} estudiantes
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {classItem.activity.duration} min
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleTakeAttendance(classItem)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Asistencia
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Enviar Aviso
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Attendance Dialog */}
        <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Asistencia - {selectedClass?.activity?.name}</DialogTitle>
              <DialogDescription>
                {selectedClass && `${getDayName(selectedClass.dayOfWeek)} ${selectedClass.startTime} - ${selectedClass.endTime}`}
              </DialogDescription>
            </DialogHeader>
            {selectedClass && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Total estudiantes: {selectedClass.enrollments.length}</span>
                  <span>
                    Presentes: {selectedClass.attendances.filter(a => a.status === "PRESENT").length}
                  </span>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Notas</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedClass.enrollments.map((enrollment) => {
                      const attendance = selectedClass.attendances.find(
                        a => a.studentId === enrollment.student.id && a.date === selectedDate
                      ) || {
                        id: `temp-${enrollment.student.id}`,
                        studentId: enrollment.student.id,
                        date: selectedDate,
                        status: "PRESENT",
                        notes: "",
                        student: enrollment.student,
                      }
                      
                      return (
                        <TableRow key={attendance.id}>
                          <TableCell>
                            <div className="font-medium">
                              {attendance.student.firstName} {attendance.student.lastName}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getAttendanceBadge(attendance.status)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {attendance.notes || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAttendanceStatus(attendance.id, "PRESENT")}
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAttendanceStatus(attendance.id, "ABSENT")}
                              >
                                <AlertCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAttendanceStatus(attendance.id, "LATE")}
                              >
                                <Clock className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                
                <div className="flex justify-between">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Lista
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAttendanceDialogOpen(false)}
                  >
                    Cerrar
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