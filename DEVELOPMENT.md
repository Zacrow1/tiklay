# Guía de Desarrollo Local - Tiklay

## 🚀 Configuración Rápida para Desarrollo

### Prerrequisitos
Asegúrate de tener instalado:
- **Node.js** (v18 o superior)
- **npm** o **yarn**
- **Git** (para control de versiones)

### Pasos Iniciales

```bash
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

# 5. Iniciar servidor de desarrollo
npm run dev
```

¡Listo! El proyecto estará corriendo en `http://localhost:3000`

## 🔧 Configuración de Desarrollo

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos (SQLite para desarrollo)
DATABASE_URL="file:./dev.db"

# Next.js y Autenticación
NEXTAUTH_SECRET="development-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Mercado Pago (para pruebas)
MERCADO_PAGO_PUBLIC_KEY="TEST-123456789"
MERCADO_PAGO_ACCESS_TOKEN="TEST-987654321"

# Z-AI Web Dev SDK (opcional)
Z_AI_API_KEY="your-api-key-here"
```

### 2. Acceso con Diferentes Roles

Para probar la aplicación con diferentes roles, puedes modificar temporalmente el hook `useUserRole`:

```typescript
// src/hooks/use-user-role.tsx
export function useUserRole() {
  // Cambia entre "ADMIN", "TEACHER", o "STUDENT"
  return { role: "ADMIN" }
}
```

### 3. Datos de Prueba

El proyecto incluye datos mock para desarrollo. Puedes modificarlos en cada página:

```typescript
// Ejemplo: src/app/students/page.tsx
const mockStudents = [
  {
    id: "1",
    firstName: "María",
    lastName: "García",
    email: "maria.garcia@email.com",
    phone: "+54 11 1234-5678",
    // ... más campos
  },
  // ... más estudiantes
]
```

## 🎯 Flujo de Trabajo de Desarrollo

### 1. Crear una Nueva Funcionalidad

```bash
# Crear rama para tu feature
git checkout -b feature/nueva-funcionalidad

# Hacer cambios en el código
# Modificar archivos necesarios

# Probar localmente
npm run dev

# Verificar calidad del código
npm run lint

# Commitear cambios
git add .
git commit -m "feat: agregar nueva funcionalidad"

# Push a la rama
git push origin feature/nueva-funcionalidad
```

### 2. Estructura de Archivos para Nuevas Páginas

Para agregar una nueva página, sigue esta estructura:

```
src/app/nueva-pagina/
├── page.tsx          # Componente principal de la página
├── layout.tsx        # Layout específico (opcional)
├── loading.tsx       # Componente de carga (opcional)
└── error.tsx         # Manejo de errores (opcional)
```

### 3. Crear Nuevos Componentes

```typescript
// src/components/ui/nuevo-componente.tsx
"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export const NuevoComponente = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("clases-base", className)}
    {...props}
  />
))

NuevoComponente.displayName = "NuevoComponente"
```

## 🗄️ Trabajo con la Base de Datos

### 1. Ver la Base de Datos

```bash
# Abrir Prisma Studio (interfaz visual)
npx prisma studio

# Acceder en: http://localhost:5555
```

### 2. Modificar el Schema

```prisma
// prisma/schema.prisma
model NuevoModelo {
  id        String   @id @default(cuid())
  nombre    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("nuevos_modelos")
}
```

```bash
# Aplicar cambios a la base de datos
npm run db:push

# Regenerar Prisma Client
npx prisma generate
```

### 3. Trabajar con Datos

```typescript
// src/lib/db.ts
import { db } from "@/lib/db"

// Ejemplo: Consultar estudiantes
const estudiantes = await db.student.findMany({
  include: {
    user: true,
    enrollments: true
  }
})

// Ejemplo: Crear nuevo estudiante
const nuevoEstudiante = await db.student.create({
  data: {
    firstName: "Juan",
    lastName: "Pérez",
    user: {
      create: {
        email: "juan.perez@email.com",
        name: "Juan Pérez",
        role: "STUDENT"
      }
    }
  }
})
```

## 🎨 Personalización y Estilos

### 1. Modificar Colores y Tema

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    },
  },
}
```

