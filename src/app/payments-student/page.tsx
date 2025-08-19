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
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  QrCode,
  Download,
  ExternalLink,
  Smartphone,
  Building2,
  Banknote,
  Receipt,
  History,
  Eye,
  Input
} from "lucide-react"

// Mock data for student payments
const mockStudentPayments = [
  {
    id: "1",
    amount: 45000,
    method: "MERCADO_PAGO",
    status: "PAID",
    description: "Cuota mensual Yoga - Diciembre",
    dueDate: "2024-12-15",
    paidAt: "2024-12-10",
    paymentLink: "https://mpago.la/2j8x9y6",
    transactionId: "TXN123456789",
  },
  {
    id: "2",
    amount: 45000,
    method: "CASH",
    status: "PAID",
    description: "Cuota mensual Yoga - Noviembre",
    dueDate: "2024-11-15",
    paidAt: "2024-11-12",
    paymentLink: null,
    transactionId: "CASH001",
  },
  {
    id: "3",
    amount: 90000,
    method: "TRANSFER",
    status: "PAID",
    description: "Cuota bimestral Pilates - Noviembre/Diciembre",
    dueDate: "2024-11-01",
    paidAt: "2024-10-28",
    paymentLink: null,
    transactionId: "TRF987654321",
  },
  {
    id: "4",
    amount: 45000,
    method: "MERCADO_PAGO",
    status: "PENDING",
    description: "Cuota mensual Yoga - Enero",
    dueDate: "2025-01-15",
    paidAt: null,
    paymentLink: "https://mpago.la/3k7l8m9",
    transactionId: null,
  },
]

const mockPaymentMethods = [
  {
    id: "1",
    name: "Mercado Pago",
    description: "Paga online con QR o link de pago",
    icon: QrCode,
    enabled: true,
  },
  {
    id: "2",
    name: "Transferencia Bancaria",
    description: "Transferencia directa a la cuenta",
    icon: Building2,
    enabled: true,
  },
  {
    id: "3",
    name: "Efectivo",
    description: "Paga en persona en el estudio",
    icon: Banknote,
    enabled: true,
  },
  {
    id: "4",
    name: "Tarjeta de Crédito/Débito",
    description: "Paga con tarjeta en el estudio",
    icon: CreditCard,
    enabled: true,
  },
]

const mockPaymentPlans = [
  {
    id: "1",
    name: "Plan Mensual",
    description: "Acceso a todas tus clases mensuales",
    amount: 45000,
    frequency: "MENSUAL",
    isActive: true,
    nextPayment: "2025-01-15",
  },
  {
    id: "2",
    name: "Plan Bimestral",
    description: "Descuento por pago bimestral",
    amount: 85000,
    frequency: "BIMESTRAL",
    isActive: true,
    nextPayment: "2025-02-01",
  },
]

