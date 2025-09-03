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
  Calculator, 
  Search, 
  Edit, 
  Trash2, 
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Download,
  Eye,
  Percent,
  Heart,
  Building2
} from "lucide-react"

const paymentCalculationSchema = z.object({
  period: z.string().min(1, "Selecciona un período"),
  teacherId: z.string().min(1, "Selecciona un profesor"),
})

type PaymentCalculationValues = z.infer<typeof paymentCalculationSchema>

// Mock data
const mockTeachers = [
  { id: "1", firstName: "Ana", lastName: "García", spacePercentage: 30.0, specialty: "Yoga" },
  { id: "2", firstName: "Carlos", lastName: "López", spacePercentage: 35.0, specialty: "Pilates" },
]

const mockSystemConfig = {
  medicalServiceFee: 5000.0,
}

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
    teacher: mockTeachers[0],
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
    teacher: mockTeachers[1],
    createdAt: "2024-01-31",
  },
]

const mockClassData = [
  {
    teacherId: "1",
    period: "2024-01",
    studentCount: 10,
    totalIncome: 450000,
    classes: [
      { date: "2024-01-15", students: 8, income: 360000 },
      { date: "2024-01-22", students: 10, income: 450000 },
      { date: "2024-01-29", students: 7, income: 315000 },
    ]
  }
]

