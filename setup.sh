#!/bin/bash

# Script de configuración para el proyecto Tiklay

echo "🚀 Configurando el proyecto Tiklay para desarrollo local..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18 o superior."
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm."
    exit 1
fi

echo "✅ Node.js y npm están instalados"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas correctamente"

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "🔧 Creando archivo .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Por favor revisa y ajusta las variables de entorno."
else
    echo "ℹ️  El archivo .env ya existe"
fi

# Generar Prisma Client
echo "🗄️  Generando Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Error al generar Prisma Client"
    exit 1
fi

echo "✅ Prisma Client generado correctamente"

# Crear base de datos
echo "🗄️  Creando base de datos..."
npm run db:push

if [ $? -ne 0 ]; then
    echo "❌ Error al crear la base de datos"
    exit 1
fi

echo "✅ Base de datos creada correctamente"

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "Para iniciar el servidor de desarrollo, ejecuta:"
echo "    npm run dev"
echo ""
echo "El proyecto estará disponible en: http://localhost:3000"
echo ""
echo "Para ver la base de datos, ejecuta:"
echo "    npx prisma studio"
echo ""
echo "¡Happy coding! 🚀"