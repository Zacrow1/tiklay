# Guía de Desarrollo en Windows

Esta guía proporciona instrucciones específicas para desarrollar y ejecutar Tiklay en Windows.

## 🚀 Configuración Inicial

### 1. Requisitos Previos

#### Node.js y npm
- Descargar Node.js 18+ desde [https://nodejs.org/](https://nodejs.org/)
- Seleccionar la versión LTS (Long Term Support)
- Asegurarse de que npm esté incluido en la instalación

#### Git
- Descargar Git desde [https://git-scm.com/](https://git-scm.com/)
- Usar las opciones recomendadas durante la instalación

#### Rust y Cargo
- Descargar el instalador desde [https://rustup.rs/](https://rustup.rs/)
- Ejecutar `rustup-init.exe`
- Seleccionar la instalación predeterminada

#### Visual Studio Build Tools (Opcional pero recomendado)
- Descargar desde [https://visualstudio.microsoft.com/visual-cpp-build-tools/](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Seleccionar "Desarrollo de escritorio con C++"
- Esto es necesario para compilar algunas dependencias nativas

### 2. Configuración del Proyecto

#### Método 1: Usar Script Automatizado (Recomendado)
```batch
# Ejecutar el script de configuración
setup-windows.bat
```

#### Método 2: Configuración Manual
```batch
# 1. Clonar o descargar el proyecto
git clone <URL_DEL_REPOSITORIO>
cd tiklay

# 2. Instalar dependencias de Node.js
npm install

# 3. Configurar la base de datos
npm run db:generate

# 4. Probar la compilación
npm run build
```

## 🛠️ Desarrollo Diario

### Iniciar el Servidor de Desarrollo

#### Opción 1: Modo Desarrollo (Web)
```batch
npm run dev
```

#### Opción 2: Modo Desarrollo (Escritorio)
```batch
npm run tauri:dev
# o si hay problemas con PATH:
npx tauri dev
```

### Problemas Comunes y Soluciones

#### 1. Error: "tauri: command not found"
```batch
# Solución: Usar npx
npx tauri dev
npx tauri build
```

#### 2. Error: "cargo: command not found"
```batch
# Solución: Agregar Rust al PATH manualmente
set PATH=%PATH%;%USERPROFILE%\.cargo\bin

# O reiniciar el terminal/PowerShell después de instalar Rust
```

#### 3. Error: "Failed to compile native modules"
```batch
# Solución: Instalar Visual Studio Build Tools
# Descargar desde: https://visualstudio.microsoft.com/visual-cpp-build-tools/
# Seleccionar "Desarrollo de escritorio con C++"
```

#### 4. Error de permisos en Windows
```batch
# Solución: Ejecutar PowerShell como Administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 5. Problemas con el firewall de Windows
```batch
# Permitir Node.js y Tauri en el firewall
# Ir a: Configuración de Windows > Actualización y seguridad > Seguridad de Windows
# > Firewall y protección de red > Permitir una aplicación a través del firewall
# Buscar Node.js y permitir conexiones
```

## 🏗️ Compilación para Producción

### Compilar la Aplicación Web
```batch
npm run build
```

### Compilar la Aplicación de Escritorio
```batch
npm run tauri:build
# o
npx tauri build
```

### Ubicación de los Binarios Compilados
Los archivos compilados se encontrarán en:
```
src-tauri\target\release\bundle\
├── msi/          # Instalador de Windows (.msi)
└── nsis/         # Instalador alternativo (.exe)
```

## 🔧 Configuración de Variables de Entorno

### Crear archivo .env
```batch
# Copiar el archivo de ejemplo
copy .env.example .env
```

### Editar variables de entorno
```env
# Base de datos
DATABASE_URL="file:./dev.db"

# Autenticación
NEXTAUTH_SECRET="tu-secret-seguro"
NEXTAUTH_URL="http://localhost:3000"

# Mercado Pago (opcional)
MERCADO_PAGO_PUBLIC_KEY="TEST-123456789"
MERCADO_PAGO_ACCESS_TOKEN="TEST-987654321"
```

## 📱 Depuración y Troubleshooting

### Habilitar Modo Depuración
```batch
# Para el servidor web
set DEBUG=*
npm run dev

# Para Tauri
set RUST_LOG=debug
npx tauri dev
```

### Limpiar Caché y Reinstalar
```batch
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstalar dependencias
npm install
```

### Verificar Instalaciones
```batch
# Verificar Node.js
node --version
npm --version

# Verificar Rust
rustc --version
cargo --version

# Verificar Tauri
npx tauri --version
```

## 🎯 Consejos para Desarrollo en Windows

### 1. Usar PowerShell en lugar de CMD
PowerShell ofrece mejores características para desarrollo:
```powershell
# Ejemplos de comandos útiles en PowerShell
Get-Command node  # Verificar instalación
Get-ChildItem -Path . -Filter "*.ts" -Recurse  # Buscar archivos TypeScript
```

### 2. Configurar VS Code para Desarrollo
- Instalar extensiones recomendadas:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Rust Analyzer
  - Tauri

### 3. Optimizar Rendimiento
```batch
# Desactivar antivirus en tiempo real para la carpeta del proyecto
# (solo durante el desarrollo, volver a activar después)

# Usar SSD para mejor rendimiento
# Cerrar aplicaciones innecesarias durante el desarrollo
```

### 4. Manejo de Rutas en Windows
```batch
# Usar rutas relativas cuando sea posible
# Evitar rutas con espacios o caracteres especiales
# Usar comillas para rutas con espacios: cd "C:\Mi Proyecto"
```

## 🔄 Actualización del Proyecto

### Actualizar Dependencias
```batch
# Actualizar paquetes npm
npm update

# Actualizar dependencias de Rust
cargo update
```

### Actualizar Tauri
```batch
# Actualizar CLI de Tauri
npm install --save-dev @tauri-apps/cli@latest

# Actualizar dependencias de Tauri en Cargo.toml
# Editar manualmente las versiones en src-tauri/Cargo.toml
```

## 📞 Soporte Adicional

Si encuentras problemas específicos de Windows:

1. **Revisar logs de error** en la consola
2. **Verificar variables de entorno** con `set | findstr NODE`
3. **Probar en un nuevo terminal** después de los cambios
4. **Consultar la documentación oficial**:
   - [Tauri Windows Guide](https://tauri.app/v1/guides/getting-started/setup/windows/)
   - [Rust on Windows](https://rust-lang.github.io/rustup/installation/windows.html)

### Contacto para Soporte Windows
- **Email**: soporte@tiklay.com
- **Issues**: [GitHub Issues](https://github.com/tu-repo/tiklay/issues)
- **Discusión**: [GitHub Discussions](https://github.com/tu-repo/tiklay/discussions)

---

**Nota**: Esta guía está específicamente diseñada para el desarrollo en Windows. Para otras plataformas, consulta la documentación general del proyecto.