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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Download,
  Eye
} from "lucide-react"

const paymentFormSchema = z.object({
  studentId: z.string().min(1, "Selecciona un estudiante"),
  amount: z.string().min(1, "Ingresa el monto"),
  method: z.string().min(1, "Selecciona un método de pago"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
})

const expenseFormSchema = z.object({
  description: z.string().min(1, "Ingresa una descripción"),
  amount: z.string().min(1, "Ingresa el monto"),
  category: z.string().min(1, "Selecciona una categoría"),
  date: z.string().min(1, "Selecciona una fecha"),
  notes: z.string().optional(),
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>
type ExpenseFormValues = z.infer<typeof expenseFormSchema>

const paymentMethods = [
  { value: "CASH", label: "Efectivo" },
  { value: "TRANSFER", label: "Transferencia" },
  { value: "MERCADO_PAGO", label: "Mercado Pago" },
  { value: "CREDIT_CARD", label: "Tarjeta de Crédito" },
  { value: "DEBIT_CARD", label: "Tarjeta de Débito" },
]

const expenseCategories = [
  { value: "RENT", label: "Alquiler" },
  { value: "UTILITIES", label: "Servicios" },
  { value: "SALARIES", label: "Sueldos" },
  { value: "MATERIALS", label: "Materiales" },
  { value: "MAINTENANCE", label: "Mantenimiento" },
  { value: "MARKETING", label: "Marketing" },
  { value: "OTHER", label: "Otros" },
]

// Mock data
const mockStudents = [
  { id: "1", firstName: "María", lastName: "García", email: "maria.garcia@email.com" },
  { id: "2", firstName: "Juan", lastName: "Pérez", email: "juan.perez@email.com" },
  { id: "3", firstName: "Ana", lastName: "López", email: "ana.lopez@email.com" },
]

const mockPayments = [
  {
    id: "1",
    studentId: "1",
    amount: 45000,
    method: "TRANSFER",
    status: "PAID",
    description: "Cuota mensual Yoga",
    dueDate: "2024-01-15",
    paidAt: "2024-01-14",
    student: mockStudents[0],
  },
  {
    id: "2",
    studentId: "2",
    amount: 45000,
    method: "CASH",
    status: "PENDING",
    description: "Cuota mensual Yoga",
    dueDate: "2024-01-20",
    paidAt: null,
    student: mockStudents[1],
  },
  {
    id: "3",
    studentId: "3",
    amount: 90000,
    method: "MERCADO_PAGO",
    status: "PAID",
    description: "Cuota bimestral Pilates",
    dueDate: "2024-01-10",
    paidAt: "2024-01-08",
    student: mockStudents[2],
  },
]

const mockTeacherPayments = [
  {
    id: "1",
    teacherId: "1",
    amount: 315000,
    period: "2024-01",
    status: "PENDING",
    paidAt: null,
    studentCount: 10,
    totalIncome: 450000,
    spaceShare: 135000,
    medicalServiceTotal: 50000,
    teacherShare: 265000,
    teacher: { firstName: "Ana", lastName: "García", specialty: "Yoga" },
    createdAt: "2024-01-31",
  },
  {
    id: "2",
    teacherId: "2",
    amount: 260000,
    period: "2024-01",
    status: "PAID",
    paidAt: "2024-02-05",
    studentCount: 8,
    totalIncome: 400000,
    spaceShare: 140000,
    medicalServiceTotal: 40000,
    teacherShare: 220000,
    teacher: { firstName: "Carlos", lastName: "López", specialty: "Pilates" },
    createdAt: "2024-01-31",
  },
]

const mockExpenses = [
  {
    id: "1",
    description: "Alquiler del local",
    amount: 500000,
    category: "RENT",
    date: "2024-01-01",
    notes: "Alquiler mensual",
  },
  {
    id: "2",
    description: "Servicios (luz, agua, internet)",
    amount: 80000,
    category: "UTILITIES",
    date: "2024-01-05",
    notes: "Servicios mensuales",
  },
  {
    id: "3",
    description: "Compra de mats de yoga",
    amount: 150000,
    category: "MATERIALS",
    date: "2024-01-10",
    notes: "10 mats nuevos",
  },
  {
    id: "4",
    description: "Sueldo profesor Ana",
    amount: 300000,
    category: "SALARIES",
    date: "2024-01-15",
    notes: "Sueldo mensual",
  },
]

export default function FinancesPage() {
  const [payments, setPayments] = useState(mockPayments)
  const [expenses, setExpenses] = useState(mockExpenses)
  const [teacherPayments, setTeacherPayments] = useState(mockTeacherPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<any>(null)
  const [editingExpense, setEditingExpense] = useState<any>(null)

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      studentId: "",
      amount: "",
      method: "",
      description: "",
      dueDate: "",
    },
  })

  const expenseForm = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "",
      date: "",
      notes: "",
    },
  })

  const filteredPayments = payments.filter(payment =>
    payment.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate financial metrics
  const totalIncome = payments
    .filter(p => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0)
  
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  
  // Calculate teacher payments
  const totalTeacherSpaceShare = teacherPayments.reduce((sum, p) => sum + p.spaceShare, 0)
  const totalTeacherMedicalService = teacherPayments.reduce((sum, p) => sum + p.medicalServiceTotal, 0)
  const totalTeacherPaymentsIncome = teacherPayments
    .filter(p => p.status === "PAID")
    .reduce((sum, p) => sum + (p.spaceShare + p.medicalServiceTotal), 0)
  
  const allExpenses = totalExpenses + totalTeacherSpaceShare + totalTeacherMedicalService
  const allIncome = totalIncome + totalTeacherPaymentsIncome
  const netBalance = allIncome - allExpenses
  
  const pendingPayments = payments
    .filter(p => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0)
  
  const pendingTeacherPayments = teacherPayments
    .filter(p => p.status === "PENDING")
    .reduce((sum, p) => sum + (p.spaceShare + p.medicalServiceTotal), 0)

  const onSubmitPayment = (data: PaymentFormValues) => {
    const student = mockStudents.find(s => s.id === data.studentId)
    
    if (editingPayment) {
      // Update existing payment
      setPayments(prev => prev.map(payment => 
        payment.id === editingPayment.id 
          ? { 
              ...payment, 
              ...data,
              amount: parseFloat(data.amount),
              student,
            }
          : payment
      ))
    } else {
      // Add new payment
      const newPayment = {
        id: Date.now().toString(),
        ...data,
        amount: parseFloat(data.amount),
        status: "PENDING",
        paidAt: null,
        student,
      }
      setPayments(prev => [...prev, newPayment])
    }
    
    paymentForm.reset()
    setIsPaymentDialogOpen(false)
    setEditingPayment(null)
  }

  const onSubmitExpense = (data: ExpenseFormValues) => {
    if (editingExpense) {
      // Update existing expense
      setExpenses(prev => prev.map(expense => 
        expense.id === editingExpense.id 
          ? { 
              ...expense, 
              ...data,
              amount: parseFloat(data.amount),
            }
          : expense
      ))
    } else {
      // Add new expense
      const newExpense = {
        id: Date.now().toString(),
        ...data,
        amount: parseFloat(data.amount),
      }
      setExpenses(prev => [...prev, newExpense])
    }
    
    expenseForm.reset()
    setIsExpenseDialogOpen(false)
    setEditingExpense(null)
  }

  const handleEditPayment = (payment: any) => {
    setEditingPayment(payment)
    paymentForm.reset({
      studentId: payment.studentId,
      amount: payment.amount.toString(),
      method: payment.method,
      description: payment.description,
      dueDate: payment.dueDate,
    })
    setIsPaymentDialogOpen(true)
  }

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense)
    expenseForm.reset({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      notes: expense.notes,
    })
    setIsExpenseDialogOpen(true)
  }

  const handleDeletePayment = (paymentId: string) => {
    setPayments(prev => prev.filter(payment => payment.id !== paymentId))
  }

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId))
  }

  const markAsPaid = (paymentId: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: "PAID", paidAt: new Date().toISOString().split('T')[0] }
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
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    const methodInfo = paymentMethods.find(m => m.value === method)
    return <Badge variant="outline">{methodInfo?.label || method}</Badge>
  }

  const getExpenseCategoryBadge = (category: string) => {
    const categoryInfo = expenseCategories.find(c => c.value === category)
    return <Badge variant="outline">{categoryInfo?.label || category}</Badge>
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Finanzas</h1>
            <p className="text-muted-foreground">
              Gestiona los ingresos, gastos y finanzas de Tiklay
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Pago
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingPayment ? "Editar Pago" : "Agregar Nuevo Pago"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPayment 
                      ? "Edita la información del pago existente."
                      : "Completa la información para agregar un nuevo pago."
                    }
                  </DialogDescription>
                </DialogHeader>
                <Form {...paymentForm}>
                  <form onSubmit={paymentForm.handleSubmit(onSubmitPayment)} className="space-y-4">
                    <FormField
                      control={paymentForm.control}
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
                      control={paymentForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monto</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="45000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentForm.control}
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
                    
                    <FormField
                      control={paymentForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Input placeholder="Cuota mensual Yoga" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentForm.control}
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
                          setIsPaymentDialogOpen(false)
                          setEditingPayment(null)
                          paymentForm.reset()
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingPayment ? "Actualizar" : "Agregar"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Gasto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingExpense ? "Editar Gasto" : "Agregar Nuevo Gasto"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingExpense 
                      ? "Edita la información del gasto existente."
                      : "Completa la información para agregar un nuevo gasto."
                    }
                  </DialogDescription>
                </DialogHeader>
                <Form {...expenseForm}>
                  <form onSubmit={expenseForm.handleSubmit(onSubmitExpense)} className="space-y-4">
                    <FormField
                      control={expenseForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Input placeholder="Alquiler del local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={expenseForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monto</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="500000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={expenseForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {expenseCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={expenseForm.control}
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
                      control={expenseForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas</FormLabel>
                          <FormControl>
                            <Input placeholder="Notas adicionales" {...field} />
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
                          setIsExpenseDialogOpen(false)
                          setEditingExpense(null)
                          expenseForm.reset()
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingExpense ? "Actualizar" : "Agregar"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos del Mes
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +8% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Gastos del Mes
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +5% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Balance Neto
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Balance mensual (incluye pagos de profesores)
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pagos Pendientes
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                ${(pendingPayments + pendingTeacherPayments).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {payments.filter(p => p.status === "PENDING").length} estudiantes + {teacherPayments.filter(p => p.status === "PENDING").length} profesores
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingreso Profesores
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${totalTeacherPaymentsIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Pagos recibidos de profesores
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Payments and Expenses */}
        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payments">Pagos Estudiantes</TabsTrigger>
            <TabsTrigger value="teacher-payments">Pagos Profesores</TabsTrigger>
            <TabsTrigger value="expenses">Gastos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payments" className="space-y-4">
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
                      <TableHead>Monto</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Vencimiento</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {payment.student.firstName} {payment.student.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {payment.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${payment.amount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPaymentMethodBadge(payment.method)}
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPayment(payment)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {payment.status === "PENDING" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markAsPaid(payment.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePayment(payment.id)}
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
          
          <TabsContent value="teacher-payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pagos de Profesores</CardTitle>
                <CardDescription>
                  Pagos calculados automáticamente para profesores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profesor</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Estudiantes</TableHead>
                      <TableHead>Ingreso Total</TableHead>
                      <TableHead>Porcentaje Espacio</TableHead>
                      <TableHead>Servicio Médico</TableHead>
                      <TableHead>Total a Pagar</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {payment.teacher.firstName} {payment.teacher.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {payment.teacher.specialty}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{payment.period}</TableCell>
                        <TableCell>{payment.studentCount}</TableCell>
                        <TableCell>${payment.totalIncome.toLocaleString()}</TableCell>
                        <TableCell className="text-blue-600">
                          ${payment.spaceShare.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-red-600">
                          ${payment.medicalServiceTotal.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-bold">
                          ${(payment.spaceShare + payment.medicalServiceTotal).toLocaleString()}
                        </TableCell>
                        <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {payment.status === "PENDING" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setTeacherPayments(prev => prev.map(p => 
                                    p.id === payment.id 
                                      ? { ...p, status: "PAID", paidAt: new Date().toISOString().split('T')[0] }
                                      : p
                                  ))
                                }}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Gastos</CardTitle>
                <CardDescription>
                  Todos los gastos registrados en el sistema
                </CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar gastos..."
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
                      <TableHead>Descripción</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Notas</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          <div className="font-medium">
                            {expense.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getExpenseCategoryBadge(expense.category)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-red-600">
                            ${expense.amount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {expense.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {expense.notes || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditExpense(expense)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteExpense(expense.id)}
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
        </Tabs>
      </div>
    </MainLayout>
  )
}