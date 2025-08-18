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
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Settings,
  Users,
  CreditCard,
  Bell,
  Mail,
  Smartphone,
  Building2,
  Calendar,
  DollarSign,
  Shield,
  Database,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  Heart
} from "lucide-react"

const userFormSchema = z.object({
  name: z.string().min(1, "Ingresa el nombre"),
  email: z.string().email("Email inválido"),
  role: z.string().min(1, "Selecciona el rol"),
  phone: z.string().optional(),
})

const activityFormSchema = z.object({
  name: z.string().min(1, "Ingresa el nombre de la actividad"),
  description: z.string().optional(),
  duration: z.string().min(1, "Ingresa la duración"),
  price: z.string().min(1, "Ingresa el precio"),
})

const paymentConfigFormSchema = z.object({
  mercadoPagoEnabled: z.boolean(),
  mercadoPagoPublicKey: z.string().optional(),
  mercadoPagoAccessToken: z.string().optional(),
  cashEnabled: z.boolean(),
  transferEnabled: z.boolean(),
  transferAccountNumber: z.string().optional(),
  transferAccountHolder: z.string().optional(),
  medicalServiceFee: z.string().min(1, "Ingresa el costo del servicio médico"),
  defaultSpacePercentage: z.string().min(1, "Ingresa el porcentaje del espacio"),
})

const teacherConfigFormSchema = z.object({
  teacherId: z.string().min(1, "Selecciona un profesor"),
  spacePercentage: z.string().min(1, "Ingresa el porcentaje del espacio"),
})

type UserFormValues = z.infer<typeof userFormSchema>
type ActivityFormValues = z.infer<typeof activityFormSchema>
type PaymentConfigFormValues = z.infer<typeof paymentConfigFormSchema>
type TeacherConfigFormValues = z.infer<typeof teacherConfigFormSchema>

// Mock data
const mockUsers = [
  { id: "1", name: "Administrador", email: "admin@tiklay.com", role: "ADMIN", phone: "+54 11 1234-5678" },
  { id: "2", name: "Ana García", email: "ana.garcia@tiklay.com", role: "TEACHER", phone: "+54 11 1111-2222" },
  { id: "3", name: "Carlos López", email: "carlos.lopez@tiklay.com", role: "TEACHER", phone: "+54 11 2222-3333" },
  { id: "4", name: "María García", email: "maria.garcia@email.com", role: "STUDENT", phone: "+54 11 1234-5678" },
  { id: "5", name: "Juan Pérez", email: "juan.perez@email.com", role: "STUDENT", phone: "+54 11 2345-6789" },
]

const mockActivities = [
  { id: "1", name: "Yoga - Principiantes", description: "Clases para principiantes", duration: 60, price: 45000, isActive: true },
  { id: "2", name: "Yoga - Intermedio", description: "Clases de nivel intermedio", duration: 60, price: 45000, isActive: true },
  { id: "3", name: "Pilates", description: "Ejercicios de pilates", duration: 45, price: 40000, isActive: true },
  { id: "4", name: "Meditación", description: "Sesiones de meditación", duration: 30, price: 30000, isActive: true },
  { id: "5", name: "Yoga Avanzado", description: "Clases avanzadas", duration: 90, price: 60000, isActive: false },
]

const mockPaymentConfig = {
  mercadoPagoEnabled: true,
  mercadoPagoPublicKey: "TEST-123456789",
  mercadoPagoAccessToken: "TEST-987654321",
  cashEnabled: true,
  transferEnabled: true,
  transferAccountNumber: "1234567890123456789012",
  transferAccountHolder: "Tiklay SA",
  medicalServiceFee: "5000",
  defaultSpacePercentage: "30",
}

const mockTeachers = [
  { id: "1", name: "Ana García", spacePercentage: 30 },
  { id: "2", name: "Carlos López", spacePercentage: 35 },
]

