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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon,
  MapPin,
  Users,
  DollarSign,
  Ticket,
  Clock,
  CheckCircle,
  ExternalLink,
  QrCode,
  Smartphone,
  CreditCard,
  TrendingUp,
  Eye,
  Share2
} from "lucide-react"

const eventFormSchema = z.object({
  title: z.string().min(1, "Ingresa el título del evento"),
  description: z.string().optional(),
  date: z.string().min(1, "Selecciona la fecha"),
  startTime: z.string().min(1, "Ingresa la hora de inicio"),
  endTime: z.string().min(1, "Ingresa la hora de fin"),
  location: z.string().min(1, "Ingresa la ubicación"),
  maxAttendees: z.string().optional(),
  ticketPrice: z.string().min(1, "Ingresa el precio de la entrada"),
})

const ticketFormSchema = z.object({
  eventId: z.string().min(1, "Selecciona un evento"),
  studentId: z.string().min(1, "Selecciona un estudiante"),
  amount: z.string().min(1, "Ingresa el monto"),
  method: z.string().min(1, "Selecciona un método de pago"),
})

type EventFormValues = z.infer<typeof eventFormSchema>
type TicketFormValues = z.infer<typeof ticketFormSchema>

const paymentMethods = [
  { value: "MERCADO_PAGO", label: "Mercado Pago" },
  { value: "TRANSFER", label: "Transferencia" },
  { value: "CASH", label: "Efectivo" },
  { value: "CREDIT_CARD", label: "Tarjeta de Crédito" },
]

// Mock data
const mockStudents = [
  { id: "1", firstName: "María", lastName: "García", email: "maria.garcia@email.com" },
  { id: "2", firstName: "Juan", lastName: "Pérez", email: "juan.perez@email.com" },
  { id: "3", firstName: "Ana", lastName: "López", email: "ana.lopez@email.com" },
  { id: "4", firstName: "Carlos", lastName: "Rodríguez", email: "carlos.rodriguez@email.com" },
  { id: "5", firstName: "Laura", lastName: "Martínez", email: "laura.martinez@email.com" },
]

const mockEvents = [
  {
    id: "1",
    title: "Taller de Yoga Avanzado",
    description: "Un taller intensivo de yoga avanzado con posturas complejas y técnicas de respiración avanzadas. Dirigido por profesores certificados.",
    date: "2024-12-15",
    startTime: "09:00",
    endTime: "12:00",
    location: "Estudio Principal - Tiklay",
    maxAttendees: 20,
    ticketPrice: 15000,
    isActive: true,
    ticketsSold: 18,
    eventTickets: [
      {
        id: "1",
        eventId: "1",
        studentId: "1",
        amount: 15000,
        status: "PAID",
        purchasedAt: "2024-12-01",
        student: mockStudents[0],
      },
      {
        id: "2",
        eventId: "1",
        studentId: "2",
        amount: 15000,
        status: "PAID",
        purchasedAt: "2024-12-02",
        student: mockStudents[1],
      },
    ],
  },
  {
    id: "2",
    title: "Festival de Verano Tiklay",
    description: "Un festival al aire libre con clases de yoga, pilates, meditación y música en vivo. Incluye comida saludable y regalos exclusivos.",
    date: "2024-12-20",
    startTime: "16:00",
    endTime: "22:00",
    location: "Parue Central - Al aire libre",
    maxAttendees: 100,
    ticketPrice: 25000,
    isActive: true,
    ticketsSold: 75,
    eventTickets: [
      {
        id: "3",
        eventId: "2",
        studentId: "3",
        amount: 25000,
        status: "PAID",
        purchasedAt: "2024-12-05",
        student: mockStudents[2],
      },
    ],
  },
  {
    id: "3",
    title: "Retiro de Meditación",
    description: "Un retiro de fin de semana para profundizar en la práctica de la meditación y el mindfulness. Incluye alojamiento y comidas.",
    date: "2025-01-10",
    startTime: "18:00",
    endTime: "2025-01-12",
    location: "Centro de Retiros El Bosque",
    maxAttendees: 15,
    ticketPrice: 85000,
    isActive: true,
    ticketsSold: 8,
    eventTickets: [],
  },
]

