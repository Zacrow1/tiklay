# Estructura Completa del Proyecto Tiklay

## 📁 Árbol de Directorios Completo

```
tiklay/
├── 📄 README.md                    # Documentación principal
├── 📄 SETUP_LOCAL.md               # Guía de configuración local
├── 📄 PROJECT_STRUCTURE.md        # Este archivo
├── 📄 setup.sh                    # Script de configuración
├── 📄 .env.example               # Variables de entorno ejemplo
├── 📄 .env                       # Variables de entorno (no versionado)
├── 📄 .gitignore                # Archivos ignorados por Git
├── 📄 package.json              # Dependencias y scripts
├── 📄 tsconfig.json             # Configuración TypeScript
├── 📄 tailwind.config.js        # Configuración Tailwind CSS
├── 📄 next.config.js            # Configuración Next.js
├── 📄 eslint.config.js         # Configuración ESLint
│
├── 📁 src/                      # Código fuente principal
│   ├── 📁 app/                  # Páginas Next.js 15 (App Router)
│   │   ├── 📄 page.tsx         # Dashboard principal con role-based views
│   │   ├── 📄 layout.tsx       # Layout raíz de la aplicación
│   │   ├── 📄 loading.tsx      # Loading global
│   │   ├── 📄 error.tsx        # Error boundary global
│   │   │
│   │   ├── 📁 students/        # Gestión de estudiantes
│   │   │   ├── 📄 page.tsx     # CRUD completo de estudiantes
│   │   │   ├── 📄 layout.tsx   # Layout específico
│   │   │   └── 📄 loading.tsx  # Loading específico
│   │   │
│   │   ├── 📁 classes/         # Gestión de clases y horarios
│   │   │   ├── 📄 page.tsx     # Programación y asistencia
│   │   │   ├── 📄 layout.tsx   # Layout específico
│   │   │   └── 📄 loading.tsx  # Loading específico
│   │   │
│   │   ├── 📁 finances/        # Gestión financiera completa
│   │   │   ├── 📄 page.tsx     # Balance, pagos y gastos
│   │   │   ├── 📄 layout.tsx   # Layout específico
│   │   │   └── 📄 loading.tsx  # Loading específico
│   │   │
│   │   ├── 📁 teacher-payments/ # 🆕 Pagos automáticos de profesores
│   │   │   ├── 📄 page.tsx     # Cálculo y gestión de pagos
│   │   │   ├── 📄 layout.tsx   # Layout específico
│   │   │   └── 📄 loading.tsx  # Loading específico
│   │   │
│   │   ├── 📁 events/          # Gestión de eventos y talleres
│   │   │   ├── 📄 page.tsx     # Creación y gestión de eventos
│   │   │   ├── 📄 layout.tsx   # Layout específico
│   │   │   └── 📄 loading.tsx  # Loading específico
│   │   │
│   │   ├── 📁 communication/   # Sistema de mensajería interno
│   │   │   ├── 📄 page.tsx     # Chat y notificaciones
│   │   │   ├── 📄 layout.tsx   # Layout específico
│   │   │   └── 📄 loading.tsx  # Loading específico
│   │   │
│   │   ├── 📁 settings/        # Configuración del sistema
│   │   │   ├── 📄 page.tsx     # Configuración general y pagos
│   │   │   ├── 📄 layout.tsx   # Layout específico
│   │   │   └── 📄 loading.tsx  # Loading específico
│   │   │
│   │   ├── 📁 my-students/     # Vista específica para profesores
│   │   │   ├── 📄 page.tsx     # Estudiantes asignados al profesor
│   │   │   ├── 📄 layout.tsx   # Layout específico
│   │   │   └── 📄 loading.tsx  # Loading específico
│   │   │
│   │   ├── 📁 my-classes/      # Vista específica para profesores
│   │   │   ├── 📄 page.tsx     # Clases asignadas al profesor
│   │   │   ├── 📄 layout.tsx   # Layout específico
│   │   │   └── 📄 loading.tsx  # Loading específico
│   │   │
│   │   ├── 📁 my-classes-student/ # Vista específica para estudiantes
│   │   │   ├── 📄 page.tsx     # Clases inscritas del estudiante
│   │   │   ├── 📄 layout.tsx   # Layout específico
│   │   │   └── 📄 loading.tsx  # Loading específico
│   │   │
│   │   ├── 📁 payments-student/ # Vista específica para estudiantes
│   │   │   ├── 📄 page.tsx     # Pagos del estudiante
│   │   │   ├── 📄 layout.tsx   # Layout específico
│   │   │   └── 📄 loading.tsx  # Loading específico
│   │   │
│   │   └── 📁 api/            # API Routes
│   │       ├── 📄 auth/        # Rutas de autenticación
│   │       ├── 📄 students/    # API de estudiantes
│   │       ├── 📄 classes/     # API de clases
│   │       ├── 📄 payments/    # API de pagos
│   │       ├── 📄 teachers/    # API de profesores
│   │       └── 📄 socketio/    # WebSocket para tiempo real
│   │
│   ├── 📁 components/          # Componentes React reutilizables
│   │   ├── 📁 layout/          # Componentes de layout
│   │   │   ├── 📄 main-layout.tsx     # Layout principal
│   │   │   ├── 📄 sidebar-nav.tsx     # Navegación lateral
│   │   │   ├── 📄 header.tsx         # Header con navegación
│   │   │   └── 📄 footer.tsx         # Footer de la aplicación
│   │   │
│   │   ├── 📁 ui/              # Componentes UI de shadcn/ui
│   │   │   ├── 📄 button.tsx          # Botón con variantes
│   │   │   ├── 📄 input.tsx           # Input con validación
│   │   │   ├── 📄 card.tsx            # Tarjetas contenedoras
│   │   │   ├── 📄 table.tsx           # Tablas con estilos
│   │   │   ├── 📄 dialog.tsx          # Diálogos modales
│   │   │   ├── 📄 form.tsx            # Componentes de formulario
│   │   │   ├── 📄 select.tsx          # Select con búsqueda
│   │   │   ├── 📄 tabs.tsx            # Pestañas navegables
│   │   │   ├── 📄 badge.tsx           # Insignias de estado
│   │   │   ├── 📄 alert.tsx           # Alertas informativas
│   │   │   ├── 📄 toast.tsx           # Notificaciones toast
│   │   │   ├── 📄 switch.tsx          # Interruptores toggle
│   │   │   └── 📄 ... (más componentes UI)
│   │   │
│   │   ├── 📁 forms/           # Formularios reutilizables
│   │   │   ├── 📄 student-form.tsx    # Formulario de estudiante
│   │   │   ├── 📄 class-form.tsx      # Formulario de clase
│   │   │   ├── 📄 payment-form.tsx    # Formulario de pago
│   │   │   └── 📄 teacher-form.tsx    # Formulario de profesor
│   │   │
│   │   ├── 📁 charts/          # Componentes de gráficos
│   │   │   ├── 📄 revenue-chart.tsx   # Gráfico de ingresos
│   │   │   ├── 📄 attendance-chart.tsx # Gráfico de asistencia
│   │   │   └── 📄 financial-chart.tsx # Gráfico financiero
│   │   │
│   │   ├── 📁 dashboard/       # Componentes del dashboard
│   │   │   ├── 📄 stats-card.tsx      # Tarjetas de estadísticas
│   │   │   ├── 📄 recent-activity.tsx # Actividad reciente
│   │   │   └── 📄 quick-actions.tsx   # Acciones rápidas
│   │   │
│   │   └── 📁 common/         # Componentes comunes
│   │       ├── 📄 loading-spinner.tsx # Spinner de carga
│   │       ├── 📄 error-boundary.tsx   # Boundary de errores
│   │       ├── 📄 pagination.tsx       # Paginación
│   │       └── 📄 search-filter.tsx    # Búsqueda y filtros
│   │
│   ├── 📁 hooks/              # Custom React Hooks
│   │   ├── 📄 use-user-role.tsx        # Hook para rol de usuario
│   │   ├── 📄 use-students.tsx        # Hook para gestión de estudiantes
│   │   ├── 📄 use-classes.tsx         # Hook para gestión de clases
│   │   ├── 📄 use-payments.tsx        # Hook para gestión de pagos
│   │   ├── 📄 use-finances.tsx        # Hook para finanzas
│   │   ├── 📄 use-teacher-payments.tsx # Hook para pagos de profesores
│   │   ├── 📄 use-events.tsx          # Hook para gestión de eventos
│   │   ├── 📄 use-communication.tsx   # Hook para comunicación
│   │   ├── 📄 use-toast.tsx           # Hook para notificaciones
│   │   ├── 📄 use-local-storage.tsx    # Hook para localStorage
│   │   └── 📄 use-debounce.tsx         # Hook para debounce
│   │
│   ├── 📁 lib/                # Utilidades y configuración
│   │   ├── 📄 db.ts                 # Cliente de base de datos Prisma
│   │   ├── 📄 auth.ts              # Configuración de autenticación
│   │   ├── 📄 utils.ts             # Funciones utilitarias
│   │   ├── 📄 validations.ts       # Esquemas de validación Zod
│   │   ├── � constants.ts          # Constantes de la aplicación
│   │   ├── 📄 types.ts             # Tipos TypeScript globales
│   │   ├── 📄 socket.ts            # Configuración Socket.io
│   │   ├── 📄 format.ts            # Funciones de formato
│   │   ├── 📄 calculations.ts      # Cálculos financieros
│   │   └── 📄 config.ts            # Configuración de la app
│   │
│   └── 📁 styles/             # Estilos globales
│       ├── 📄 globals.css         # Estilos CSS globales
│       └── 📄 theme.ts            # Configuración de tema
│
├── 📁 prisma/                # Base de datos y ORM
│   ├── 📄 schema.prisma       # Esquema de la base de datos
│   ├── 📄 migrations/         # Migraciones de base de datos
│   └── 📄 seed.ts            # Datos iniciales (opcional)
│
├── 📁 public/                # Archivos estáticos
│   ├── 📁 images/            # Imágenes y assets
│   │   ├── 🖼️ logo.png       # Logo de Tiklay
│   │   ├── 🖼️ favicon.ico    # Favicon
│   │   ├── 🖼️ hero-bg.jpg    # Imagen de fondo
│   │   └── 🖼️ icons/         # Íconos personalizados
│   │
│   ├── 📁 documents/         # Documentos públicos
│   │   ├── 📄 terms.pdf      # Términos y condiciones
│   │   └── 📄 privacy.pdf    # Política de privacidad
│   │
│   ├── 📄 manifest.json      # Manifest para PWA
│   ├── 📄 robots.txt         # Directivas para motores de búsqueda
│   └── 📄 sitemap.xml        # Sitemap para SEO
│
├── 📁 docs/                 # Documentación del proyecto
│   ├── 📄 API.md             # Documentación de la API
│   ├── 📄 DEPLOYMENT.md      # Guía de despliegue
│   ├── 📄 CONTRIBUTING.md    # Guía de contribución
│   └── 📄 TROUBLESHOOTING.md # Solución de problemas
│
└── 📁 tests/                # Pruebas (opcional)
    ├── 📁 __tests__/         # Tests unitarios
    ├── 📁 integration/       # Tests de integración
    └── 📁 e2e/              # Tests end-to-end
```