export default function SettingsPage() {
  const [users, setUsers] = useState(mockUsers)
  const [activities, setActivities] = useState(mockActivities)
  const [teachers, setTeachers] = useState<any[]>([])
  const [systemConfig, setSystemConfig] = useState<any>(null)
  const [paymentConfig, setPaymentConfig] = useState(mockPaymentConfig)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editingActivity, setEditingActivity] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      phone: "",
    },
  })

  const activityForm = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: "",
      price: "",
    },
  })

  const paymentConfigForm = useForm<PaymentConfigFormValues>({
    resolver: zodResolver(paymentConfigFormSchema),
    defaultValues: paymentConfig,
  })

  const teacherConfigForm = useForm<TeacherConfigFormValues>({
    resolver: zodResolver(teacherConfigFormSchema),
    defaultValues: {
      teacherId: "",
      spacePercentage: "",
    },
  })

  // Cargar datos reales al iniciar
  useEffect(() => {
    loadTeachers()
    loadSystemConfig()
  }, [])

  const loadTeachers = async () => {
    try {
      const response = await fetch('/api/teachers')
      if (response.ok) {
        const data = await response.json()
        setTeachers(data)
      }
    } catch (error) {
      console.error('Error loading teachers:', error)
    }
  }

  const loadSystemConfig = async () => {
    try {
      const response = await fetch('/api/system-config')
      if (response.ok) {
        const data = await response.json()
        setSystemConfig(data)
        paymentConfigForm.setValue('medicalServiceFee', data.medicalServiceFee.toString())
      }
    } catch (error) {
      console.error('Error loading system config:', error)
    }
  }

  const onSubmitUser = (data: UserFormValues) => {
    if (editingUser) {
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? { ...user, ...data } : user
      ))
    } else {
      const newUser = {
        id: Date.now().toString(),
        ...data,
      }
      setUsers(prev => [...prev, newUser])
    }
    
    userForm.reset()
    setIsUserDialogOpen(false)
    setEditingUser(null)
  }

  const onSubmitActivity = (data: ActivityFormValues) => {
    if (editingActivity) {
      setActivities(prev => prev.map(activity => 
        activity.id === editingActivity.id 
          ? { ...activity, ...data, duration: parseInt(data.duration), price: parseFloat(data.price) }
          : activity
      ))
    } else {
      const newActivity = {
        id: Date.now().toString(),
        ...data,
        duration: parseInt(data.duration),
        price: parseFloat(data.price),
        isActive: true,
      }
      setActivities(prev => [...prev, newActivity])
    }
    
    activityForm.reset()
    setIsActivityDialogOpen(false)
    setEditingActivity(null)
  }

  const onSubmitPaymentConfig = async (data: PaymentConfigFormValues) => {
    setLoading(true)
    try {
      const response = await fetch('/api/system-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicalServiceFee: data.medicalServiceFee,
          studioName: systemConfig?.studioName || "Tiklay",
          studioPhone: systemConfig?.studioPhone || "",
          studioEmail: systemConfig?.studioEmail || "",
          studioAddress: systemConfig?.studioAddress || "",
          studioDescription: systemConfig?.studioDescription || "",
        }),
      })

      if (response.ok) {
        const updatedConfig = await response.json()
        setSystemConfig(updatedConfig)
        // Aquí podrías mostrar una notificación de éxito
      } else {
        console.error('Error updating payment config')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (user: any) => {
    setEditingUser(user)
    userForm.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    })
    setIsUserDialogOpen(true)
  }

  const handleEditActivity = (activity: any) => {
    setEditingActivity(activity)
    activityForm.reset({
      name: activity.name,
      description: activity.description,
      duration: activity.duration.toString(),
      price: activity.price.toString(),
    })
    setIsActivityDialogOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }

  const handleDeleteActivity = (activityId: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== activityId))
  }

  const toggleActivityStatus = (activityId: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { ...activity, isActive: !activity.isActive }
        : activity
    ))
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-red-100 text-red-800">Administrador</Badge>
      case "TEACHER":
        return <Badge className="bg-blue-100 text-blue-800">Profesor</Badge>
      case "STUDENT":
        return <Badge className="bg-green-100 text-green-800">Estudiante</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Configura y administra los ajustes del sistema
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="activities">Actividades</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
            <TabsTrigger value="teachers">Profesores</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="backup">Respaldo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información del Estudio</CardTitle>
                <CardDescription>
                  Configura la información básica de tu estudio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Nombre del Estudio</label>
                    <Input defaultValue="Tiklay" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Teléfono</label>
                    <Input defaultValue="+54 11 1234-5678" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue="info@tiklay.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Dirección</label>
                    <Input defaultValue="Av. Corrientes 1234, CABA" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <textarea 
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    defaultValue="Centro de yoga y bienestar integral con clases para todos los niveles."
                  />
                </div>
                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Usuarios</CardTitle>
                    <CardDescription>
                      Administra los usuarios del sistema
                    </CardDescription>
                  </div>
                  <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Usuario
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>
                          {editingUser ? "Editar Usuario" : "Agregar Nuevo Usuario"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingUser ? "Edita la información del usuario" : "Completa la información para agregar un nuevo usuario"}
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...userForm}>
                        <form onSubmit={userForm.handleSubmit(onSubmitUser)} className="space-y-4">
                          <FormField
                            control={userForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nombre completo" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={userForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="email@ejemplo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={userForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rol</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecciona el rol" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="ADMIN">Administrador</SelectItem>
                                    <SelectItem value="TEACHER">Profesor</SelectItem>
                                    <SelectItem value="STUDENT">Estudiante</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={userForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                  <Input placeholder="+54 11 1234-5678" {...field} />
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
                                setIsUserDialogOpen(false)
                                setEditingUser(null)
                                userForm.reset()
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button type="submit">
                              {editingUser ? "Actualizar" : "Agregar"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium">{user.name}</div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {getRoleBadge(user.role)}
                        </TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
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
          </TabsContent>
          
          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Actividades</CardTitle>
                    <CardDescription>
                      Administra las actividades y clases disponibles
                    </CardDescription>
                  </div>
                  <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Actividad
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>
                          {editingActivity ? "Editar Actividad" : "Agregar Nueva Actividad"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingActivity ? "Edita la información de la actividad" : "Completa la información para agregar una nueva actividad"}
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...activityForm}>
                        <form onSubmit={activityForm.handleSubmit(onSubmitActivity)} className="space-y-4">
                          <FormField
                            control={activityForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                  <Input placeholder="Yoga - Principiantes" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={activityForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                  <Input placeholder="Descripción de la actividad" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={activityForm.control}
                              name="duration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Duración (minutos)</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="60" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={activityForm.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Precio ($)</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="45000" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => {
                                setIsActivityDialogOpen(false)
                                setEditingActivity(null)
                                activityForm.reset()
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button type="submit">
                              {editingActivity ? "Actualizar" : "Agregar"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Actividad</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{activity.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {activity.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{activity.duration} min</TableCell>
                        <TableCell>${activity.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {activity.isActive ? (
                              <Badge className="bg-green-100 text-green-800">Activa</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">Inactiva</Badge>
                            )}
                            <Switch
                              checked={activity.isActive}
                              onCheckedChange={() => toggleActivityStatus(activity.id)}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditActivity(activity)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteActivity(activity.id)}
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
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Pagos</CardTitle>
                <CardDescription>
                  Configura los métodos de pago disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...paymentConfigForm}>
                  <form onSubmit={paymentConfigForm.handleSubmit(onSubmitPaymentConfig)} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <h3 className="text-lg font-medium">Mercado Pago</h3>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={paymentConfigForm.watch("mercadoPagoEnabled")}
                            onCheckedChange={(checked) => paymentConfigForm.setValue("mercadoPagoEnabled", checked)}
                          />
                          <label>Habilitar Mercado Pago</label>
                        </div>
                      </div>
                      
                      {paymentConfigForm.watch("mercadoPagoEnabled") && (
                        <div className="grid gap-4 md:grid-cols-2 pl-7 border-l-2">
                          <FormField
                            control={paymentConfigForm.control}
                            name="mercadoPagoPublicKey"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Public Key</FormLabel>
                                <FormControl>
                                  <Input placeholder="TEST-123456789" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={paymentConfigForm.control}
                            name="mercadoPagoAccessToken"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Access Token</FormLabel>
                                <FormControl>
                                  <Input placeholder="TEST-987654321" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5" />
                        <h3 className="text-lg font-medium">Transferencia Bancaria</h3>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={paymentConfigForm.watch("transferEnabled")}
                            onCheckedChange={(checked) => paymentConfigForm.setValue("transferEnabled", checked)}
                          />
                          <label>Habilitar Transferencias</label>
                        </div>
                      </div>
                      
                      {paymentConfigForm.watch("transferEnabled") && (
                        <div className="grid gap-4 md:grid-cols-2 pl-7 border-l-2">
                          <FormField
                            control={paymentConfigForm.control}
                            name="transferAccountNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Número de Cuenta</FormLabel>
                                <FormControl>
                                  <Input placeholder="1234567890123456789012" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={paymentConfigForm.control}
                            name="transferAccountHolder"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Titular de la Cuenta</FormLabel>
                                <FormControl>
                                  <Input placeholder="Tiklay SA" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5" />
                        <h3 className="text-lg font-medium">Efectivo</h3>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={paymentConfigForm.watch("cashEnabled")}
                          onCheckedChange={(checked) => paymentConfigForm.setValue("cashEnabled", checked)}
                        />
                        <label>Habilitar pagos en efectivo</label>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-5 w-5" />
                        <h3 className="text-lg font-medium">Servicio Médico</h3>
                      </div>
                      
                      <FormField
                        control={paymentConfigForm.control}
                        name="medicalServiceFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Costo del Servicio Médico por Alumno</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="5000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5" />
                        <h3 className="text-lg font-medium">Porcentaje del Espacio</h3>
                      </div>
                      
                      <FormField
                        control={paymentConfigForm.control}
                        name="defaultSpacePercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Porcentaje por Defecto para Profesores</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="30" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? "Guardando..." : "Guardar Configuración"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="teachers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Profesores</CardTitle>
                <CardDescription>
                  Configura el porcentaje del espacio para cada profesor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Porcentaje del Espacio por Profesor</h3>
                      <div className="space-y-3">
                        {teachers.map((teacher) => (
                          <div key={teacher.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{teacher.firstName} {teacher.lastName}</div>
                              <div className="text-sm text-muted-foreground">
                                Porcentaje actual: {teacher.spacePercentage}%
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                teacherConfigForm.reset({
                                  teacherId: teacher.id,
                                  spacePercentage: teacher.spacePercentage.toString(),
                                })
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Actualizar Porcentaje</h3>
                      <Form {...teacherConfigForm}>
                        <form onSubmit={teacherConfigForm.handleSubmit(async (data) => {
                          setLoading(true)
                          try {
                            const response = await fetch('/api/teachers', {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify(data),
                            })

                            if (response.ok) {
                              const updatedTeacher = await response.json()
                              setTeachers(prev => prev.map(teacher => 
                                teacher.id === updatedTeacher.id ? updatedTeacher : teacher
                              ))
                              teacherConfigForm.reset()
                              // Aquí podrías mostrar una notificación de éxito
                            } else {
                              console.error('Error updating teacher percentage')
                            }
                          } catch (error) {
                            console.error('Error:', error)
                          } finally {
                            setLoading(false)
                          }
                        })} className="space-y-4">
                          <FormField
                            control={teacherConfigForm.control}
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
                                    {teachers.map((teacher) => (
                                      <SelectItem key={teacher.id} value={teacher.id}>
                                        {teacher.firstName} {teacher.lastName}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={teacherConfigForm.control}
                            name="spacePercentage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Porcentaje del Espacio</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="30" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Actualizando..." : "Actualizar Porcentaje"}
                          </Button>
                        </form>
                      </Form>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Cómo funciona el cálculo:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Cada profesor tiene un porcentaje asignado para el espacio</li>
                      <li>• El servicio médico tiene un costo fijo por alumno</li>
                      <li>• El cálculo automático considera: Ingreso Total - (Porcentaje Espacio + Servicio Médico)</li>
                      <li>• El resultado es el monto que corresponde al profesor</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Notificaciones</CardTitle>
                <CardDescription>
                  Configura cómo y cuándo se envían las notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Notificaciones por Email</div>
                        <div className="text-sm text-muted-foreground">
                          Enviar notificaciones importantes por correo electrónico
                        </div>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Notificaciones SMS</div>
                        <div className="text-sm text-muted-foreground">
                          Enviar recordatorios importantes por mensaje de texto
                        </div>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Notificaciones Push</div>
                        <div className="text-sm text-muted-foreground">
                          Notificaciones en tiempo real en la aplicación
                        </div>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tipos de Notificaciones</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Recordatorios de Clase</div>
                        <div className="text-sm text-muted-foreground">
                          Recordatorios 1 hora antes de cada clase
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Recordatorios de Pago</div>
                        <div className="text-sm text-muted-foreground">
                          Notificaciones cuando un pago está próximo a vencer
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Anuncios de Eventos</div>
                        <div className="text-sm text-muted-foreground">
                          Notificaciones sobre nuevos eventos y talleres
                        </div>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Cancelaciones de Clase</div>
                        <div className="text-sm text-muted-foreground">
                          Alertas inmediatas cuando una clase es cancelada
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="backup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Respaldo y Restauración</CardTitle>
                <CardDescription>
                  Gestiona los respaldos de tus datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Respaldo Automático</CardTitle>
                      <CardDescription>
                        Configura respaldos automáticos diarios
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Respaldo diario</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Respaldo semanal</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Respaldo mensual</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Último respaldo: Hace 2 horas
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Respaldo Manual</CardTitle>
                      <CardDescription>
                        Descarga una copia de seguridad completa
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Descargar Respaldo Completo
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Descargar Solo Datos
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        Tamaño aproximado: 2.5 MB
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Restaurar Respaldo</CardTitle>
                    <CardDescription>
                      Restaura tus datos desde un archivo de respaldo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Upload className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Seleccionar archivo de respaldo</div>
                        <div className="text-sm text-muted-foreground">
                          Formatos soportados: .backup, .sql
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">
                      Seleccionar Archivo
                    </Button>
                    <div className="flex items-center space-x-2 text-sm text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>La restauración sobrescribirá todos los datos actuales</span>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}