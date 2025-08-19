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

### 🆕 Acciones Rápidas
- **Creación rápida de estudiantes**: Diálogo modal para registro instantáneo
- **Creación de actividades**: Con opción de establecer día y horario fijo
- **Creación de eventos**: Eventos especiales con fecha, hora y ubicación
- **Registro de pagos**: Múltiples métodos de pago con selección de estudiantes
- **Integración con API**: Todas las acciones se conectan con el backend en tiempo real

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

### 🆕 Aplicación Desktop (Electron)
- **Multi-plataforma**: Windows, macOS y Linux
- **Interfaz nativa** con menús y atajos de teclado
- **Instaladores profesionales**: NSIS (Windows), DMG (macOS), AppImage (Linux)
- **Comunicación segura** entre procesos con IPC
- **Integración con sistema operativo**:
  - Notificaciones nativas
  - Gestión de ventanas nativas
  - Acceso a sistema de archivos
  - Integración con calendario del sistema
- **Funcionalidades offline** con sincronización automática
- **Auto-actualización** automática (próximamente)

#### Atajos de Teclado Desktop
- **Ctrl+N**: Crear nueva actividad
- **Ctrl+E**: Crear nuevo evento
- **F11**: Toggle pantalla completa
- **Ctrl+R**: Recargar aplicación
- **Ctrl+Shift+I**: Abrir herramientas de desarrollador

#### Menú Nativo
- **Archivo**: Nuevo, Guardar, Salir
- **Editar**: Deshacer, Rehacer, Cortar, Copiar, Pegar
- **Vista**: Recargar, Pantalla completa, Herramientas de desarrollador
- **Ayuda**: Documentación, Acerca de

## 🚀 Quick Start

### Requisitos
- Node.js 18+
- npm o yarn
- Git

### Opciones de Ejecución

#### 🌐 Versión Web (Navegador)
```bash
# Clonar el repositorio
git clone https://github.com/Zacrow1/tiklay.git
cd tiklay

# Ejecutar script de configuración
./setup.sh

# Iniciar servidor de desarrollo web
npm run dev
```

#### 💻 Versión Desktop (Electron)
```bash
# Clonar el repositorio
git clone https://github.com/Zacrow1/tiklay.git
cd tiklay

# Ejecutar script de configuración
./setup.sh

# Iniciar aplicación desktop en modo desarrollo
npm run electron-dev
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

# 4. Elegir modo de ejecución
# Para versión web:
npm run dev

# Para versión desktop:
npm run electron-dev
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
│   │   ├── ui/                # shadcn/ui components
│   │   └── electron/          # 🆕 Electron components
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utilities y configuración
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
│   └── icon.png              # 🆕 App icon for Electron
├── docs/                     # Documentación
├── main.js                   # 🆕 Electron main process
├── preload.js                # 🆕 Electron preload script
└── next.config.electron.js   # 🆕 Electron-specific config
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
- **Prisma ORM** con MySQL
- **Socket.io** para comunicación en tiempo real
- **NextAuth.js** para autenticación

### 🆕 Desktop (Electron)
- **Electron 37.3.1** para aplicaciones de escritorio
- **Express.js** integrado para servidor local
- **electron-builder** para empaquetado multiplataforma
- **IPC Communication** para comunicación segura entre procesos
- **Native Menus** y atajos de teclado personalizados

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
# Base de datos MySQL
DATABASE_URL="mysql://username:password@localhost:3306/tiklay_db"

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

### 🌐 Versión Web
```bash
# Construir la aplicación
npm run build

# Iniciar servidor de producción
npm start
```

### 💻 Versión Desktop (Electron)
```bash
# Construir aplicación desktop para desarrollo
npm run electron-build

# Construir para plataformas específicas
npm run electron-build:win    # Windows
npm run electron-build:mac     # macOS
npm run electron-build:linux   # Linux

# Construir para todas las plataformas
npm run electron-build:all
```

#### Distribución Desktop
La aplicación genera instaladores para:
- **Windows**: `.exe` (NSIS installer)
- **macOS**: `.dmg` (DMG image)
- **Linux**: `.AppImage` (portable application)

### Base de Datos Producción
```bash
# Usar MySQL en producción
DATABASE_URL="mysql://user:password@production-host:3306/tiklay_db"

# Ejecutar migraciones
npx prisma migrate deploy

# Generar cliente
npx prisma generate
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
- **Documentation**: [Wiki del Proyecto](https://github.com/Zacrow1/tiklay/wiki)
- **Issues**: [GitHub Issues](https://github.com/Zacrow1/tiklay/issues)
- **Electron Documentation**: [ELECTRON_README.md](./ELECTRON_README.md)
- **Windows Setup Guide**: [WINDOWS_SETUP.md](./WINDOWS_SETUP.md)

---

## 🎯 Roadmap

### Próximas Features
- [x] **Desktop App** versión con Electron ✅
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

### 🆕 Características Desktop (Electron)
- [x] **Multi-plataforma**: Windows, macOS, Linux
- [x] **Menú nativo** con atajos de teclado
- [x] **Notificaciones del sistema**
- [x] **Integración con sistema operativo**
- [x] **Empaquetado profesional** con instaladores
- [ ] **Auto-update** system
- [ ] **Offline mode** con sincronización
- [ ] **Integración con calendario** del sistema

---

**Desarrollado con ❤️ para la comunidad de yoga y fitness**