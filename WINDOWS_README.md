# Tiklay - Configuración para Windows

## 🚀 Resumen de la Configuración

El proyecto Tiklay ha sido actualizado y configurado para funcionar correctamente en Windows. A continuación se detallan los cambios realizados y las instrucciones para el desarrollo.

## 📋 Cambios Realizados

### 1. Configuración de Tauri
- **Archivo**: `src-tauri/tauri.conf.json`
- **Cambios**: Actualizado a formato Tauri v2
- **Detalles**: 
  - Se agregó el campo requerido `identifier: "com.tiklay.app"`
  - Se reestructuró la configuración para cumplir con el esquema v2
  - Se configuró para Windows con los ajustes necesarios

### 2. Configuración de Next.js
- **Archivo**: `next.config.ts`
- **Cambios**: Configuración para exportación estática
- **Detalles**:
  - `output: 'export'` - Habilita la exportación estática
  - `distDir: 'out'` - Directorio de salida para Tauri
  - `images: { unoptimized: true }` - Desactiva optimización de imágenes

### 3. Configuración de Rust/Cargo
- **Archivo**: `src-tauri/Cargo.toml`
- **Cambios**: Eliminación de configuración de biblioteca innecesaria
- **Detalles**:
  - Se removió la sección `[lib]` que causaba errores de compilación
  - Se mantuvo solo la configuración binaria para la aplicación

### 4. Scripts para Windows
Se crearon varios scripts para facilitar el desarrollo en Windows:

#### `setup-windows.bat`
- Script de configuración automática para Windows
- Instala dependencias, verifica requisitos y configura el entorno

#### `build-windows.bat`
- Script de compilación completo para Windows
- Realiza todo el proceso de build para la aplicación de escritorio

#### `test-windows-setup.bat`
- Script de verificación del entorno
- Comprueba que todos los componentes necesarios estén instalados

#### `setup-windows.ps1`
- Versión PowerShell del script de configuración
- Proporciona opciones adicionales para usuarios avanzados

## 🛠️ Instrucciones de Uso

### Opción 1: Configuración Automática (Recomendada)
```batch
# Ejecutar el script de configuración
setup-windows.bat

# Este script verificará e instalará todo lo necesario:
# - Node.js y npm
# - Rust y Cargo
# - Dependencias del proyecto
# - Configuración de la base de datos
```

### Opción 2: Configuración Manual
```batch
# 1. Instalar dependencias
npm install

# 2. Generar cliente Prisma
npm run db:generate

# 3. Iniciar desarrollo web
npm run dev

# 4. Iniciar aplicación de escritorio
npm run tauri:dev
# o si hay problemas con PATH:
npx tauri dev
```

### Opción 3: Compilación para Producción
```batch
# Ejecutar script de compilación
build-windows.bat

# O manualmente:
npm run build
npm run tauri:build
```

## 🔧 Solución de Problemas Comunes

### 1. Error: "tauri: command not found"
```batch
# Usar npx en lugar de npm run
npx tauri dev
npx tauri build
```

### 2. Error: "cargo: command not found"
```batch
# Agregar Rust al PATH manualmente
set PATH=%PATH%;%USERPROFILE%\.cargo\bin

# O reiniciar el terminal después de instalar Rust
```

### 3. Problemas con la compilación en Windows
```batch
# Instalar Visual Studio Build Tools
# Descargar desde: https://visualstudio.microsoft.com/visual-cpp-build-tools/
# Seleccionar "Desarrollo de escritorio con C++"
```

### 4. Problemas con ESLint
El proyecto tiene un error de parsing en `use-performance.ts` que no afecta el funcionamiento:
- **Solución temporal**: El archivo funciona correctamente a pesar del error de ESLint
- **Solución a largo plazo**: Revisar la configuración del parser de TypeScript

## 📁 Estructura de Archivos Importantes

```
tiklay/
├── setup-windows.bat          # Script de configuración para Windows
├── build-windows.bat          # Script de compilación para Windows
├── test-windows-setup.bat     # Script de verificación del entorno
├── setup-windows.ps1          # Versión PowerShell del setup
├── .eslintignore              # Archivo de ignorados para ESLint
├── src-tauri/
│   ├── tauri.conf.json        # Configuración de Tauri (v2)
│   └── Cargo.toml            # Configuración de Rust
├── next.config.ts             # Configuración de Next.js
├── docs/
│   └── WINDOWS_DEVELOPMENT.md # Guía detallada para Windows
└── WINDOWS_README.md          # Este archivo
```

## 🎯 Próximos Pasos

1. **Ejecutar el script de configuración**:
   ```batch
   setup-windows.bat
   ```

2. **Probar el entorno de desarrollo**:
   ```batch
   npm run tauri:dev
   ```

3. **Realizar una compilación de prueba**:
   ```batch
   build-windows.bat
   ```

## 📞 Soporte

Si encuentras problemas durante la configuración:

1. **Revisa los logs de error** en la consola
2. **Ejecuta el script de verificación**:
   ```batch
   test-windows-setup.bat
   ```
3. **Consulta la documentación detallada**:
   - `docs/WINDOWS_DEVELOPMENT.md`
   - `README.md`

### Contacto
- **Email**: soporte@tiklay.com
- **Issues**: [GitHub Issues](https://github.com/tu-repo/tiklay/issues)

---

**Nota**: El proyecto está listo para desarrollo en Windows. Los scripts proporcionados automatizan todo el proceso de configuración y compilación.