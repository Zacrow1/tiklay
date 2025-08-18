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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  QrCode,
  Smartphone,
  Banknote,
  Building2,
  ExternalLink
} from "lucide-react"

const paymentFormSchema = z.object({
  studentId: z.string().min(1, "Selecciona un estudiante"),
  amount: z.string().min(1, "Ingresa el monto"),
  method: z.string().min(1, "Selecciona un método de pago"),
  description: z.string().min(1, "Ingresa una descripción"),
  dueDate: z.string().min(1, "Selecciona fecha de vencimiento"),
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>

const paymentMethods = [
  { 
    value: "MERCADO_PAGO", 
    label: "Mercado Pago",
    icon: QrCode,
    description: "Pago online con QR o link"
  },
  { 
    value: "TRANSFER", 
    label: "Transferencia Bancaria",
    icon: Building2,
    description: "Transferencia directa"
  },
  { 
    value: "CASH", 
    label: "Efectivo",
    icon: Banknote,
    description: "Pago en efectivo"
  },
  { 
    value: "CREDIT_CARD", 
    label: "Tarjeta de Crédito",
    icon: CreditCard,
    description: "Pago con tarjeta"
  },
  { 
    value: "DEBIT_CARD", 
    label: "Tarjeta de Débito",
    icon: Smartphone,
    description: "Pago con débito"
  },
]

// Mock data
const mockStudents = [
  { id: "1", firstName: "María", lastName: "García", email: "maria.garcia@email.com" },
  { id: "2", firstName: "Juan", lastName: "Pérez", email: "juan.perez@email.com" },
  { id: "3", firstName: "Ana", lastName: "López", email: "ana.lopez@email.com" },
  { id: "4", firstName: "Carlos", lastName: "Rodríguez", email: "carlos.rodriguez@email.com" },
  { id: "5", firstName: "Laura", lastName: "Martínez", email: "laura.martinez@email.com" },
]

const mockPayments = [
  {
    id: "1",
    studentId: "1",
    amount: 45000,
    method: "MERCADO_PAGO",
    status: "PAID",
    description: "Cuota mensual Yoga - Diciembre",
    dueDate: "2024-12-15",
    paidAt: "2024-12-10",
    paymentLink: "https://mpago.la/2j8x9y6",
    student: mockStudents[0],
  },
  {
    id: "2",
    studentId: "2",
    amount: 45000,
    method: "CASH",
    status: "PAID",
    description: "Cuota mensual Yoga - Diciembre",
    dueDate: "2024-12-15",
    paidAt: "2024-12-12",
    paymentLink: null,
    student: mockStudents[1],
  },
  {
    id: "3",
    studentId: "3",
    amount: 90000,
    method: "TRANSFER",
    status: "PENDING",
    description: "Cuota bimestral Pilates - Diciembre/Enero",
    dueDate: "2024-12-20",
    paidAt: null,
    paymentLink: null,
    student: mockStudents[2],
  },
  {
    id: "4",
    studentId: "4",
    amount: 45000,
    method: "MERCADO_PAGO",
    status: "OVERDUE",
    description: "Cuota mensual Yoga - Noviembre",
    dueDate: "2024-11-15",
    paidAt: null,
    paymentLink: "https://mpago.la/3k7l8m9",
    student: mockStudents[3],
  },
  {
    id: "5",
    studentId: "5",
    amount: 60000,
    method: "CREDIT_CARD",
    status: "PAID",
    description: "Cuota mensual Yoga Avanzado - Diciembre",
    dueDate: "2024-12-15",
    paidAt: "2024-12-08",
    paymentLink: null,
    student: mockStudents[4],
  },
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState(mockPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [isMercadoPagoDialogOpen, setIsMercadoPagoDialogOpen] = useState(false)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      studentId: "",
      amount: "",
      method: "",
      description: "",
      dueDate: "",
    },
  })

  const filteredPayments = payments.filter(payment =>
    payment.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onSubmit = (data: PaymentFormValues) => {
    const student = mockStudents.find(s => s.id === data.studentId)
    const newPayment = {
      id: Date.now().toString(),
      ...data,
      amount: parseFloat(data.amount),
      status: "PENDING",
      paidAt: null,
      paymentLink: data.method === "MERCADO_PAGO" ? `https://mpago.la/${Math.random().toString(36).substr(2, 9)}` : null,
      student,
    }
    setPayments(prev => [...prev, newPayment])
    
    form.reset()
    setIsDialogOpen(false)
  }

  const markAsPaid = (paymentId: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: "PAID", paidAt: new Date().toISOString().split('T')[0] }
        : payment
    ))
  }

  const generateMercadoPagoLink = (paymentId: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, paymentLink: `https://mpago.la/${Math.random().toString(36).substr(2, 9)}` }
        : payment
    ))
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-100 text-green-800">Pagado</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "OVERDUE":
        return <Badge className="bg-red-100 text-red-800">Atrasado</Badge>
      case "CANCELLED":
        return <Badge className="bg-gray-100 text-gray-800">Cancelado</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const getPaymentMethodInfo = (method: string) => {
    return paymentMethods.find(m => m.value === method)
  }

  const totalCollected = payments
    .filter(p => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0)
  
  const pendingAmount = payments
    .filter(p => p.status === "PENDING" || p.status === "OVERDUE")
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pagos</h1>
            <p className="text-muted-foreground">
              Gestiona los pagos de estudiantes con integración de Mercado Pago
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Crear Pago
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Pago</DialogTitle>
                <DialogDescription>
                  Completa la información para generar un nuevo pago
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="45000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
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
                                <div className="flex items-center space-x-2">
                                  <method.icon className="h-4 w-4" />
                                  <span>{method.label}</span>
                                </div>
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Input placeholder="Cuota mensual Yoga - Diciembre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Vencimiento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        form.reset()
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Crear Pago</Button>
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
                Total Recaudado
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalCollected.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Pagos confirmados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pendiente de Cobro
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                ${pendingAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {payments.filter(p => p.status === "PENDING" || p.status === "OVERDUE").length} pagos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pagos con Mercado Pago
              </CardTitle>
              <QrCode className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {payments.filter(p => p.method === "MERCADO_PAGO").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Links generados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pagos Atrasados
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {payments.filter(p => p.status === "OVERDUE").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren atención
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pago Disponibles</CardTitle>
            <CardDescription>
              Integración con múltiples métodos de pago para mayor comodidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {paymentMethods.map((method) => (
                <div key={method.value} className="p-4 border rounded-lg text-center">
                  <method.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">{method.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {method.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Pagos</CardTitle>
            <CardDescription>
              Todos los pagos registrados en el sistema
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pagos..."
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
                  <TableHead>Descripción</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const methodInfo = getPaymentMethodInfo(payment.method)
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {payment.student.firstName} {payment.student.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {payment.student.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {payment.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ${payment.amount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {methodInfo && <methodInfo.icon className="h-4 w-4" />}
                          <Badge variant="outline">{methodInfo?.label}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {payment.dueDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {payment.status === "PENDING" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsPaid(payment.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {payment.method === "MERCADO_PAGO" && (
                            <>
                              {!payment.paymentLink ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => generateMercadoPagoLink(payment.id)}
                                >
                                  <QrCode className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedPayment(payment)
                                    setIsMercadoPagoDialogOpen(true)
                                  }}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Mercado Pago Link Dialog */}
        <Dialog open={isMercadoPagoDialogOpen} onOpenChange={setIsMercadoPagoDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Link de Pago - Mercado Pago</DialogTitle>
              <DialogDescription>
                Comparte este link con el estudiante para realizar el pago
              </DialogDescription>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Estudiante:</span>
                    <span>{selectedPayment.student.firstName} {selectedPayment.student.lastName}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Monto:</span>
                    <span className="font-bold text-green-600">${selectedPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Descripción:</span>
                    <span>{selectedPayment.description}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Link de Pago:</label>
                  <div className="flex space-x-2">
                    <Input 
                      value={selectedPayment.paymentLink} 
                      readOnly 
                      className="flex-1"
                    />
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(selectedPayment.paymentLink)}
                    >
                      Copiar
                    </Button>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-block p-4 bg-white border rounded-lg">
                    <QrCode className="h-32 w-32 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Escanea este QR para pagar
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsMercadoPagoDialogOpen(false)}
                  >
                    Cerrar
                  </Button>
                  <Button 
                    onClick={() => {
                      window.open(selectedPayment.paymentLink, '_blank')
                      setIsMercadoPagoDialogOpen(false)
                    }}
                  >
                    Abrir Link
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