export default function EventsPage() {
  const [events, setEvents] = useState(mockEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const eventForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      maxAttendees: "",
      ticketPrice: "",
    },
  })

  const ticketForm = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      eventId: "",
      studentId: "",
      amount: "",
      method: "",
    },
  })

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onSubmitEvent = (data: EventFormValues) => {
    const newEvent = {
      id: Date.now().toString(),
      ...data,
      maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees) : null,
      ticketPrice: parseFloat(data.ticketPrice),
      isActive: true,
      ticketsSold: 0,
      eventTickets: [],
    }
    setEvents(prev => [...prev, newEvent])
    
    eventForm.reset()
    setIsEventDialogOpen(false)
  }

  const onSubmitTicket = (data: TicketFormValues) => {
    const student = mockStudents.find(s => s.id === data.studentId)
    const event = events.find(e => e.id === data.eventId)
    
    if (event) {
      const newTicket = {
        id: Date.now().toString(),
        ...data,
        amount: parseFloat(data.amount),
        status: "PAID",
        purchasedAt: new Date().toISOString().split('T')[0],
        student,
      }
      
      // Update event tickets sold count
      setEvents(prev => prev.map(e => 
        e.id === data.eventId 
          ? { ...e, eventTickets: [...e.eventTickets, newTicket], ticketsSold: e.ticketsSold + 1 }
          : e
      ))
    }
    
    ticketForm.reset()
    setIsTicketDialogOpen(false)
  }

  const handleViewEvent = (event: any) => {
    setSelectedEvent(event)
    setIsEventDetailOpen(true)
  }

  const getEventStatusBadge = (event: any) => {
    const eventDate = new Date(event.date)
    const today = new Date()
    const isUpcoming = eventDate > today
    const isSoldOut = event.maxAttendees && event.ticketsSold >= event.maxAttendees
    
    if (!event.isActive) {
      return <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
    }
    
    if (isSoldOut) {
      return <Badge className="bg-red-100 text-red-800">Agotado</Badge>
    }
    
    if (isUpcoming) {
      return <Badge className="bg-green-100 text-green-800">Próximo</Badge>
    }
    
    return <Badge className="bg-blue-100 text-blue-800">Finalizado</Badge>
  }

  const getTicketStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-100 text-green-800">Pagado</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const totalRevenue = events.reduce((sum, event) => 
    sum + (event.ticketsSold * event.ticketPrice), 0
  )
  
  const totalTicketsSold = events.reduce((sum, event) => sum + event.ticketsSold, 0)
  
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate > new Date() && event.isActive
  })

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
            <p className="text-muted-foreground">
              Gestiona eventos y venta de entradas para Tiklay
            </p>
          </div>
          
          <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Crear Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Evento</DialogTitle>
                <DialogDescription>
                  Completa la información para crear un nuevo evento
                </DialogDescription>
              </DialogHeader>
              <Form {...eventForm}>
                <form onSubmit={eventForm.handleSubmit(onSubmitEvent)} className="space-y-4">
                  <FormField
                    control={eventForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título del Evento</FormLabel>
                        <FormControl>
                          <Input placeholder="Taller de Yoga Avanzado" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={eventForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Descripción del evento..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={eventForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={eventForm.control}
                      name="ticketPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio Entrada ($)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="15000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={eventForm.control}
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
                      control={eventForm.control}
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
                    control={eventForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ubicación</FormLabel>
                        <FormControl>
                          <Input placeholder="Estudio Principal - Tiklay" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={eventForm.control}
                    name="maxAttendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Máximo de Asistentes (Opcional)</FormLabel>
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
                        setIsEventDialogOpen(false)
                        eventForm.reset()
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Crear Evento</Button>
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
                Total Eventos
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingEvents.length} próximos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Entradas Vendidas
              </CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTicketsSold}</div>
              <p className="text-xs text-muted-foreground">
                Total vendidas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos por Eventos
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Total recaudado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Próximo Evento
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {upcomingEvents.length > 0 ? "3 días" : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {upcomingEvents[0]?.title || "Sin eventos próximos"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Lista de Eventos</TabsTrigger>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
            <TabsTrigger value="tickets">Venta de Entradas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Eventos Programados</CardTitle>
                <CardDescription>
                  Todos los eventos organizados por Tiklay
                </CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar eventos..."
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
                      <TableHead>Evento</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Entradas</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {event.description?.substring(0, 50)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {event.date}
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="mr-1 h-3 w-3" />
                              {event.startTime} - {event.endTime}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <MapPin className="mr-1 h-3 w-3" />
                            {event.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {event.ticketsSold}
                              {event.maxAttendees && `/${event.maxAttendees}`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${event.ticketPrice.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getEventStatusBadge(event)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewEvent(event)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedEvent(event)
                                setIsTicketDialogOpen(true)
                              }}
                            >
                              <Ticket className="h-4 w-4" />
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
          
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Calendario de Eventos</CardTitle>
                <CardDescription>
                  Vista mensual de todos los eventos programados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium mb-4">Eventos del Mes</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {events
                        .filter(event => {
                          if (!selectedDate) return true
                          const eventDate = new Date(event.date)
                          return eventDate.getMonth() === selectedDate.getMonth() &&
                                 eventDate.getFullYear() === selectedDate.getFullYear()
                        })
                        .map((event) => (
                          <div key={event.id} className="p-3 border rounded-lg">
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {event.date} - {event.startTime}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {event.location}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              {getEventStatusBadge(event)}
                              <span className="text-sm font-medium">
                                ${event.ticketPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tickets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Venta de Entradas</CardTitle>
                <CardDescription>
                  Gestiona la venta de entradas para los eventos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-medium">Eventos Disponibles</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {events
                        .filter(event => event.isActive && new Date(event.date) > new Date())
                        .map((event) => (
                          <div key={event.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">{event.title}</div>
                              {getEventStatusBadge(event)}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {event.date} - {event.startTime}
                            </div>
                            <div className="text-sm text-muted-foreground mb-3">
                              {event.location}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                ${event.ticketPrice.toLocaleString()}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => {
                                  ticketForm.setValue("eventId", event.id)
                                  ticketForm.setValue("amount", event.ticketPrice.toString())
                                  setIsTicketDialogOpen(true)
                                }}
                              >
                                Vender Entrada
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Últimas Ventas</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {events
                        .flatMap(event => event.eventTickets)
                        .sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime())
                        .slice(0, 10)
                        .map((ticket) => (
                          <div key={ticket.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-medium">
                                {ticket.student.firstName} {ticket.student.lastName}
                              </div>
                              {getTicketStatusBadge(ticket.status)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ${ticket.amount.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Comprado el {ticket.purchasedAt}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Event Detail Dialog */}
        <Dialog open={isEventDetailOpen} onOpenChange={setIsEventDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedEvent?.title}</DialogTitle>
              <DialogDescription>
                Detalles completos del evento
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Información del Evento</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedEvent.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {selectedEvent.startTime} - {selectedEvent.endTime}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {selectedEvent.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        {selectedEvent.ticketsSold}
                        {selectedEvent.maxAttendees && `/${selectedEvent.maxAttendees}`} asistentes
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        ${selectedEvent.ticketPrice.toLocaleString()} por entrada
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Estado</h4>
                    <div className="space-y-2">
                      {getEventStatusBadge(selectedEvent)}
                      <div className="text-sm text-muted-foreground">
                        {selectedEvent.maxAttendees && (
                          <div>
                            Ocupación: {Math.round((selectedEvent.ticketsSold / selectedEvent.maxAttendees) * 100)}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Descripción</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Asistentes ({selectedEvent.eventTickets.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedEvent.eventTickets.map((ticket: any) => (
                      <div key={ticket.id} className="flex items-center justify-between text-sm">
                        <span>
                          {ticket.student.firstName} {ticket.student.lastName}
                        </span>
                        {getTicketStatusBadge(ticket.status)}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      ticketForm.setValue("eventId", selectedEvent.id)
                      ticketForm.setValue("amount", selectedEvent.ticketPrice.toString())
                      setIsEventDetailOpen(false)
                      setIsTicketDialogOpen(true)
                    }}
                  >
                    <Ticket className="mr-2 h-4 w-4" />
                    Vender Entrada
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEventDetailOpen(false)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Ticket Sale Dialog */}
        <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Vender Entrada</DialogTitle>
              <DialogDescription>
                Completa la información para vender una entrada
              </DialogDescription>
            </DialogHeader>
            <Form {...ticketForm}>
              <form onSubmit={ticketForm.handleSubmit(onSubmitTicket)} className="space-y-4">
                <FormField
                  control={ticketForm.control}
                  name="eventId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un evento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {events
                            .filter(event => event.isActive && new Date(event.date) > new Date())
                            .map((event) => (
                              <SelectItem key={event.id} value={event.id}>
                                {event.title} - {event.date}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={ticketForm.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estudiante</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un estudiante" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockStudents.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.firstName} {student.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={ticketForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="15000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={ticketForm.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de Pago</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un método" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
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
                      setIsTicketDialogOpen(false)
                      ticketForm.reset()
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Vender Entrada</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}