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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  Plus, 
  Search, 
  Send, 
  Mail, 
  MessageSquare,
  Bell,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  ExternalLink,
  Filter,
  Eye,
  Reply,
  Trash2,
  Paperclip
} from "lucide-react"

const messageFormSchema = z.object({
  recipientType: z.string().min(1, "Selecciona el tipo de destinatario"),
  recipients: z.string().min(1, "Selecciona los destinatarios"),
  subject: z.string().min(1, "Ingresa el asunto"),
  message: z.string().min(1, "Ingresa el mensaje"),
  priority: z.string().min(1, "Selecciona la prioridad"),
})

type MessageFormValues = z.infer<typeof messageFormSchema>

const announcementFormSchema = z.object({
  title: z.string().min(1, "Ingresa el título"),
  message: z.string().min(1, "Ingresa el mensaje"),
  audience: z.string().min(1, "Selecciona la audiencia"),
  priority: z.string().min(1, "Selecciona la prioridad"),
  sendEmail: z.boolean(),
  sendSMS: z.boolean(),
})

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>

// Mock data
const mockStudents = [
  { id: "1", firstName: "María", lastName: "García", email: "maria.garcia@email.com", phone: "+54 11 1234-5678" },
  { id: "2", firstName: "Juan", lastName: "Pérez", email: "juan.perez@email.com", phone: "+54 11 2345-6789" },
  { id: "3", firstName: "Ana", lastName: "López", email: "ana.lopez@email.com", phone: "+54 11 3456-7890" },
  { id: "4", firstName: "Carlos", lastName: "Rodríguez", email: "carlos.rodriguez@email.com", phone: "+54 11 4567-8901" },
  { id: "5", firstName: "Laura", lastName: "Martínez", email: "laura.martinez@email.com", phone: "+54 11 5678-9012" },
]

const mockTeachers = [
  { id: "1", firstName: "Ana", lastName: "García", email: "ana.garcia@email.com", phone: "+54 11 1111-2222" },
  { id: "2", firstName: "Carlos", lastName: "López", email: "carlos.lopez@email.com", phone: "+54 11 2222-3333" },
]

const mockMessages = [
  {
    id: "1",
    senderId: "admin",
    senderName: "Administrador",
    recipientType: "STUDENT",
    recipients: ["María García", "Juan Pérez"],
    subject: "Cancelación de clase - Yoga",
    message: "Estimados estudiantes, les informamos que la clase de yoga de hoy 16:00 ha sido cancelada por motivos de fuerza mayor. La clase se reprogramará para el próximo lunes a la misma hora. Disculpen las molestias.",
    priority: "HIGH",
    sentAt: "2024-01-22T10:30:00",
    readBy: ["María García"],
    status: "DELIVERED",
  },
  {
    id: "2",
    senderId: "1",
    senderName: "Ana García",
    recipientType: "TEACHER",
    recipients: ["Carlos López"],
    subject: "Consulta sobre horario",
    message: "Hola Carlos, quería consultarte sobre el horario de la clase de meditación de mañana. ¿Podemos adelantarla 15 minutos? Tengo un compromiso importante.",
    priority: "NORMAL",
    sentAt: "2024-01-22T09:15:00",
    readBy: ["Carlos López"],
    status: "READ",
  },
  {
    id: "3",
    senderId: "admin",
    senderName: "Administrador",
    recipientType: "ALL",
    recipients: ["Todos los usuarios"],
    subject: "Nuevo evento - Festival de Verano",
    message: "¡Estamos emocionados de anunciar nuestro Festival de Verano! Será el 20 de diciembre en el Parque Central. Habrá clases de yoga, pilates, meditación y música en vivo. Las entradas ya están disponibles en la plataforma.",
    priority: "NORMAL",
    sentAt: "2024-01-21T16:00:00",
    readBy: ["María García", "Juan Pérez", "Ana García", "Carlos López"],
    status: "READ",
  },
]

const mockAnnouncements = [
  {
    id: "1",
    title: "Mantenimiento del Estudio",
    message: "El próximo fin de semana realizaremos mantenimiento en el estudio principal. Habrá clases limitadas. Por favor, consulten el horario alternativo.",
    audience: "ALL",
    priority: "HIGH",
    createdAt: "2024-01-22T08:00:00",
    createdBy: "Administrador",
    active: true,
    readBy: 45,
    totalRecipients: 50,
  },
  {
    id: "2",
    title: "Nuevos Horarios de Verano",
    message: "A partir del 1 de diciembre, comenzarán los nuevos horarios de verano. Pueden consultar el calendario actualizado en la plataforma.",
    audience: "STUDENT",
    priority: "NORMAL",
    createdAt: "2024-01-20T14:30:00",
    createdBy: "Administrador",
    active: true,
    readBy: 35,
    totalRecipients: 40,
  },
]

