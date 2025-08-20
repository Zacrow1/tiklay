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
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

const classFormSchema = z.object({
  activityId: z.string().min(1, "Selecciona una actividad"),
  teacherId: z.string().min(1, "Selecciona un profesor"),
  dayOfWeek: z.string().min(1, "Selecciona un día"),
  startTime: z.string().min(1, "Ingresa la hora de inicio"),
  endTime: z.string().min(1, "Ingresa la hora de fin"),
  maxStudents: z.string().min(1, "Ingresa el máximo de estudiantes"),
})

type ClassFormValues = z.infer<typeof classFormSchema>

const daysOfWeek = [
  { value: "0", label: "Domingo" },
  { value: "1", label: "Lunes" },
  { value: "2", label: "Martes" },
  { value: "3", label: "Miércoles" },
  { value: "4", label: "Jueves" },
  { value: "5", label: "Viernes" },
  { value: "6", label: "Sábado" },
]

// Mock data
const mockActivities = [
  { id: "1", name: "Yoga - Principiantes", duration: 60, price: 45000 },
  { id: "2", name: "Yoga - Intermedio", duration: 60, price: 45000 },
  { id: "3", name: "Pilates", duration: 45, price: 40000 },
  { id: "4", name: "Meditación", duration: 30, price: 30000 },
  { id: "5", name: "Yoga Avanzado", duration: 90, price: 60000 },
]

const mockTeachers = [
  { id: "1", firstName: "Ana", lastName: "García", specialty: "Yoga" },
  { id: "2", firstName: "Carlos", lastName: "López", specialty: "Pilates" },
  { id: "3", firstName: "María", lastName: "Rodríguez", specialty: "Meditación" },
]

const mockClasses = [
  {
    id: "1",
    activityId: "1",
    teacherId: "1",
    dayOfWeek: 1,
    startTime: "16:00",
    endTime: "17:00",
    maxStudents: 20,
    isActive: true,
    enrolledStudents: 18,
    activity: mockActivities[0],
    teacher: mockTeachers[0],
  },
  {
    id: "2",
    activityId: "2",
    teacherId: "1",
    dayOfWeek: 1,
    startTime: "18:00",
    endTime: "19:00",
    maxStudents: 15,
    isActive: true,
    enrolledStudents: 12,
    activity: mockActivities[1],
    teacher: mockTeachers[0],
  },
  {
    id: "3",
    activityId: "3",
    teacherId: "2",
    dayOfWeek: 3,
    startTime: "17:00",
    endTime: "17:45",
    maxStudents: 12,
    isActive: true,
    enrolledStudents: 10,
    activity: mockActivities[2],
    teacher: mockTeachers[1],
  },
]

const mockAttendance = [
  {
    id: "1",
    studentId: "1",
    classScheduleId: "1",
    date: "2024-01-22",
    status: "PRESENT",
    notes: "",
    student: { firstName: "María", lastName: "García" },
  },
  {
    id: "2",
    studentId: "2",
    classScheduleId: "1",
    date: "2024-01-22",
    status: "LATE",
    notes: "Llegó 10 minutos tarde",
    student: { firstName: "Juan", lastName: "Pérez" },
  },
  {
    id: "3",
    studentId: "3",
    classScheduleId: "1",
    date: "2024-01-22",
    status: "ABSENT",
    notes: "Enfermo",
    student: { firstName: "Ana", lastName: "López" },
  },
]

