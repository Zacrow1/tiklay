"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  TrendingUp,
  Eye,
  MessageSquare
} from "lucide-react"

// Mock data for teacher view
const mockTeacherStudents = [
  {
    id: "1",
    firstName: "María",
    lastName: "García",
    email: "maria.garcia@email.com",
    phone: "+54 11 1234-5678",
    enrollments: [
      {
        id: "1",
        classScheduleId: "1",
        enrolledAt: "2024-01-01",
        isActive: true,
        classSchedule: {
          id: "1",
          activity: { name: "Yoga - Principiantes" },
          dayOfWeek: 1,
          startTime: "16:00",
          endTime: "17:00",
        },
        attendances: [
          { date: "2024-01-22", status: "PRESENT", notes: "" },
          { date: "2024-01-15", status: "PRESENT", notes: "" },
          { date: "2024-01-08", status: "LATE", notes: "Llegó 10 minutos tarde" },
        ],
      },
    ],
    payments: [
      { 
        id: "1", 
        amount: 45000, 
        status: "PAID", 
        dueDate: "2024-01-15", 
        paidAt: "2024-01-14" 
      },
    ],
  },
  {
    id: "2",
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    phone: "+54 11 2345-6789",
    enrollments: [
      {
        id: "2",
        classScheduleId: "1",
        enrolledAt: "2024-01-05",
        isActive: true,
        classSchedule: {
          id: "1",
          activity: { name: "Yoga - Principiantes" },
          dayOfWeek: 1,
          startTime: "16:00",
          endTime: "17:00",
        },
        attendances: [
          { date: "2024-01-22", status: "PRESENT", notes: "" },
          { date: "2024-01-15", status: "ABSENT", notes: "Enfermo" },
          { date: "2024-01-08", status: "PRESENT", notes: "" },
        ],
      },
    ],
    payments: [
      { 
        id: "2", 
        amount: 45000, 
        status: "PENDING", 
        dueDate: "2024-01-20", 
        paidAt: null 
      },
    ],
  },
  {
    id: "3",
    firstName: "Ana",
    lastName: "López",
    email: "ana.lopez@email.com",
    phone: "+54 11 3456-7890",
    enrollments: [
      {
        id: "3",
        classScheduleId: "2",
        enrolledAt: "2024-01-10",
        isActive: true,
        classSchedule: {
          id: "2",
          activity: { name: "Yoga - Intermedio" },
          dayOfWeek: 1,
          startTime: "18:00",
          endTime: "19:00",
        },
        attendances: [
          { date: "2024-01-22", status: "PRESENT", notes: "" },
          { date: "2024-01-15", status: "PRESENT", notes: "" },
          { date: "2024-01-08", status: "PRESENT", notes: "" },
        ],
      },
    ],
    payments: [
      { 
        id: "3", 
        amount: 45000, 
        status: "PAID", 
        dueDate: "2024-01-15", 
        paidAt: "2024-01-12" 
      },
    ],
  },
]

const mockClasses = [
  {
    id: "1",
    activity: { name: "Yoga - Principiantes" },
    dayOfWeek: 1,
    startTime: "16:00",
    endTime: "17:00",
    maxStudents: 20,
    enrollments: [
      { student: { firstName: "María", lastName: "García" } },
      { student: { firstName: "Juan", lastName: "Pérez" } },
    ],
  },
  {
    id: "2",
    activity: { name: "Yoga - Intermedio" },
    dayOfWeek: 1,
    startTime: "18:00",
    endTime: "19:00",
    maxStudents: 15,
    enrollments: [
      { student: { firstName: "Ana", lastName: "López" } },
    ],
  },
]

