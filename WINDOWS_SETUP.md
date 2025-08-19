# Windows Setup Guide

## 🚀 Configuración para Windows

### Problemas Comunes y Soluciones

#### 1. Error: "tee" no se reconoce como comando

El comando `tee` no está disponible nativamente en Windows. Tenemos varias soluciones:

**Opción A: Usar scripts sin logging (Recomendado)**
```bash
# Para desarrollo (sin archivo de log)
npm run dev

# Para producción (sin archivo de log)  
npm run start
```

**Opción B: Usar scripts con logging (Windows compatible)**
```bash
# Para desarrollo con logging
npm run dev:log

# Para producción con logging
npm run start:log
```

**Opción C: Usar archivos batch**
```bash
# Desarrollo con logging (usa tee si está disponible)
dev-with-log.bat

# Producción con logging
start-with-log.bat
```

#### 2. Instalar Git Bash para tener comandos Unix

Si prefieres tener comandos como `tee` en Windows:

1. **Instalar Git Bash**:
   - Descargar desde: https://git-scm.com/download/win
   - Instalar con opciones por defecto
   - Asegurarse de seleccionar "Git Bash Here" en las opciones

2. **Usar Git Bash**:
   - Abrir Git Bash en lugar de CMD/PowerShell
   - Navegar al proyecto: `cd /f/ApptiklayZ/tiklay`
   - Ejecutar: `npm run dev`

#### 3. Instalar Windows Subsystem for Linux (WSL)

Para una experiencia completa de Linux en Windows:

1. **Instalar WSL**:
   ```powershell
   # En PowerShell como Administrador
   wsl --install
   ```

2. **Usar WSL**:
   - Abrir Ubuntu (o tu distro preferida)
   - Navegar al proyecto: `cd /mnt/f/ApptiklayZ/tiklay`
   - Ejecutar: `npm run dev`

### 🛠️ Configuración Recomendada para Windows

#### Variables de Entorno
Crear archivo `.env`:
```env
# Base de datos
DATABASE_URL="mysql://username:password@localhost:3306/tiklay_db"

# Next.js
NODE_ENV="development"
PORT="3000"

# Autenticación
NEXTAUTH_SECRET="tu-secret-seguro-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

#### Prerrequisitos
1. **Node.js 18+**: Descargar desde https://nodejs.org
2. **MySQL**: Descargar desde https://dev.mysql.com/downloads/installer/
3. **Git**: Descargar desde https://git-scm.com/download/win

### 📝 Comandos Útiles para Windows

#### Desarrollo
```bash
# Instalar dependencias
npm install

# Generar Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Iniciar desarrollo (sin log)
npm run dev

# Iniciar desarrollo con log
npm run dev:log
```

#### Producción
```bash
# Construir aplicación
npm run build

# Iniciar producción (sin log)
npm run start

# Iniciar producción con log
npm run start:log
```

#### Base de Datos
```bash
# Crear migración
npm run db:migrate

# Resetear base de datos
npm run db:reset

# Generar cliente Prisma
npm run db:generate
```

### 🔧 Solución de Problemas

#### Problemas de Puertos
Si el puerto 3000 está ocupado:
```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :3000

# Matar el proceso (reemplazar PID con el número encontrado)
taskkill /PID <PID> /F
```

#### Problemas de Permisos
Ejecutar PowerShell/CMD como Administrador si tienes problemas de permisos.

#### Problemas de Node.js
Asegurarte de usar la versión correcta:
```bash
# Verificar versión
node --version
npm --version

# Debe ser Node.js 18+ y npm 8+
```

#### Problemas de MySQL
Asegurarte de que MySQL esté running:
```bash
# En CMD
net start mysql

# O desde Services.msc
# Buscar "MySQL" y asegurarse de que esté "Running"
```

### 🚀 Electron en Windows

Para ejecutar la versión desktop:

```bash
# Desarrollo Electron
npm run electron-dev

# Construir para Windows
npm run electron-build:win
```

#### Requisitos para Electron en Windows
- Windows 10+ (64-bit)
- Node.js 18+
- Visual Studio Build Tools (para compilar módulos nativos)

### 📞 Ayuda

Si sigues teniendo problemas:
1. Revisa este archivo de configuración
2. Abre un issue en: https://github.com/Zacrow1/tiklay/issues
3. Contacta al equipo de desarrollo

---

**Nota**: Para la mejor experiencia de desarrollo en Windows, se recomienda usar VS Code con las extensiones de ESLint, Prettier y Git integrado.