### 2. Agregar Nuevos Componentes UI

```bash
# Usar el CLI de shadcn/ui
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
```

### 3. Estilos Globales

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }
}

@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }
}
```

## 🔍 Depuración y Testing

### 1. Herramientas de Desarrollo

- **React Developer Tools**: Extensión del navegador
- **Prisma Studio**: Interfaz visual para la base de datos
- **Console Logs**: Para depuración en tiempo real
- **Network Tab**: Para inspeccionar llamadas API

### 2. Depuración Común

```typescript
// Console logs para depuración
console.log("Datos:", data)
console.error("Error:", error)
console.warn("Advertencia:", warning)

// Depuración de componentes
useEffect(() => {
  console.log("Componente montado")
}, [])

// Depuración de estado
const [state, setState] = useState(initialState)
console.log("Estado actual:", state)
```

### 3. Errores Comunes y Soluciones

#### Error: "Module not found"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### Error: "Database connection failed"
```bash
# Verificar archivo .env
# Eliminar y recrear base de datos
rm dev.db
npm run db:push
```

#### Error: "TypeScript errors"
```bash
# Verificar tipos y generar client
npx prisma generate
npm run build
```

## 🚀 Despliegue en Producción

### 1. Build para Producción

```bash
# Construir la aplicación
npm run build

# Iniciar servidor de producción
npm start
```

### 2. Variables de Entorno de Producción

```env
# Usar PostgreSQL en producción
DATABASE_URL="postgresql://user:password@localhost:5432/tiklay_prod"

# Claves seguras
NEXTAUTH_SECRET="super-secret-secure-key"
NEXTAUTH_URL="https://tu-dominio.com"

# Mercado Pago producción
MERCADO_PAGO_PUBLIC_KEY="PROD_PUBLIC_KEY"
MERCADO_PAGO_ACCESS_TOKEN="PROD_ACCESS_TOKEN"
```

### 3. Base de Datos Producción

```bash
# Cambiar a PostgreSQL
# Modificar DATABASE_URL en .env

# Ejecutar migraciones
npx prisma migrate deploy

# Generar cliente
npx prisma generate
```

## 📖 Documentación y Recursos

### 1. Documentación Útil

- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **shadcn/ui Documentation**: https://ui.shadcn.com

### 2. Atajos de Desarrollo

```bash
# Ver todos los scripts disponibles
npm run

# Limpiar caché de npm
npm cache clean --force

# Verificar dependencias desactualizadas
npm outdated

# Actualizar dependencias
npm update
```

### 3. Buenas Prácticas

- **Commits claros**: Usa prefijos como `feat:`, `fix:`, `docs:`
- **Code reviews**: Revisa el código antes de commitear
- **Tests**: Escribe tests para funcionalidades importantes
- **Documentación**: Documenta funciones complejas
- **Tipado**: Usa TypeScript estricto

## 🆘 Soporte y Ayuda

### 1. Problemas Comunes

- **El servidor no inicia**: Verifica las dependencias y el archivo .env
- **Errores de TypeScript**: Ejecuta `npm run build` para ver todos los errores
- **Problemas con la base de datos**: Elimina `dev.db` y ejecuta `npm run db:push`
- **Componentes no se renderizan**: Verifica las importaciones y exportaciones

### 2. Recursos de Ayuda

1. **Revisa este archivo** para soluciones rápidas
2. **Consulta la documentación** en `docs/`
3. **Busca issues existentes** en el repositorio
4. **Pregunta en el canal** de desarrollo del equipo

### 3. Contacto de Desarrollo

- **Slack/Teams**: Canal #desarrollo-tiklay
- **Email**: desarrollo@tiklay.com
- **Issues**: GitHub Issues del proyecto

---

¡Happy coding! 🚀

Recuerda: Este es un entorno de desarrollo. Para producción, asegúrate de cambiar todas las claves y configuraciones por sus versiones seguras.