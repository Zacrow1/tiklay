# Tiklay - Sistema de Gestión de Estudio de Yoga

![Tiklay Logo](https://via.placeholder.com/150x50?text=Tiklay)

Tiklay es un sistema de gestión completo para estudios de yoga y fitness, diseñado para centralizar y automatizar todas las operaciones del negocio.

## 🌟 Características Principales

### Gestión de Usuarios
- **Sistema de roles**: Administrador, Profesor, Estudiante
- **Perfiles personalizados** para cada tipo de usuario
- **Control de acceso** basado en roles

### Gestión de Estudiantes
- **CRUD completo** de estudiantes
- **Búsqueda y filtrado** avanzado
- **Inscripción automática** a clases
- **Historial de pagos** y asistencias

### Gestión de Clases
- **Programación de clases** con horarios flexibles
- **Control de asistencia** en tiempo real
- **Gestión de cupos** por clase
- **Asignación de profesores**

### Sistema Financiero
- **Pagos de estudiantes** con múltiples métodos
- **Gastos operativos** categorizados
- **Balance general** automático
- **Reportes financieros** detallados

### 🆕 Pagos Automáticos de Profesores
- **Cálculo automático** considerando:
  - Porcentaje del espacio por profesor
  - Costo del servicio médico por alumno
- **Desglose transparente** de pagos
- **Integración en tiempo real** con el balance
- **Gestión centralizada** desde la interfaz administrativa

### Eventos y Talleres
- **Gestión de eventos** especiales
- **Venta de tickets** online
- **Control de asistentes**
- **Promociones y descuentos**

### Comunicación Interna
- **Sistema de mensajería** integrado
- **Notificaciones automáticas**
- **Comunicación masiva** por roles
- **Reemplazo de WhatsApp** para gestión interna

### Configuración del Sistema
- **Personalización completa** del estudio
- **Configuración de métodos de pago**
- **Ajustes de porcentajes** por profesor
- **Costos configurables** de servicios

## 🚀 Quick Start

### Requisitos
- Node.js 18+
- npm o yarn
- Git
- Rust y Cargo (para Tauri) - [Instalar Rust](https://rustup.rs/)

### Instalación por Sistema Operativo

#### 🪟 Windows
```batch
# Opción 1: Usar el script de configuración (recomendado)
setup-windows.bat

# Opción 2: Instalación manual
npm install

# Instalar Rust (si no está instalado)
# Descargar desde https://rustup.rs/ y ejecutar el instalador

# Configurar base de datos
npm run db:generate

# Iniciar servidor de desarrollo
npm run tauri:dev
# o si hay problemas con PATH:
npx tauri dev
```

#### 🐧 Linux / 🍎 macOS
```bash
# Ejecutar script de configuración
./setup.sh

# Iniciar servidor de desarrollo
npm run dev
```

### Instalación Manual
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 3. Configurar base de datos
npx prisma generate
npm run db:push

# 4. Iniciar desarrollo
npm run dev

# 5. (Opcional) Iniciar aplicación de escritorio con Tauri
npm run tauri:dev
```

## 📁 Estructura del Proyecto

```
tiklay/
├── src/
│   ├── app/                    # Páginas Next.js 15 (App Router)
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── students/          # Gestión de estudiantes
│   │   ├── classes/           # Gestión de clases
│   │   ├── finances/          # Gestión financiera
│   │   ├── teacher-payments/  # 🆕 Pagos de profesores
│   │   ├── events/            # Gestión de eventos
│   │   ├── communication/     # Comunicación interna
│   │   ├── settings/          # Configuración
│   │   ├── my-students/       # Vista de profesores
│   │   ├── my-classes/        # Vista de profesores
│   │   ├── my-classes-student/ # Vista de estudiantes
│   │   └── payments-student/  # Vista de estudiantes
│   ├── components/
│   │   ├── layout/            # Layout components
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utilities y configuración
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
└── docs/                     # Documentación
```

## 🎯 Flujo de Trabajo Principal

### 1. Configuración Inicial
- **Configurar el estudio**: Nombre, dirección, contacto
- **Definir actividades**: Yoga, Pilates, Meditación, etc.
- **Configurar métodos de pago**: Mercado Pago, Transferencia, Efectivo
- **Establecer porcentajes**: Por profesor y costo de servicio médico

### 2. Gestión Diaria
- **Gestionar estudiantes**: Altas, bajas, modificaciones
- **Programar clases**: Asignar profesores, horarios, cupos
- **Registrar asistencias**: Control diario de presencia
- **Procesar pagos**: De estudiantes y a profesores

### 3. Seguimiento Financiero
- **Monitorear ingresos**: Por concepto y período
- **Controlar gastos**: Categorizados y organizados
- **Calcular pagos profesores**: Automáticamente por período
- **Generar reportes**: Balance general y específicos

## 🧮 Cálculo de Pagos de Profesores

El sistema incluye un módulo avanzado para el cálculo automático de pagos a profesores:

### Fórmula de Cálculo
```
Monto Profesor = Ingreso Total - (Porcentaje Espacio + Servicio Médico)

Donde:
• Porcentaje Espacio = Ingreso Total × (Porcentaje del Profesor / 100)
• Servicio Médico = Número de Estudiantes × Costo por Alumno
```

### Ejemplo Práctico
```
Profesor: Ana García
• Ingreso Total: $450.000
• Porcentaje Espacio: 30%
• Estudiantes: 10
• Costo Servicio Médico: $5.000 por alumno

Cálculo:
• Porcentaje Espacio: $450.000 × 30% = $135.000
• Servicio Médico: 10 × $5.000 = $50.000
• Monto Profesor: $450.000 - ($135.000 + $50.000) = $265.000

Transferencia requerida: $135.000 + $50.000 = $185.000
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15** con App Router
- **TypeScript** para tipado seguro
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes UI
- **React Hook Form** con Zod para formularios
- **Lucide React** para íconos

### Backend
- **API Routes** de Next.js
- **Prisma ORM** con SQLite
- **Socket.io** para comunicación en tiempo real
- **NextAuth.js** para autenticación

### Desarrollo
- **ESLint** para calidad de código
- **Prettier** para formato (opcional)
- **Husky** para git hooks (opcional)

## 📊 Métricas y Reportes

### Dashboard Principal
- **Visión general** del estado del negocio
- **Métricas clave** en tiempo real
- **Accesos rápidos** a funciones principales
- **Notificaciones** importantes

### Reportes Financieros
- **Balance general** con todos los ingresos y gastos
- **Reportes por período** (diario, semanal, mensual)
- **Análisis de rentabilidad** por actividad
- **Seguimiento de pagos** pendientes

### Reportes de Operación
- **Ocupación de clases** por horario
- **Retención de estudiantes**
- **Performance de profesores**
- **Ingresos por eventos**

## 🔧 Configuración Avanzada

### Variables de Entorno
```env
# Base de datos
DATABASE_URL="file:./dev.db"

# Autenticación
NEXTAUTH_SECRET="tu-secret-seguro"
NEXTAUTH_URL="http://localhost:3000"

# Mercado Pago
MERCADO_PAGO_PUBLIC_KEY="TEST-123456789"
MERCADO_PAGO_ACCESS_TOKEN="TEST-987654321"

# Z-AI SDK (opcional)
Z_AI_API_KEY="tu-api-key"
```

### Personalización
- **Temas y colores**: Modificar Tailwind config
- **Componentes UI**: Extender shadcn/ui
- **Flujos de trabajo**: Adaptar hooks y lógica
- **Reportes**: Personalizar vistas y datos

## 🚀 Despliegue

### Producción
```bash
# Construir la aplicación
npm run build

# Iniciar servidor de producción
npm start
```

### Base de Datos Producción
```bash
# Cambiar a PostgreSQL en producción
DATABASE_URL="postgresql://user:password@localhost:5432/tiklay"

# Ejecutar migraciones
npx prisma migrate deploy

# Generar cliente
npx prisma generate
```

### Aplicación de Escritorio (Tauri)
```bash
# Construir la aplicación de escritorio
npm run tauri:build

# Los binarios se generarán en src-tauri/target/release/bundle/
```

### 🔧 Solución de Problemas en Windows

#### Problemas Comunes
1. **PATH de Tauri no encontrado**
   ```batch
   # Usar npx en lugar de npm run
   npx tauri dev
   npx tauri build
   ```

2. **Problemas con permisos en Windows**
   ```batch
   # Ejecutar PowerShell como Administrador
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Rust no está en PATH**
   ```batch
   # Agregar Rust al PATH manualmente
   set PATH=%PATH%;%USERPROFILE%\.cargo\bin
   ```

4. **Problemas con la compilación en Windows**
   ```batch
   # Instalar Visual Studio Build Tools
   # Descargar desde: https://visualstudio.microsoft.com/visual-cpp-build-tools/
   # Seleccionar "Desarrollo de escritorio con C++"
   ```

5. **Errores de dependencias de Windows**
   ```batch
   # Limpiar caché de npm
   npm cache clean --force
   
   # Reinstalar dependencias
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   ```

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor:

1. **Haz un fork** del repositorio
2. **Crea una rama** para tu feature (`git checkout -b feature/amazing-feature`)
3. **Commitea tus cambios** (`git commit -m 'Add amazing feature'`)
4. **Push a la rama** (`git push origin feature/amazing-feature`)
5. **Abre un Pull Request**

### Guía de Estilo
- **TypeScript** estricto
- **Componentes funcionales** con hooks
- **Tailwind classes** para estilos
- **ESLint** configuración
- **Comentarios** claros y concisos

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. **Revisa la documentación** en `docs/`
2. **Busca issues existentes** en el repositorio
3. **Crea un nuevo issue** con descripción detallada
4. **Contacta al equipo** de desarrollo

### Contacto
- **Email**: soporte@tiklay.com
- **Documentation**: [Wiki del Proyecto](https://github.com/tu-repo/tiklay/wiki)
- **Issues**: [GitHub Issues](https://github.com/tu-repo/tiklay/issues)

---

## 🎯 Roadmap

### Próximas Features
- [ ] **Móvil App** versión nativa
- [ ] **Integración con Google Calendar**
- [ ] **Sistema de membresías** y suscripciones
- [ ] **Reportes avanzados** con exportación
- [ ] **API pública** para integraciones
- [ ] **Multi-sede** soporte
- [ ] **Advanced Analytics** con dashboards personalizados

### Mejoras Planeadas
- [ ] **UI/UX Redesign** con nuevas tendencias
- [ ] **Performance Optimization** para grandes volúmenes
- [ ] **Offline Support** con PWA
- [ ] **Advanced Search** con filtros complejos
- [ ] **Automated Backup** y recuperación

---

**Desarrollado con ❤️ para la comunidad de yoga y fitness**