export default function CommunicationPage() {
  const [messages, setMessages] = useState(mockMessages)
  const [announcements, setAnnouncements] = useState(mockAnnouncements)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [isMessageDetailOpen, setIsMessageDetailOpen] = useState(false)

  const messageForm = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      recipientType: "",
      recipients: "",
      subject: "",
      message: "",
      priority: "NORMAL",
    },
  })

  const announcementForm = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: "",
      message: "",
      audience: "",
      priority: "NORMAL",
      sendEmail: false,
      sendSMS: false,
    },
  })

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.senderName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onSubmitMessage = (data: MessageFormValues) => {
    const recipientsList = data.recipients.split(",").map(r => r.trim())
    const newMessage = {
      id: Date.now().toString(),
      senderId: "admin",
      senderName: "Administrador",
      recipientType: data.recipientType,
      recipients: recipientsList,
      subject: data.subject,
      message: data.message,
      priority: data.priority,
      sentAt: new Date().toISOString(),
      readBy: [],
      status: "DELIVERED",
    }
    setMessages(prev => [newMessage, ...prev])
    
    messageForm.reset()
    setIsMessageDialogOpen(false)
  }

  const onSubmitAnnouncement = (data: AnnouncementFormValues) => {
    const totalRecipients = data.audience === "ALL" ? 50 : 
                          data.audience === "STUDENT" ? 40 : 10
    
    const newAnnouncement = {
      id: Date.now().toString(),
      title: data.title,
      message: data.message,
      audience: data.audience,
      priority: data.priority,
      createdAt: new Date().toISOString(),
      createdBy: "Administrador",
      active: true,
      readBy: 0,
      totalRecipients,
    }
    setAnnouncements(prev => [newAnnouncement, ...prev])
    
    announcementForm.reset()
    setIsAnnouncementDialogOpen(false)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>
      case "NORMAL":
        return <Badge className="bg-yellow-100 text-yellow-800">Normal</Badge>
      case "LOW":
        return <Badge className="bg-green-100 text-green-800">Baja</Badge>
      default:
        return <Badge>Desconocida</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <Badge className="bg-blue-100 text-blue-800">Entregado</Badge>
      case "READ":
        return <Badge className="bg-green-100 text-green-800">Leído</Badge>
      case "FAILED":
        return <Badge className="bg-red-100 text-red-800">Fallido</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const getAudienceBadge = (audience: string) => {
    switch (audience) {
      case "ALL":
        return <Badge className="bg-purple-100 text-purple-800">Todos</Badge>
      case "STUDENT":
        return <Badge className="bg-blue-100 text-blue-800">Estudiantes</Badge>
      case "TEACHER":
        return <Badge className="bg-green-100 text-green-800">Profesores</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message)
    setIsMessageDetailOpen(true)
  }

  const totalMessages = messages.length
  const unreadMessages = messages.filter(m => m.status === "DELIVERED").length
  const activeAnnouncements = announcements.filter(a => a.active).length

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Comunicación</h1>
            <p className="text-muted-foreground">
              Sistema centralizado de comunicación interna
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Mensaje
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Enviar Nuevo Mensaje</DialogTitle>
                  <DialogDescription>
                    Envía mensajes directos a estudiantes o profesores
                  </DialogDescription>
                </DialogHeader>
                <Form {...messageForm}>
                  <form onSubmit={messageForm.handleSubmit(onSubmitMessage)} className="space-y-4">
                    <FormField
                      control={messageForm.control}
                      name="recipientType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Destinatario</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="STUDENT">Estudiantes</SelectItem>
                              <SelectItem value="TEACHER">Profesores</SelectItem>
                              <SelectItem value="ALL">Todos</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={messageForm.control}
                      name="recipients"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destinatarios</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="María García, Juan Pérez, Ana López (separados por coma)"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={messageForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asunto</FormLabel>
                          <FormControl>
                            <Input placeholder="Asunto del mensaje" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={messageForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensaje</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Escribe tu mensaje aquí..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={messageForm.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prioridad</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona la prioridad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="HIGH">Alta</SelectItem>
                              <SelectItem value="NORMAL">Normal</SelectItem>
                              <SelectItem value="LOW">Baja</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsMessageDialogOpen(false)
                          messageForm.reset()
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensaje
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Bell className="mr-2 h-4 w-4" />
                  Nuevo Aviso
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Aviso</DialogTitle>
                  <DialogDescription>
                    Envía avisos y notificaciones a toda la comunidad
                  </DialogDescription>
                </DialogHeader>
                <Form {...announcementForm}>
                  <form onSubmit={announcementForm.handleSubmit(onSubmitAnnouncement)} className="space-y-4">
                    <FormField
                      control={announcementForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input placeholder="Título del aviso" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={announcementForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensaje</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Escribe el contenido del aviso..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={announcementForm.control}
                        name="audience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Audiencia</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona la audiencia" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ALL">Todos</SelectItem>
                                <SelectItem value="STUDENT">Estudiantes</SelectItem>
                                <SelectItem value="TEACHER">Profesores</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={announcementForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prioridad</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona la prioridad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="HIGH">Alta</SelectItem>
                                <SelectItem value="NORMAL">Normal</SelectItem>
                                <SelectItem value="LOW">Baja</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="sendEmail"
                          {...announcementForm.register("sendEmail")}
                        />
                        <label htmlFor="sendEmail" className="text-sm">
                          Enviar por Email
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="sendSMS"
                          {...announcementForm.register("sendSMS")}
                        />
                        <label htmlFor="sendSMS" className="text-sm">
                          Enviar por SMS
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsAnnouncementDialogOpen(false)
                          announcementForm.reset()
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Bell className="mr-2 h-4 w-4" />
                        Publicar Aviso
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Mensajes
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {totalMessages}
              </div>
              <p className="text-xs text-muted-foreground">
                Enviados este mes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mensajes No Leídos
              </CardTitle>
              <Mail className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {unreadMessages}
              </div>
              <p className="text-xs text-muted-foreground">
                Pendientes de lectura
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avisos Activos
              </CardTitle>
              <Bell className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeAnnouncements}
              </div>
              <p className="text-xs text-muted-foreground">
                Publicados actualmente
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuarios Activos
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {mockStudents.length + mockTeachers.length}
              </div>
              <p className="text-xs text-muted-foreground">
                En el sistema
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="messages" className="space-y-4">
          <TabsList>
            <TabsTrigger value="messages">Mensajes Directos</TabsTrigger>
            <TabsTrigger value="announcements">Avisos Generales</TabsTrigger>
            <TabsTrigger value="templates">Plantillas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mensajes Enviados</CardTitle>
                <CardDescription>
                  Historial de mensajes directos enviados
                </CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar mensajes..."
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
                      <TableHead>Asunto</TableHead>
                      <TableHead>Destinatarios</TableHead>
                      <TableHead>Remitente</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          <div className="font-medium">{message.subject}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {message.message.substring(0, 50)}...
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {message.recipients.length > 2 
                              ? `${message.recipients.slice(0, 2).join(", ")} +${message.recipients.length - 2}`
                              : message.recipients.join(", ")
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{message.senderName}</div>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(message.priority)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(message.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(message.sentAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewMessage(message)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <Reply className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="announcements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Avisos Generales</CardTitle>
                <CardDescription>
                  Avisos y notificaciones para toda la comunidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{announcement.title}</h3>
                          {getPriorityBadge(announcement.priority)}
                          {getAudienceBadge(announcement.audience)}
                        </div>
                        <div className="flex items-center space-x-2">
                          {announcement.active ? (
                            <Badge className="bg-green-100 text-green-800">Activo</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {announcement.message}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div>
                          Por {announcement.createdBy} - {new Date(announcement.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                          Leído por {announcement.readBy}/{announcement.totalRecipients} destinatarios
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Plantillas de Mensaje</CardTitle>
                <CardDescription>
                  Plantillas predefinidas para mensajes comunes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Cancelación de Clase</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Plantilla para notificar cancelación de clases
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      Estimados estudiantes, les informamos que la clase de [Actividad] de hoy [Hora] ha sido cancelada por [Motivo]. La clase se reprogramará para [Nueva Fecha]. Disculpen las molestias.
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Usar Plantilla
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Recordatorio de Pago</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Plantilla para recordar pagos pendientes
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      Estimado/a [Nombre], recordamos que tienes un pago pendiente de [Monto] con vencimiento el [Fecha]. Por favor, regulariza tu situación para continuar disfrutando de nuestras clases.
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Usar Plantilla
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Nuevo Evento</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Plantilla para anunciar nuevos eventos
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      ¡Estamos emocionados de anunciar nuestro nuevo evento: [Nombre del Evento]! Será el [Fecha] en [Ubicación]. Las entradas ya están disponibles. ¡No te lo pierdas!
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Usar Plantilla
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Cambio de Horario</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Plantilla para notificar cambios de horario
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      Estimados estudiantes, les informamos que a partir del [Fecha] la clase de [Actividad] cambiará su horario de [Horario Anterior] a [Nuevo Horario]. Agradecemos su comprensión.
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Usar Plantilla
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Message Detail Dialog */}
        <Dialog open={isMessageDetailOpen} onOpenChange={setIsMessageDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedMessage?.subject}</DialogTitle>
              <DialogDescription>
                Detalles del mensaje
              </DialogDescription>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Información del Mensaje</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Remitente:</span>
                        <span className="font-medium">{selectedMessage.senderName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Fecha:</span>
                        <span>{new Date(selectedMessage.sentAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Prioridad:</span>
                        {getPriorityBadge(selectedMessage.priority)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Estado:</span>
                        {getStatusBadge(selectedMessage.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Destinatarios</h4>
                    <div className="space-y-1">
                      {selectedMessage.recipients.map((recipient: string, index: number) => (
                        <div key={index} className="text-sm flex items-center justify-between">
                          <span>{recipient}</span>
                          {selectedMessage.readBy.includes(recipient) ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <Clock className="h-3 w-3 text-yellow-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Mensaje</h4>
                  <div className="p-3 bg-gray-50 rounded text-sm">
                    {selectedMessage.message}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsMessageDetailOpen(false)}
                  >
                    Cerrar
                  </Button>
                  <Button>
                    <Reply className="mr-2 h-4 w-4" />
                    Responder
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