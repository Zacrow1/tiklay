"use client"

import { useState } from "react"
import React from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  FileText
} from "lucide-react"

// Mock data para reportes
const financialData = {
  monthlyIncome: [
    { month: "Ene", income: 2450000, expenses: 1800000, profit: 650000 },
    { month: "Feb", income: 2800000, expenses: 1900000, profit: 900000 },
    { month: "Mar", income: 3200000, expenses: 2100000, profit: 1100000 },
    { month: "Abr", income: 2900000, expenses: 1950000, profit: 950000 },
    { month: "May", income: 3400000, expenses: 2200000, profit: 1200000 },
    { month: "Jun", income: 3600000, expenses: 2300000, profit: 1300000 },
  ],
  topPayingStudents: [
    { name: "María García", totalPaid: 270000, lastPayment: "2024-06-15", status: "Al día" },
    { name: "Juan Pérez", totalPaid: 225000, lastPayment: "2024-06-10", status: "Al día" },
    { name: "Ana López", totalPaid: 180000, lastPayment: "2024-06-12", status: "Al día" },
    { name: "Carlos Ruiz", totalPaid: 135000, lastPayment: "2024-05-28", status: "Pendiente" },
    { name: "Laura Martínez", totalPaid: 90000, lastPayment: "2024-06-01", status: "Al día" },
  ],
  expensesByCategory: [
    { category: "Alquiler", amount: 800000, percentage: 35 },
    { category: "Salarios", amount: 600000, percentage: 26 },
    { category: "Servicios", amount: 300000, percentage: 13 },
    { category: "Materiales", amount: 250000, percentage: 11 },
    { category: "Marketing", amount: 200000, percentage: 9 },
    { category: "Otros", amount: 130000, percentage: 6 },
  ]
}

const attendanceData = {
  overallRate: 87,
  byClass: [
    { className: "Yoga - Principiantes", rate: 92, totalStudents: 18, averageAttendance: 16.5 },
    { className: "Yoga - Intermedio", rate: 85, totalStudents: 12, averageAttendance: 10.2 },
    { className: "Pilates", rate: 88, totalStudents: 10, averageAttendance: 8.8 },
    { className: "Meditación", rate: 95, totalStudents: 20, averageAttendance: 19.0 },
    { className: "Yoga Avanzado", rate: 78, totalStudents: 8, averageAttendance: 6.2 },
  ],
  trends: [
    { week: "Sem 1", rate: 85 },
    { week: "Sem 2", rate: 87 },
    { week: "Sem 3", rate: 89 },
    { week: "Sem 4", rate: 87 },
  ]
}

const studentData = {
  totalStudents: 245,
  newStudents: 12,
  inactiveStudents: 8,
  byActivity: [
    { activity: "Yoga - Principiantes", students: 45, percentage: 18 },
    { activity: "Yoga - Intermedio", students: 32, percentage: 13 },
    { activity: "Pilates", students: 28, percentage: 11 },
    { activity: "Meditación", students: 52, percentage: 21 },
    { activity: "Yoga Avanzado", students: 18, percentage: 7 },
    { activity: "Otros", students: 70, percentage: 30 },
  ],
  retention: {
    monthly: 94,
    quarterly: 87,
    yearly: 76
  }
}

