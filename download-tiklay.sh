#!/bin/bash

# Script para descargar el proyecto Tiklay completo

echo "🚀 Descargando el proyecto Tiklay..."

# Crear directorio del proyecto
mkdir -p tiklay
cd tiklay

# Descargar y ejecutar el script de creación del proyecto
curl -s https://raw.githubusercontent.com/tu-usuario/tiklay/main/download-project.js -o download-project.js
node download-project.js

# Limpiar
rm download-project.js

# Hacer ejecutable el script de setup
chmod +x setup.sh

echo ""
echo "✅ Proyecto Tiklay descargado completamente!"
echo ""
echo "📁 Los archivos están en el directorio: tiklay/"
echo ""
echo "🚀 Para configurar el proyecto:"
echo "1. cd tiklay"
echo "2. ./setup.sh"
echo "3. npm run dev"
echo ""
echo "🌐 Acceso: http://localhost:3000"