## 🏗️ Arquitectura del Proyecto

### 1. **Frontend Architecture**
- **Next.js 15** con App Router para routing moderno
- **TypeScript** para tipado seguro y mantenibilidad
- **Tailwind CSS** para estilos rápidos y consistentes
- **shadcn/ui** para componentes UI accesibles y personalizables
- **React Hook Form** con Zod para formularios validados
- **Zustand** para manejo de estado global
- **TanStack Query** para manejo de servidor state

### 2. **Backend Architecture**
- **API Routes** de Next.js para endpoints REST
- **Prisma ORM** con SQLite para desarrollo (PostgreSQL en producción)
- **NextAuth.js** para autenticación y autorización
- **Socket.io** para comunicación en tiempo real
- **Zod** para validación de datos en servidor

### 3. **Database Schema**
```prisma
// Modelos principales
User → Student | Teacher
Activity → ClassSchedule → Enrollment → Attendance
Payment | Expense | TeacherPayment
Event → EventTicket
SystemConfig
```

### 4. **State Management**
- **Global State**: Zustand stores para autenticación y configuración
- **Server State**: TanStack Query para datos de API
- **Local State**: React hooks y context para componentes
- **Real-time Updates**: Socket.io para actualizaciones en vivo

### 5. **Authentication Flow**
```
Login → NextAuth → Role Detection → Redirect to Dashboard
     ↓
JWT Token → API Requests → Role-based Access Control
```