export default function MyStudentsPage() {
  const [students, setStudents] = useState(mockTeacherStudents)
  const [classes, setClasses] = useState(mockClasses)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false)

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAttendanceRate = (attendances: any[]) => {
    if (attendances.length === 0) return 0
    const presentCount = attendances.filter(a => a.status === "PRESENT" || a.status === "LATE").length
    return Math.round((presentCount / attendances.length) * 100)
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-100 text-green-800">Al día</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "OVERDUE":
        return <Badge className="bg-red-100 text-red-800">Atrasado</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
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

  const getDayName = (dayOfWeek: number) => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    return days[dayOfWeek]
  }

  const totalStudents = students.length
  const averageAttendance = students.reduce((sum, student) => {
    const allAttendances = student.enrollments.flatMap(e => e.attendances)
    return sum + getAttendanceRate(allAttendances)
  }, 0) / students.length

  const paymentsUpToDate = students.filter(student => 
    student.payments.every(p => p.status === "PAID")
  ).length

  const handleViewStudent = (student: any) => {
    setSelectedStudent(student)
    setIsStudentDetailOpen(true)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Estudiantes</h1>
          <p className="text-muted-foreground">
            Gestiona a los estudiantes asignados a tus clases
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
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Asignados a tus clases
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Asistencia Promedio
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(averageAttendance)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Este mes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pagos Al Día
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {paymentsUpToDate}
              </div>
              <p className="text-xs text-muted-foreground">
                De {totalStudents} estudiantes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clases Activas
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {classes.length}
              </div>
              <p className="text-xs text-muted-foreground">
                A tu cargo
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-4">
          <TabsList>
            <TabsTrigger value="students">Estudiantes</TabsTrigger>
            <TabsTrigger value="classes">Mis Clases</TabsTrigger>
            <TabsTrigger value="attendance">Asistencia</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Estudiantes</CardTitle>
                <CardDescription>
                  Todos los estudiantes asignados a tus clases
                </CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar estudiantes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Clases</TableHead>
                      <TableHead>Asistencia</TableHead>
                      <TableHead>Pagos</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const allAttendances = student.enrollments.flatMap(e => e.attendances)
                      const attendanceRate = getAttendanceRate(allAttendances)
                      const latestPayment = student.payments[student.payments.length - 1]
                      
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {student.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="mr-1 h-3 w-3" />
                                {student.email}
                              </div>
                              <div className="flex items-center text-sm">
                                <Phone className="mr-1 h-3 w-3" />
                                {student.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {student.enrollments.map((enrollment) => (
                                <div key={enrollment.id} className="text-sm">
                                  {enrollment.classSchedule.activity.name}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{attendanceRate}%</span>
                              {attendanceRate >= 80 ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {latestPayment && getPaymentStatusBadge(latestPayment.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewStudent(student)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mis Clases</CardTitle>
                <CardDescription>
                  Clases asignadas a tu cargo
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
                        <Badge className="bg-green-100 text-green-800">Activa</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {classItem.enrollments.length}/{classItem.maxStudents} estudiantes
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            Ver Asistencia
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Enviar Aviso
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="text-sm font-medium mb-2">Estudiantes:</div>
                        <div className="flex flex-wrap gap-2">
                          {classItem.enrollments.map((enrollment, index) => (
                            <Badge key={index} variant="outline">
                              {enrollment.student.firstName} {enrollment.student.lastName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registro de Asistencia</CardTitle>
                <CardDescription>
                  Historial de asistencias de tus estudiantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">
                            {student.firstName} {student.lastName}
                          </h3>
                          <div className="text-sm text-muted-foreground">
                            {student.email}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {getAttendanceRate(student.enrollments.flatMap(e => e.attendances))}%
                          </span>
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {student.enrollments.map((enrollment) => (
                          <div key={enrollment.id} className="pl-4 border-l-2 border-gray-200">
                            <div className="text-sm font-medium mb-1">
                              {enrollment.classSchedule.activity.name}
                            </div>
                            <div className="space-y-1">
                              {enrollment.attendances.map((attendance) => (
                                <div key={attendance.date} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-2">
                                    <span>{attendance.date}</span>
                                    {getAttendanceBadge(attendance.status)}
                                  </div>
                                  {attendance.notes && (
                                    <span className="text-muted-foreground text-xs">
                                      {attendance.notes}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Student Detail Dialog */}
        <Dialog open={isStudentDetailOpen} onOpenChange={setIsStudentDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedStudent?.firstName} {selectedStudent?.lastName}
              </DialogTitle>
              <DialogDescription>
                Información detallada del estudiante
              </DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Información Personal</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        {selectedStudent.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4" />
                        {selectedStudent.phone}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Estadísticas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Asistencia:</span>
                        <span className="font-medium">
                          {getAttendanceRate(selectedStudent.enrollments.flatMap(e => e.attendances))}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Clases:</span>
                        <span className="font-medium">{selectedStudent.enrollments.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Clases Inscritas</h4>
                  <div className="space-y-2">
                    {selectedStudent.enrollments.map((enrollment) => (
                      <div key={enrollment.id} className="p-2 border rounded">
                        <div className="font-medium text-sm">
                          {enrollment.classSchedule.activity.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getDayName(enrollment.classSchedule.dayOfWeek)} - {enrollment.classSchedule.startTime} a {enrollment.classSchedule.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Historial de Pagos</h4>
                  <div className="space-y-2">
                    {selectedStudent.payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium text-sm">
                            ${payment.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Vencimiento: {payment.dueDate}
                          </div>
                        </div>
                        {getPaymentStatusBadge(payment.status)}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsStudentDetailOpen(false)}
                  >
                    Cerrar
                  </Button>
                  <Button>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Enviar Mensaje
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