export default function ClassesPage() {
  const [classes, setClasses] = useState(mockClasses)
  const [attendance, setAttendance] = useState(mockAttendance)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<any>(null)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false)

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      activityId: "",
      teacherId: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      maxStudents: "",
    },
  })

  const filteredClasses = classes.filter(classItem =>
    classItem.activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${classItem.teacher.firstName} ${classItem.teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onSubmit = (data: ClassFormValues) => {
    const activity = mockActivities.find(a => a.id === data.activityId)
    const teacher = mockTeachers.find(t => t.id === data.teacherId)
    
    if (!activity || !teacher) {
      console.error('Activity or teacher not found')
      return
    }
    
    if (editingClass) {
      // Update existing class
      setClasses(prev => prev.map(classItem => 
        classItem.id === editingClass.id 
          ? { 
              ...classItem, 
              ...data,
              dayOfWeek: parseInt(data.dayOfWeek),
              activity,
              teacher,
              maxStudents: parseInt(data.maxStudents),
            }
          : classItem
      ))
    } else {
      // Add new class
      const newClass = {
        id: Date.now().toString(),
        ...data,
        dayOfWeek: parseInt(data.dayOfWeek),
        maxStudents: parseInt(data.maxStudents),
        isActive: true,
        enrolledStudents: 0,
        activity,
        teacher,
      }
      setClasses(prev => [...prev, newClass])
    }
    
    form.reset()
    setIsDialogOpen(false)
    setEditingClass(null)
  }

  const handleEdit = (classItem: any) => {
    setEditingClass(classItem)
    form.reset({
      activityId: classItem.activityId,
      teacherId: classItem.teacherId,
      dayOfWeek: classItem.dayOfWeek.toString(),
      startTime: classItem.startTime,
      endTime: classItem.endTime,
      maxStudents: classItem.maxStudents.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (classId: string) => {
    setClasses(prev => prev.filter(classItem => classItem.id !== classId))
  }

  const handleAttendance = (classItem: any) => {
    setSelectedClass(classItem)
    setIsAttendanceDialogOpen(true)
  }

  const updateAttendanceStatus = (attendanceId: string, status: string) => {
    setAttendance(prev => prev.map(att => 
      att.id === attendanceId ? { ...att, status } : att
    ))
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
    return daysOfWeek.find(d => d.value === dayOfWeek.toString())?.label || "Desconocido"
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clases</h1>
            <p className="text-muted-foreground">
              Gestiona los horarios y asistencias de las clases
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Clase
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingClass ? "Editar Clase" : "Agregar Nueva Clase"}
                </DialogTitle>
                <DialogDescription>
                  {editingClass 
                    ? "Edita la información de la clase existente."
                    : "Completa la información para agregar una nueva clase."
                  }
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="activityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Actividad</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una actividad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockActivities.map((activity) => (
                              <SelectItem key={activity.id} value={activity.id}>
                                {activity.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profesor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un profesor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockTeachers.map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.firstName} {teacher.lastName} ({teacher.specialty})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dayOfWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Día de la Semana</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un día" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {daysOfWeek.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora Inicio</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora Fin</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="maxStudents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Máximo de Estudiantes</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsDialogOpen(false)
                        setEditingClass(null)
                        form.reset()
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingClass ? "Actualizar" : "Agregar"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clases
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clases Activas
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {classes.filter(c => c.isActive).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Estudiantes Inscritos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {classes.reduce((sum, c) => sum + c.enrolledStudents, 0)}
              </div>
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
                  classes.reduce((sum, c) => sum + (c.enrolledStudents / c.maxStudents), 0) / classes.length * 100
                )}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <CardTitle>Horario de Clases</CardTitle>
            <CardDescription>
              Todas las clases programadas
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clases..."
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
                  <TableHead>Actividad</TableHead>
                  <TableHead>Profesor</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{classItem.activity.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${classItem.activity.price.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {classItem.teacher.firstName} {classItem.teacher.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {classItem.teacher.specialty}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {getDayName(classItem.dayOfWeek)}
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="mr-1 h-3 w-3" />
                          {classItem.startTime} - {classItem.endTime}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{classItem.enrolledStudents}/{classItem.maxStudents}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={classItem.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {classItem.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(classItem)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAttendance(classItem)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(classItem.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Dialog */}
      <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Asistencia - {selectedClass?.activity?.name}</DialogTitle>
            <DialogDescription>
              {selectedClass && `${getDayName(selectedClass.dayOfWeek)} ${selectedClass.startTime} - ${selectedClass.endTime}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
                {attendance
                  .filter(att => att.classScheduleId === selectedClass?.id)
                  .map((att) => (
                  <TableRow key={att.id}>
                    <TableCell>
                      <div className="font-medium">
                        {att.student.firstName} {att.student.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getAttendanceBadge(att.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {att.notes || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAttendanceStatus(att.id, "PRESENT")}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAttendanceStatus(att.id, "ABSENT")}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAttendanceStatus(att.id, "LATE")}
                        >
                          <AlertCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}