### 6. **Component Hierarchy**
```
MainLayout
├── SidebarNav (role-based)
├── Header
├── Main Content
│   ├── Dashboard Cards
│   ├── Data Tables
│   ├── Forms
│   └── Charts
└── Footer
```

## 🔄 Flujo de Datos

### 1. **User Actions Flow**
```
User Interface → React Component → Hook Call → API Route → Prisma Query → Database
     ↓
Response → Database → Prisma Transform → API Response → Hook Update → Component Re-render
```

### 2. **Real-time Updates Flow**
```
Action → Socket Emit → Server Process → Database Update → Socket Broadcast → Client Update
```

### 3. **Payment Calculation Flow**
```
Teacher Data + Class Data + System Config → Calculation Engine → Payment Breakdown
     ↓
Database Storage → Financial Reports → Dashboard Updates
```

## 🎨 Design System

### 1. **Color Palette**
- **Primary**: Blue (botones, links, elementos principales)
- **Secondary**: Gray (fondos, bordes, texto secundario)
- **Success**: Green (estados positivos, confirmaciones)
- **Warning**: Yellow (alertas, advertencias)
- **Error**: Red (errores, estados negativos)
- **Info**: Blue (información, notificaciones)

### 2. **Typography**
- **Headings**: Inter, bold, responsive sizes
- **Body**: Inter, regular, good readability
- **Monospace**: JetBrains Mono para código y datos