const teacherPerformance = [
  { name: "Ana García", students: 45, classes: 12, income: 2025000, rating: 4.8 },
  { name: "Carlos López", students: 28, classes: 8, income: 1120000, rating: 4.6 },
  { name: "María Rodríguez", students: 52, classes: 15, income: 1560000, rating: 4.9 },
  { name: "Laura Sánchez", students: 35, classes: 10, income: 1400000, rating: 4.7 },
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month")
  const [selectedReport, setSelectedReport] = useState("overview")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-600" />
    return null
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
            <p className="text-muted-foreground">
              Análisis detallado del rendimiento del negocio
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Mes Actual</SelectItem>
                <SelectItem value="last-month">Mes Anterior</SelectItem>
                <SelectItem value="current-quarter">Trimestre Actual</SelectItem>
                <SelectItem value="current-year">Año Actual</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <Tabs value={selectedReport} onValueChange={setSelectedReport}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="financial">Financiero</TabsTrigger>
            <TabsTrigger value="attendance">Asistencia</TabsTrigger>
            <TabsTrigger value="students">Estudiantes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPIs Principales */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ingresos del Mes
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(financialData.monthlyIncome[5].income)}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    {getTrendIcon(financialData.monthlyIncome[5].income, financialData.monthlyIncome[4].income)}
                    <span className="ml-1">+5.9% vs mes anterior</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Estudiantes
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentData.totalStudents}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span>+{studentData.newStudents} nuevos este mes</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tasa de Asistencia
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{attendanceData.overallRate}%</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span>+2% vs mes anterior</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Utilidad Neta
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(financialData.monthlyIncome[5].profit)}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span>+8.3% vs mes anterior</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos y Tablas */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Ingresos vs Gastos
                  </CardTitle>
                  <CardDescription>
                    Evolución mensual de ingresos y gastos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {financialData.monthlyIncome.slice(-6).map((data, index) => (
                      <div key={data.month} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{data.month}</span>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">{formatCurrency(data.income)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm">{formatCurrency(data.expenses)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Estudiantes por Actividad
                  </CardTitle>
                  <CardDescription>
                    Distribución de estudiantes por tipo de actividad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentData.byActivity.map((activity) => (
                      <div key={activity.activity} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{activity.activity}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${activity.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {activity.students} ({activity.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actividad Reciente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription>
                  Últimas acciones y eventos importantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nuevo estudiante registrado</p>
                      <p className="text-xs text-muted-foreground">María García - Hace 5 minutos</p>
                    </div>
                    <Badge>Estudiantes</Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pago recibido</p>
                      <p className="text-xs text-muted-foreground">Juan Pérez - {formatCurrency(45000)} - Hace 1 hora</p>
                    </div>
                    <Badge>Finanzas</Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Clase con baja asistencia</p>
                      <p className="text-xs text-muted-foreground">Yoga Avanzado - 78% asistencia - Hace 2 horas</p>
                    </div>
                    <Badge>Asistencia</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Estudiantes por Pagos</CardTitle>
                  <CardDescription>
                    Estudiantes con mayores pagos acumulados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Estudiante</TableHead>
                        <TableHead>Total Pagado</TableHead>
                        <TableHead>Último Pago</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financialData.topPayingStudents.map((student, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{formatCurrency(student.totalPaid)}</TableCell>
                          <TableCell>{student.lastPayment}</TableCell>
                          <TableCell>
                            <Badge variant={student.status === "Al día" ? "default" : "secondary"}>
                              {student.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gastos por Categoría</CardTitle>
                  <CardDescription>
                    Desglose de gastos mensuales por categoría
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {financialData.expensesByCategory.map((expense) => (
                      <div key={expense.category} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{expense.category}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-600 h-2 rounded-full" 
                              style={{ width: `${expense.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatCurrency(expense.amount)} ({expense.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Asistencia por Clase</CardTitle>
                  <CardDescription>
                    Tasa de asistencia promedio por tipo de clase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Clase</TableHead>
                        <TableHead>Tasa de Asistencia</TableHead>
                        <TableHead>Estudiantes</TableHead>
                        <TableHead>Promedio Asistencia</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceData.byClass.map((classData, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{classData.className}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${classData.rate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{classData.rate}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{classData.totalStudents}</TableCell>
                          <TableCell>{classData.averageAttendance.toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tendencia de Asistencia</CardTitle>
                  <CardDescription>
                    Evolución semanal de la tasa de asistencia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {attendanceData.trends.map((trend, index) => (
                      <div key={trend.week} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{trend.week}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${trend.rate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{trend.rate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Retención</CardTitle>
                  <CardDescription>
                    Tasas de retención de estudiantes por período
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Retención Mensual</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${studentData.retention.monthly}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{studentData.retention.monthly}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Retención Trimestral</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${studentData.retention.quarterly}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{studentData.retention.quarterly}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Retención Anual</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${studentData.retention.yearly}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{studentData.retention.yearly}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento de Profesores</CardTitle>
                  <CardDescription>
                    Estadísticas de rendimiento por profesor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Profesor</TableHead>
                        <TableHead>Estudiantes</TableHead>
                        <TableHead>Clases</TableHead>
                        <TableHead>Ingresos</TableHead>
                        <TableHead>Calificación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacherPerformance.map((teacher, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell>{teacher.students}</TableCell>
                          <TableCell>{teacher.classes}</TableCell>
                          <TableCell>{formatCurrency(teacher.income)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">{teacher.rating}</span>
                              <span className="text-yellow-500">★</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}