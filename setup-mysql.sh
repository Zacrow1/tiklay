#!/bin/bash

# Script de configuración para MySQL en Tiklay

echo "🚀 Configurando MySQL para Tiklay..."

# Verificar si MySQL está instalado
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL no está instalado. Por favor, instálalo primero:"
    echo "   Ubuntu/Debian: sudo apt-get install mysql-server"
    echo "   macOS: brew install mysql"
    echo "   Windows: Descargar desde https://dev.mysql.com/downloads/"
    exit 1
fi

# Verificar si el servicio MySQL está corriendo
if ! pgrep mysqld > /dev/null; then
    echo "🔄 Iniciando servicio MySQL..."
    
    # Detectar el sistema operativo
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo systemctl start mysql
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start mysql
    else
        echo "❌ Por favor, inicia MySQL manualmente"
        exit 1
    fi
fi

# Esperar a que MySQL esté disponible
echo "⏳ Esperando a que MySQL esté disponible..."
sleep 3

# Crear base de datos si no existe
echo "📊 Creando base de datos tiklay_db..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS tiklay_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Crear usuario si no existe (opcional)
echo "👤 Creando usuario de la base de datos..."
mysql -u root -p -e "CREATE USER IF NOT EXISTS 'tiklay_user'@'localhost' IDENTIFIED BY 'tiklay_password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON tiklay_db.* TO 'tiklay_user'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"

# Actualizar archivo .env
echo "⚙️  Actualizando archivo .env..."
cat > .env << EOF
# Database Configuration (MySQL)
DATABASE_URL="mysql://tiklay_user:tiklay_password@localhost:3306/tiklay_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tiklay-secret-key-$(date +%s)"

# AI SDK Configuration
ZAI_API_KEY="your-zai-api-key-here"
EOF

echo "✅ Configuración completada!"
echo ""
echo "📋 Resumen:"
echo "   - Base de datos: tiklay_db"
echo "   - Usuario: tiklay_user"
echo "   - Contraseña: tiklay_password"
echo "   - Host: localhost"
echo "   - Puerto: 3306"
echo ""
echo "🔧 Siguientes pasos:"
echo "   1. Ejecutar: npx prisma db push"
echo "   2. Ejecutar: npx prisma generate"
echo "   3. Iniciar la aplicación: npm run dev"
echo ""
echo "🔑 Para conectar a MySQL manualmente:"
echo "   mysql -u tiklay_user -p tiklay_db"
echo "   (Contraseña: tiklay_password)"