const fs = require('fs');
const path = require('path');

// Estructura del proyecto con contenido de archivos
const projectStructure = {
  'README.md': `# Tiklay - Sistema de Gestión de Estudio de Yoga

Tiklay es un sistema de gestión completo para estudios de yoga y fitness, diseñado para centralizar y automatizar todas las operaciones del negocio.

## 🚀 Quick Start

### Requisitos
- Node.js 18+
- npm o yarn
- Git

### Instalación
\`\`\`bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd tiklay

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Configurar base de datos
npx prisma generate
npm run db:push

# 5. Iniciar servidor
npm run dev
\`\`\`

El proyecto estará disponible en: http://localhost:3000
`,

  'SETUP_LOCAL.md': `# Configuración Local del Proyecto Tiklay

## Pasos de Configuración

### 1. Instalar Dependencias
\`\`\`bash
npm install
\`\`\`

### 2. Configurar Variables de Entorno
Crea un archivo \`.env\` en la raíz del proyecto:

\`\`\`env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="tu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

### 3. Configurar la Base de Datos
\`\`\`bash
npx prisma generate
npm run db:push
\`\`\`

### 4. Ejecutar el Servidor
\`\`\`bash
npm run dev
\`\`\`
`,

  '.env.example': `# Database
DATABASE_URL="file:./dev.db"

# Next.js
NEXTAUTH_SECRET="tu-secret-aqui-debe-ser-una-cadena-aleatoria-segura"
NEXTAUTH_URL="http://localhost:3000"

# Mercado Pago (opcional - para pruebas)
MERCADO_PAGO_PUBLIC_KEY="TEST-123456789"
MERCADO_PAGO_ACCESS_TOKEN="TEST-987654321"

# Z-AI Web Dev SDK (opcional)
Z_AI_API_KEY="tu-api-key-aqui"
`,

  'setup.sh': `#!/bin/bash

echo "🚀 Configurando el proyecto Tiklay..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "🔧 Creando archivo .env..."
    cp .env.example .env
fi

# Generar Prisma Client
echo "🗄️  Generando Prisma Client..."
npx prisma generate

# Crear base de datos
echo "🗄️  Creando base de datos..."
npm run db:push

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "Para iniciar el servidor de desarrollo, ejecuta:"
echo "    npm run dev"
`,

  'package.json': `{
  "name": "tiklay",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "nodemon --exec \\"npx tsx server.ts\\" --watch server.ts --watch src --ext ts,tsx,js,jsx 2>&1 | tee dev.log",
    "build": "next build",
    "start": "NODE_ENV=production tsx server.ts 2>&1 | tee server.log",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@hookform/resolvers": "^5.1.1",
    "@mdxeditor/editor": "^3.39.1",
    "@prisma/client": "^6.11.1",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@reactuses/core": "^6.0.5",
    "@tanstack/react-query": "^5.82.0",
    "@tanstack/react-table": "^8.21.3",
    "axios": "^1.10.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.23.2",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.525.0",
    "next": "15.3.5",
    "next-auth": "^4.24.11",
    "next-intl": "^4.3.4",
    "next-themes": "^0.4.6",
    "prisma": "^6.11.1",
    "react": "^19.0.0",
    "react-day-picker": "^9.8.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.60.0",
    "react-markdown": "^10.1.0",
    "react-resizable-panels": "^3.0.3",
    "react-syntax-highlighter": "^15.6.1",
    "recharts": "^2.15.4",
    "sharp": "^0.34.3",
    "socket.io": "^4.8.1",
    "socket.io-client": "^4.8.1",
    "sonner": "^2.0.6",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7",
    "tsx": "^4.20.3",
    "uuid": "^11.1.0",
    "vaul": "^1.1.2",
    "z-ai-web-dev-sdk": "^0.0.10",
    "zod": "^4.0.2",
    "zustand": "^5.0.6"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.3.5",
    "nodemon": "^3.1.10",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.3.5",
    "typescript": "^5"
  }
}`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,

  'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig`,

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`,

  'eslint.config.js': `module.exports = {
  extends: ["next/core-web-vitals"],
}`,

  '.gitignore': `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
dev.db
`,

  'prisma/schema.prisma': `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model SystemConfig {
  id                   String   @id @default(cuid())
  medicalServiceFee   Float    @default(5000.0) // Costo del servicio médico por alumno
  studioName          String?
  studioPhone         String?
  studioEmail         String?
  studioAddress       String?
  studioDescription   String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  @@map("system_configs")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      UserRole @default(STUDENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  studentProfile  Student?
  teacherProfile  Teacher?
  
  @@map("users")
}

model Student {
  id        String @id @default(cuid())
  userId    String @unique
  firstName String
  lastName  String
  phone     String?
  address   String?
  emergencyContact String?
  
  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Relations
  enrollments     Enrollment[]
  payments        Payment[]
  attendances     Attendance[]
  eventTickets    EventTicket[]
  
  @@map("students")
}

model Teacher {
  id          String @id @default(cuid())
  userId      String @unique
  firstName   String
  lastName    String
  phone       String?
  specialty   String?
  hourlyRate  Float?
  spacePercentage Float @default(30.0) // Porcentaje que corresponde al espacio
  
  user        User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Relations
  classSchedules ClassSchedule[]
  teacherPayments TeacherPayment[]
  
  @@map("teachers")
}

model Activity {
  id          String   @id @default(cuid())
  name        String
  description String?
  duration    Int      // in minutes
  price       Float
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  classSchedules ClassSchedule[]
  
  @@map("activities")
}

model ClassSchedule {
  id          String   @id @default(cuid())
  activityId  String
  teacherId   String
  dayOfWeek   Int      // 0-6 (Sunday-Saturday)
  startTime   String   // HH:MM format
  endTime     String   // HH:MM format
  maxStudents Int      @default(20)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  activity    Activity @relation(fields: [activityId], references: [id])
  teacher     Teacher  @relation(fields: [teacherId], references: [id])
  
  // Relations
  enrollments Enrollment[]
  attendances Attendance[]
  
  @@map("class_schedules")
}

model Enrollment {
  id              String   @id @default(cuid())
  studentId       String
  classScheduleId String
  enrolledAt      DateTime @default(now())
  isActive        Boolean  @default(true)
  
  student         Student        @relation(fields: [studentId], references: [id])
  classSchedule   ClassSchedule  @relation(fields: [classScheduleId], references: [id])
  
  @@unique([studentId, classScheduleId])
  @@map("enrollments")
}

model Attendance {
  id           String           @id @default(cuid())
  studentId    String
  classScheduleId String
  date         DateTime
  status       AttendanceStatus @default(PRESENT)
  notes        String?
  
  student      Student         @relation(fields: [studentId], references: [id])
  classSchedule ClassSchedule  @relation(fields: [classScheduleId], references: [id])
  
  @@unique([studentId, classScheduleId, date])
  @@map("attendances")
}

model Payment {
  id          String       @id @default(cuid())
  studentId   String
  amount      Float
  method      PaymentMethod
  status      PaymentStatus @default(PENDING)
  description String?
  dueDate     DateTime?
  paidAt      DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  student     Student      @relation(fields: [studentId], references: [id])
  
  @@map("payments")
}

model Expense {
  id          String    @id @default(cuid())
  description String
  amount      Float
  category    ExpenseCategory
  date        DateTime  @default(now())
  notes       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@map("expenses")
}

model TeacherPayment {
  id                   String   @id @default(cuid())
  teacherId            String
  amount               Float
  period               String   // e.g., "2024-01"
  status               PaymentStatus @default(PENDING)
  paidAt               DateTime?
  studentCount         Int      // Número de estudiantes atendidos en el período
  totalIncome          Float    // Ingreso total generado por el profesor
  spaceShare           Float    // Monto que corresponde al espacio
  medicalServiceTotal  Float    // Total del servicio médico por todos los estudiantes
  teacherShare         Float    // Monto que corresponde al profesor
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  
  teacher              Teacher  @relation(fields: [teacherId], references: [id])
  
  @@map("teacher_payments")
}

model Event {
  id          String   @id @default(cuid())
  title       String
  description String?
  date        DateTime
  startTime   String   // HH:MM format
  endTime     String   // HH:MM format
  location    String?
  maxAttendees Int?
  ticketPrice Float?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  eventTickets EventTicket[]
  
  @@map("events")
}

model EventTicket {
  id          String       @id @default(cuid())
  eventId     String
  studentId   String
  amount      Float
  status      PaymentStatus @default(PENDING)
  purchasedAt DateTime?
  createdAt   DateTime     @default(now())
  
  event       Event        @relation(fields: [eventId], references: [id])
  student     Student      @relation(fields: [studentId], references: [id])
  
  @@unique([eventId, studentId])
  @@map("event_tickets")
}

enum UserRole {
  ADMIN
  TEACHER
  STUDENT
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  EXCUSED
}

enum PaymentMethod {
  CASH
  TRANSFER
  MERCADO_PAGO
  CREDIT_CARD
  DEBIT_CARD
}

enum PaymentStatus {
  PENDING
  PAID
  CANCELLED
  OVERDUE
}

enum ExpenseCategory {
  RENT
  UTILITIES
  SALARIES
  MATERIALS
  MAINTENANCE
  MARKETING
  OTHER
}`,
};

// Función para crear directorios recursivamente
function createDirectory(dirPath) {
  const directories = dirPath.split(path.sep);
  let currentPath = '';
  
  for (const directory of directories) {
    currentPath = path.join(currentPath, directory);
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
  }
}

// Función para crear archivos
function createFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    createDirectory(dir);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// Crear estructura del proyecto
function createProjectStructure() {
  console.log('🚀 Creando estructura del proyecto Tiklay...');
  
  // Crear archivos raíz
  Object.entries(projectStructure).forEach(([filePath, content]) => {
    createFile(filePath, content);
    console.log(`✅ Creado: ${filePath}`);
  });
  
  console.log('');
  console.log('🎉 ¡Estructura del proyecto creada exitosamente!');
  console.log('');
  console.log('📋 Próximos pasos:');
  console.log('1. cd tiklay');
  console.log('2. chmod +x setup.sh');
  console.log('3. ./setup.sh');
  console.log('4. npm run dev');
  console.log('');
  console.log('🌐 El proyecto estará disponible en: http://localhost:3000');
}

// Ejecutar creación del proyecto
createProjectStructure();