### 3. **Spacing System**
- **Base Unit**: 4px (1rem = 16px)
- **Scale**: 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem
- **Components**: Consistent padding and margins

### 4. **Component Variants**
```typescript
// Button variants
variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
size: "default" | "sm" | "lg" | "icon"

// Card variants
variant: "default" | "outlined" | "elevated"
```

## 🔧 Configuración y Personalización

### 1. **Environment Variables**
```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# External Services
MERCADO_PAGO_PUBLIC_KEY="test-key"
MERCADO_PAGO_ACCESS_TOKEN="test-token"
```

### 2. **Customization Points**
- **Theme**: Modificar `tailwind.config.js`
- **Components**: Extender componentes en `src/components/ui/`
- **API**: Agregar nuevas rutas en `src/app/api/`
- **Database**: Modificar `prisma/schema.prisma`
- **Business Logic**: Agregar funciones en `src/lib/calculations.ts`

### 3. **Build Configuration**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['example.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}
```

## 📦 Scripts y Comandos

### 1. **Development**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code (if configured)
```

### 2. **Database**
```bash
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database
npx prisma studio    # Open database viewer
```

### 3. **Testing** (si se implementa)
```bash
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:cover  # Run tests with coverage
```

---

Esta estructura completa te proporciona una visión detallada de cómo está organizado el proyecto Tiklay, facilitando el desarrollo local y la comprensión del sistema.