export default function PaymentsStudentPage() {
  const [payments, setPayments] = useState(mockStudentPayments)
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [paymentPlans, setPaymentPlans] = useState(mockPaymentPlans)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [isPaymentDetailOpen, setIsPaymentDetailOpen] = useState(false)
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false)

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-100 text-green-800">Pagado</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "OVERDUE":
        return <Badge className="bg-red-100 text-red-800">Atrasado</Badge>
      case "PROCESSING":
        return <Badge className="bg-blue-100 text-blue-800">Procesando</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const getPaymentMethodInfo = (method: string) => {
    const methods = {
      "MERCADO_PAGO": { name: "Mercado Pago", icon: QrCode },
      "TRANSFER": { name: "Transferencia", icon: Building2 },
      "CASH": { name: "Efectivo", icon: Banknote },
      "CREDIT_CARD": { name: "Tarjeta", icon: CreditCard },
      "DEBIT_CARD": { name: "Tarjeta de Débito", icon: Smartphone },
    }
    return methods[method as keyof typeof methods] || { name: method, icon: CreditCard }
  }

  const getTotalPaid = () => {
    return payments
      .filter(p => p.status === "PAID")
      .reduce((sum, p) => sum + p.amount, 0)
  }

  const getPendingAmount = () => {
    return payments
      .filter(p => p.status === "PENDING" || p.status === "OVERDUE")
      .reduce((sum, p) => sum + p.amount, 0)
  }

  const getNextPayment = () => {
    const pendingPayments = payments
      .filter(p => p.status === "PENDING")
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    
    return pendingPayments[0]
  }

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment)
    setIsPaymentDetailOpen(true)
  }

  const handlePayNow = (payment: any) => {
    setSelectedPayment(payment)
    setIsPaymentMethodOpen(true)
  }

  const nextPayment = getNextPayment()

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Pagos</h1>
          <p className="text-muted-foreground">
            Gestiona tus pagos y métodos de pago
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pagado
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${getTotalPaid().toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Histórico total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pendiente de Pago
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                ${getPendingAmount().toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {payments.filter(p => p.status === "PENDING").length} pagos pendientes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Próximo Pago
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {nextPayment ? `$${nextPayment.amount.toLocaleString()}` : "$0"}
              </div>
              <p className="text-xs text-muted-foreground">
                {nextPayment ? `Vence: ${nextPayment.dueDate}` : "Sin pagos pendientes"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Plan Activo
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {paymentPlans.filter(p => p.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Planes de pago activos
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payments">Historial de Pagos</TabsTrigger>
            <TabsTrigger value="pending">Pagos Pendientes</TabsTrigger>
            <TabsTrigger value="methods">Métodos de Pago</TabsTrigger>
            <TabsTrigger value="plans">Planes de Pago</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pagos</CardTitle>
                <CardDescription>
                  Todos tus pagos realizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments
                      .filter(p => p.status === "PAID")
                      .sort((a, b) => new Date(b.paidAt!).getTime() - new Date(a.paidAt!).getTime())
                      .map((payment) => {
                        const methodInfo = getPaymentMethodInfo(payment.method)
                        return (
                          <TableRow key={payment.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{payment.description}</div>
                                <div className="text-sm text-muted-foreground">
                                  Vencimiento: {payment.dueDate}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                ${payment.amount.toLocaleString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <methodInfo.icon className="h-4 w-4" />
                                <span>{methodInfo.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getPaymentStatusBadge(payment.status)}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {payment.paidAt}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewPayment(payment)}
                                >
                                  <Receipt className="h-4 w-4" />
                                </Button>
                                {payment.paymentLink && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(payment.paymentLink, '_blank')}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
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
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pagos Pendientes</CardTitle>
                <CardDescription>
                  Pagos que necesitas realizar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments
                    .filter(p => p.status === "PENDING" || p.status === "OVERDUE")
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .map((payment) => {
                      const methodInfo = getPaymentMethodInfo(payment.method)
                      const isOverdue = new Date(payment.dueDate) < new Date()
                      
                      return (
                        <div key={payment.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-medium">{payment.description}</h3>
                              <div className="text-sm text-muted-foreground">
                                Vencimiento: {payment.dueDate}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold">
                                ${payment.amount.toLocaleString()}
                              </span>
                              {isOverdue ? (
                                <Badge className="bg-red-100 text-red-800">Atrasado</Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              Método de pago sugerido: {methodInfo.name}
                            </div>
                            
                            <div className="flex space-x-2">
                              {payment.paymentLink ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(payment.paymentLink, '_blank')}
                                >
                                  <QrCode className="h-4 w-4 mr-1" />
                                  Pagar Ahora
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handlePayNow(payment)}
                                >
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  Pagar Ahora
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewPayment(payment)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  
                  {payments.filter(p => p.status === "PENDING" || p.status === "OVERDUE").length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                      <p className="text-lg font-medium">¡No tienes pagos pendientes!</p>
                      <p className="text-sm">Todos tus pagos están al día</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="methods" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago Disponibles</CardTitle>
                <CardDescription>
                  Elige el método que prefieras para realizar tus pagos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <method.icon className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-medium">{method.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            {method.description}
                          </div>
                        </div>
                        {method.enabled ? (
                          <Badge className="bg-green-100 text-green-800">Activo</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
                        )}
                      </div>
                      
                      {method.enabled && (
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Configurar
                          </Button>
                          <Button size="sm" className="flex-1">
                            Usar Método
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="plans" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mis Planes de Pago</CardTitle>
                <CardDescription>
                  Planes de pago activos y disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-3">Planes Activos</h3>
                    <div className="space-y-3">
                      {paymentPlans.filter(p => p.isActive).map((plan) => (
                        <div key={plan.id} className="p-4 border rounded-lg bg-green-50">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{plan.name}</h4>
                              <p className="text-sm text-muted-foreground">{plan.description}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Activo</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold">
                              ${plan.amount.toLocaleString()}/{plan.frequency}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Próximo pago: {plan.nextPayment}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Otros Planes Disponibles</h3>
                    <div className="space-y-3">
                      {paymentPlans.filter(p => !p.isActive).map((plan) => (
                        <div key={plan.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{plan.name}</h4>
                              <p className="text-sm text-muted-foreground">{plan.description}</p>
                            </div>
                            <Badge className="bg-gray-100 text-gray-800">Disponible</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold">
                              ${plan.amount.toLocaleString()}/{plan.frequency}
                            </div>
                            <Button size="sm">
                              Activar Plan
                            </Button>
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

        {/* Payment Detail Dialog */}
        <Dialog open={isPaymentDetailOpen} onOpenChange={setIsPaymentDetailOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Detalle del Pago</DialogTitle>
              <DialogDescription>
                Información completa del pago
              </DialogDescription>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Información del Pago</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Descripción:</span>
                        <span className="font-medium">{selectedPayment.description}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Monto:</span>
                        <span className="font-medium">${selectedPayment.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Estado:</span>
                        {getPaymentStatusBadge(selectedPayment.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Vencimiento:</span>
                        <span>{selectedPayment.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Detalles de Transacción</h4>
                    <div className="space-y-2 text-sm">
                      {selectedPayment.paidAt && (
                        <div className="flex items-center justify-between">
                          <span>Fecha de pago:</span>
                          <span>{selectedPayment.paidAt}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span>Método:</span>
                        <span>{getPaymentMethodInfo(selectedPayment.method).name}</span>
                      </div>
                      {selectedPayment.transactionId && (
                        <div className="flex items-center justify-between">
                          <span>ID Transacción:</span>
                          <span className="font-mono text-xs">{selectedPayment.transactionId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedPayment.paymentLink && (
                  <div>
                    <h4 className="font-medium mb-2">Link de Pago</h4>
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
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsPaymentDetailOpen(false)}
                  >
                    Cerrar
                  </Button>
                  {selectedPayment.paymentLink && (
                    <Button 
                      onClick={() => {
                        window.open(selectedPayment.paymentLink, '_blank')
                        setIsPaymentDetailOpen(false)
                      }}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Pagar
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Payment Method Dialog */}
        <Dialog open={isPaymentMethodOpen} onOpenChange={setIsPaymentMethodOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Seleccionar Método de Pago</DialogTitle>
              <DialogDescription>
                Elige cómo quieres realizar el pago
              </DialogDescription>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Monto a pagar:</span>
                    <span className="text-xl font-bold text-green-600">
                      ${selectedPayment.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedPayment.description}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Métodos de pago disponibles:</h4>
                  
                  {paymentMethods.filter(m => m.enabled).map((method) => (
                    <div key={method.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <method.icon className="h-6 w-6 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {method.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsPaymentMethodOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button>
                    Continuar
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