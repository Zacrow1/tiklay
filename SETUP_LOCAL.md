# Configuración Local del Proyecto Tiklay

## Requisitos Previos

1. **Node.js** (versión 18 o superior)
2. **npm** o **yarn**
3. **Git**

## Pasos de Configuración

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd tiklay
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Database
DATABASE_URL="file:./dev.db"

# Next.js
NEXTAUTH_SECRET="tu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Mercado Pago (opcional)
MERCADO_PAGO_PUBLIC_KEY="TEST-123456789"
MERCADO_PAGO_ACCESS_TOKEN="TEST-987654321"
```

### 4. Configurar la Base de Datos

```bash
# Generar Prisma Client
npx prisma generate

# Crear la base de datos y aplicar el schema
npm run db:push

# (Opcional) Ver la base de datos
npx prisma studio
```

### 5. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

El proyecto estará disponible en: `http://localhost:3000`

## Estructura del Proyecto

```
tiklay/
├── src/
│   ├── app/                    # Páginas de la aplicación
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── students/          # Gestión de estudiantes
│   │   ├── classes/           # Gestión de clases
│   │   ├── finances/          # Gestión financiera
│   │   ├── teacher-payments/  # Pagos de profesores
│   │   ├── events/            # Gestión de eventos
│   │   ├── communication/     # Comunicación interna
│   │   └── settings/          # Configuración
│   ├── components/
│   │   ├── layout/            # Componentes de layout
│   │   └── ui/                # Componentes UI de shadcn
│   ├── hooks/                 # Custom hooks
│   └── lib/                   # Utilidades y configuración
├── prisma/
│   └── schema.prisma         # Esquema de la base de datos
├── public/                   # Archivos estáticos
└── package.json             # Dependencias del proyecto
```

## Funcionalidades Principales

### 1. Sistema de Roles
- **Administrador**: Acceso completo a todas las funcionalidades
- **Profesor**: Acceso a sus estudiantes, clases y pagos
- **Estudiante**: Acceso a sus clases y pagos

### 2. Gestión de Estudiantes
- CRUD completo de estudiantes
- Búsqueda y filtrado
- Inscripción a clases

### 3. Gestión de Clases
- Programación de clases
- Control de asistencia
- Gestión de horarios

### 4. Sistema Financiero
- Pagos de estudiantes
- Gastos operativos
- **Pagos automáticos de profesores**
- Balance general

### 5. Pagos de Profesores (Nueva Funcionalidad)
- Cálculo automático considerando:
  - Porcentaje del espacio
  - Costo del servicio médico por alumno
- Desglose transparente de pagos
- Integración con el balance general

### 6. Configuración
- Configuración de métodos de pago
- Porcentajes por profesor
- Costo del servicio médico

## Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción

# Base de Datos
npm run db:push      # Sincronizar schema con la base de datos
npx prisma generate  # Generar Prisma Client
npx prisma studio    # Abrir Prisma Studio

# Código
npm run lint         # Verificar calidad del código
npm run format       # Formatear código (si está configurado)
```

## Resolución de Problemas Comunes

### 1. Error de Base de Datos
Si encuentras errores de base de datos:
```bash
# Eliminar la base de datos existente
rm dev.db

# Volver a crearla
npm run db:push
```

### 2. Errores de Dependencias
```bash
# Limpiar caché de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### 3. Errores de Prisma
```bash
# Regenerar Prisma Client
npx prisma generate

# Verificar el schema
npx prisma validate
```

## Desarrollo Local

### Acceso como Diferentes Roles
Para probar diferentes roles, puedes modificar temporalmente el hook `useUserRole` en `src/hooks/use-user-role.ts`:

```typescript
export function useUserRole() {
  return { role: "ADMIN" } // Cambiar a "TEACHER" o "STUDENT"
}
```

### Datos de Prueba
El proyecto incluye datos mock para desarrollo. Puedes modificarlos en cada página para probar diferentes escenarios.

### Flujo de Trabajo de Desarrollo
1. Crear una rama para tu feature
2. Hacer los cambios necesarios
3. Probar localmente
4. Ejecutar `npm run lint` para verificar el código
5. Commitear los cambios

## Contribución

Si deseas contribuir al proyecto:
1. Haz un fork del repositorio
2. Crea una rama para tu feature
3. Haz tus cambios
4. Envía un pull request

## Soporte

Si encuentras algún problema o tienes preguntas:
1. Revisa este archivo de configuración
2. Verifica los logs del servidor
3. Revisa la consola del navegador
4. Contacta al equipo de desarrollo

---

¡Listo! Ahora puedes desarrollar el proyecto localmente. Si sigues estos pasos, tendrás el entorno de desarrollo completamente funcional.