export default function TeacherPaymentsPage() {
  const [teacherPayments, setTeacherPayments] = useState(mockTeacherPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCalculationDialogOpen, setIsCalculationDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [calculationResult, setCalculationResult] = useState<any>(null)

  const calculationForm = useForm<PaymentCalculationValues>({
    resolver: zodResolver(paymentCalculationSchema),
    defaultValues: {
      period: "",
      teacherId: "",
    },
  })

  const filteredPayments = teacherPayments.filter(payment =>
    payment.teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.period.includes(searchTerm)
  )

  const calculatePayment = (data: PaymentCalculationValues) => {
    const teacher = mockTeachers.find(t => t.id === data.teacherId)
    const classData = mockClassData.find(c => c.teacherId === data.teacherId && c.period === data.period)
    
    if (!teacher || !classData) {
      return
    }

    const { studentCount, totalIncome } = classData
    const medicalServiceTotal = studentCount * mockSystemConfig.medicalServiceFee
    
    // Nueva fórmula de cálculo según requerimiento:
    // Profesor: (total - servicioMedico) * 65%
    // Espacio: (total - servicioMedico) * 35% + servicioMedico
    const incomeAfterMedicalService = totalIncome - medicalServiceTotal
    const teacherShare = incomeAfterMedicalService * 0.65
    const spaceShare = incomeAfterMedicalService * 0.35 + medicalServiceTotal

    const result = {
      teacher,
      period: data.period,
      studentCount,
      totalIncome,
      spaceShare,
      medicalServiceTotal,
      teacherShare,
      spacePercentage: 35, // Fijo según nueva fórmula
      medicalServiceFee: mockSystemConfig.medicalServiceFee,
    }

    setCalculationResult(result)
  }

  const saveCalculatedPayment = () => {
    if (!calculationResult) return

    const newPayment = {
      id: Date.now().toString(),
      teacherId: calculationResult.teacher.id,
      amount: calculationResult.teacherShare,
      period: calculationResult.period,
      status: "PENDING",
      paidAt: null,
      studentCount: calculationResult.studentCount,
      totalIncome: calculationResult.totalIncome,
      spaceShare: calculationResult.spaceShare,
      medicalServiceTotal: calculationResult.medicalServiceTotal,
      teacherShare: calculationResult.teacherShare,
      teacher: calculationResult.teacher,
      createdAt: new Date().toISOString().split('T')[0],
    }

    setTeacherPayments(prev => [...prev, newPayment])
    setCalculationResult(null)
    setIsCalculationDialogOpen(false)
    calculationForm.reset()
  }

  const markAsPaid = (paymentId: string) => {
    setTeacherPayments(prev => prev.map(payment => 
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

  // Calculate totals
  const totalSpaceShare = teacherPayments.reduce((sum, p) => sum + p.spaceShare, 0)
  const totalMedicalService = teacherPayments.reduce((sum, p) => sum + p.medicalServiceTotal, 0)
  const totalTeacherShare = teacherPayments.reduce((sum, p) => sum + p.teacherShare, 0)

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pagos de Profesores</h1>
            <p className="text-muted-foreground">
              Calcula y gestiona los pagos automáticos de profesores
            </p>
          </div>
          
          <Dialog open={isCalculationDialogOpen} onOpenChange={setIsCalculationDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Calculator className="mr-2 h-4 w-4" />
                Calcular Pago
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Calcular Pago Automático</DialogTitle>
                <DialogDescription>
                  Calcula automáticamente el pago del profesor considerando el porcentaje del espacio y el servicio médico.
                </DialogDescription>
              </DialogHeader>
              
              {!calculationResult ? (
                <Form {...calculationForm}>
                  <form onSubmit={calculationForm.handleSubmit(calculatePayment)} className="space-y-4">
                    <FormField
                      control={calculationForm.control}
                      name="period"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Período</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un período" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2024-01">Enero 2024</SelectItem>
                              <SelectItem value="2024-02">Febrero 2024</SelectItem>
                              <SelectItem value="2024-03">Marzo 2024</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={calculationForm.control}
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
                                  {teacher.firstName} {teacher.lastName} - {teacher.specialty}
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
                          setIsCalculationDialogOpen(false)
                          calculationForm.reset()
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">
                        Calcular
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Información del Período</h3>
                      <p><strong>Profesor:</strong> {calculationResult.teacher.firstName} {calculationResult.teacher.lastName}</p>
                      <p><strong>Período:</strong> {calculationResult.period}</p>
                      <p><strong>Estudiantes:</strong> {calculationResult.studentCount}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold">Configuración</h3>
                      <p><strong>Porcentaje Espacio:</strong> {calculationResult.spacePercentage}%</p>
                      <p><strong>Servicio Médico:</strong> ${calculationResult.medicalServiceFee.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Desglose del Pago</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Ingreso Total:</span>
                        <span className="font-medium">${calculationResult.totalIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          Servicio Médico ({calculationResult.studentCount} estudiantes):
                        </span>
                        <span className="font-medium">${calculationResult.medicalServiceTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Ingreso después de Servicio Médico:</span>
                        <span className="font-medium">${(calculationResult.totalIncome - calculationResult.medicalServiceTotal).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center">
                          <Percent className="h-4 w-4 mr-1" />
                          Porcentaje Profesor (65%):
                        </span>
                        <span className="font-medium">${calculationResult.teacherShare.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-blue-600">
                        <span className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          Porcentaje Espacio (35%) + Servicio Médico:
                        </span>
                        <span className="font-medium">${calculationResult.spaceShare.toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Total Distribuido:</span>
                        <span>${(calculationResult.teacherShare + calculationResult.spaceShare).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Fórmula aplicada:</strong><br/>
                      • Profesor: (Total - Servicio Médico) × 65%<br/>
                      • Espacio: (Total - Servicio Médico) × 35% + Servicio Médico<br/>
                      <strong>Resultado:</strong> Profesor recibe ${calculationResult.teacherShare.toLocaleString()}, 
                      Espacio recibe ${calculationResult.spaceShare.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setCalculationResult(null)
                        calculationForm.reset()
                      }}
                    >
                      Volver
                    </Button>
                    <Button onClick={saveCalculatedPayment}>
                      Guardar Pago Calculado
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Espacio</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${totalSpaceShare.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Porcentaje de todos los profesores
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Servicio Médico</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalMedicalService.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Costo médico por todos los estudiantes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profesores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalTeacherShare.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Monto total para profesores
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Historial de Pagos</CardTitle>
                <CardDescription>
                  Pagos calculados automáticamente para profesores
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pagos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>
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
                  <TableHead>Monto Profesor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
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
                    <TableCell className="text-green-600 font-medium">
                      ${payment.teacherShare.toLocaleString()}
                    </TableCell>
                    <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payment Detail Dialog */}
        <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Detalle del Pago</DialogTitle>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold">Información General</h3>
                    <p><strong>Profesor:</strong> {selectedPayment.teacher.firstName} {selectedPayment.teacher.lastName}</p>
                    <p><strong>Período:</strong> {selectedPayment.period}</p>
                    <p><strong>Estado:</strong> {getPaymentStatusBadge(selectedPayment.status)}</p>
                    <p><strong>Estudiantes:</strong> {selectedPayment.studentCount}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Desglose de Pagos</h3>
                    <p><strong>Ingreso Total:</strong> ${selectedPayment.totalIncome.toLocaleString()}</p>
                    <p className="text-blue-600"><strong>Espacio:</strong> ${selectedPayment.spaceShare.toLocaleString()}</p>
                    <p className="text-red-600"><strong>Servicio Médico:</strong> ${selectedPayment.medicalServiceTotal.toLocaleString()}</p>
                    <p className="text-green-600"><strong>Profesor:</strong> ${selectedPayment.teacherShare.toLocaleString()}</p>
                  </div>
                </div>
                
                {selectedPayment.status === "PAID" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <strong>Pagado el:</strong> {selectedPayment.paidAt}
                    </p>
                  </div>
                )}
                
                {selectedPayment.status === "PENDING" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Pendiente de pago:</strong> El profesor debe transferir 
                      ${(selectedPayment.spaceShare + selectedPayment.medicalServiceTotal).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}