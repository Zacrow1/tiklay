# Configuración Local de Tiklay

## 📋 Requisitos Previos

### Software Necesario
- **Node.js** 18 o superior
- **MySQL** 5.7 o superior
- **Git** para control de versiones
- **npm** o **yarn** para gestión de paquetes

### Opcional pero Recomendado
- **MySQL Workbench** o **DBeaver** para gestión visual de la base de datos
- **VS Code** con extensiones para desarrollo web

## 🚀 Instalación y Configuración

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/Zacrow1/tiklay.git
cd tiklay
```

### Paso 2: Configurar MySQL

#### Opción A: Usar el Script Automático (Recomendado)
```bash
# Ejecutar el script de configuración de MySQL
./setup-mysql.sh
```

Este script automáticamente:
- Verifica si MySQL está instalado
- Inicia el servicio MySQL
- Crea la base de datos `tiklay_db`
- Crea un usuario `tiklay_user` con contraseña `tiklay_password`
- Configura los permisos necesarios
- Actualiza el archivo `.env` con las credenciales

#### Opción B: Configuración Manual de MySQL
```bash
# 1. Verificar que MySQL esté instalado y corriendo
mysql --version
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS

# 2. Si no está instalado:
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install mysql-server

# macOS:
brew install mysql
brew services start mysql

# 3. Crear base de datos
mysql -u root -p -e "CREATE DATABASE tiklay_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. Crear usuario (opcional pero recomendado)
mysql -u root -p -e "CREATE USER 'tiklay_user'@'localhost' IDENTIFIED BY 'tiklay_password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON tiklay_db.* TO 'tiklay_user'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"
```

### Paso 3: Configurar Variables de Entorno
```bash
# Copiar el archivo de configuración
cp .env.example .env

# Editar el archivo .env
nano .env
```

Configura las siguientes variables:
```env
# Database Configuration (MySQL)
DATABASE_URL="mysql://tiklay_user:tiklay_password@localhost:3306/tiklay_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tiklay-secret-key-$(date +%s)"

# AI SDK Configuration (opcional)
ZAI_API_KEY="your-zai-api-key-here"
```

### Paso 4: Instalar Dependencias
```bash
# Instalar dependencias de Node.js
npm install

# Instalar dependencia de MySQL
npm install mysql2
```

### Paso 5: Configurar la Base de Datos
```bash
# Generar el cliente de Prisma
npx prisma generate

# Sincronizar el esquema con la base de datos
npx prisma db push

# Verificar que la conexión funciona
npx prisma studio
```

### Paso 6: Iniciar la Aplicación
```bash
# Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## 🔧 Verificación de la Instalación

### 1. Verificar la Base de Datos
```bash
# Conectar a MySQL
mysql -u tiklay_user -p tiklay_db

# Listar tablas (deberías ver las tablas de Prisma)
SHOW TABLES;

# Salir de MySQL
EXIT;
```

### 2. Verificar la Aplicación
- Abre **http://localhost:3000** en tu navegador
- Deberías ver la página de inicio de Tiklay
- Prueba las diferentes secciones: Estudiantes, Clases, Finanzas, etc.

### 3. Probar las Acciones Rápidas
- En el dashboard principal, haz clic en "Acciones Rápidas"
- Prueba crear un estudiante, una actividad, un evento y un pago
- Verifica que los datos se guarden correctamente en la base de datos

## 🛠️ Comandos Útiles

### Desarrollo
```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Compilar para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar linting de código
```

### Base de Datos
```bash
npx prisma db push      # Sincronizar esquema con la base de datos
npx prisma generate     # Generar cliente Prisma
npx prisma studio       # Abrir interfaz visual de la base de datos
npx prisma migrate dev   # Crear migraciones (para desarrollo)
npx prisma migrate reset # Reiniciar base de datos (¡cuidado!)
```

### MySQL
```bash
# Iniciar/detener servicio MySQL
sudo systemctl start mysql   # Linux
sudo systemctl stop mysql    # Linux
brew services start mysql     # macOS
brew services stop mysql      # macOS

# Conectar a MySQL
mysql -u tiklay_user -p tiklay_db

# Backup de la base de datos
mysqldump -u tiklay_user -p tiklay_db > backup.sql

# Restaurar base de datos
mysql -u tiklay_user -p tiklay_db < backup.sql
```

## 🐛 Solución de Problemas

### Problemas Comunes

#### 1. Error de conexión a MySQL
```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql

# Si no está corriendo, iniciarlo
sudo systemctl start mysql

# Verificar las credenciales en .env
mysql -u tiklay_user -p tiklay_db
```

#### 2. Error: "Can't reach database server"
```bash
# Verificar que el puerto 3306 esté abierto
sudo netstat -tlnp | grep :3306

# Si MySQL no está escuchando en localhost, editar my.cnf
sudo nano /etc/mysql/my.cnf
# Asegurarse de que bind-address = 127.0.0.1
sudo systemctl restart mysql
```

#### 3. Error al generar Prisma Client
```bash
# Limpiar y regenerar
rm -rf node_modules/.prisma
npx prisma generate

# Reinstalar dependencias
npm install
```

#### 4. Problemas con permisos de MySQL
```bash
# Otorgar todos los permisos
mysql -u root -p -e "GRANT ALL PRIVILEGES ON tiklay_db.* TO 'tiklay_user'@'localhost'; FLUSH PRIVILEGES;"
```

#### 5. Error de módulos faltantes
```bash
# Limpiar caché e instalar
rm -rf node_modules package-lock.json
npm install
```

### Verificación de Logs

#### Logs de la Aplicación
```bash
# Los logs se guardan en dev.log
tail -f dev.log

# Para ver los últimos 100 líneas
tail -n 100 dev.log
```

#### Logs de MySQL
```bash
# Ver logs de MySQL (Ubuntu/Debian)
sudo tail -f /var/log/mysql/error.log

# macOS
tail -f /usr/local/var/mysql/mysql_error.log
```

## 🔄 Actualización del Proyecto

### Cuando hay cambios en el esquema de la base de datos
```bash
# Actualizar el esquema
npx prisma db push

# Regenerar el cliente
npx prisma generate
```

### Cuando hay nuevas dependencias
```bash
# Instalar nuevas dependencias
npm install

# Si hay problemas de compilación
npm run build
```

## 🎯 Pruebas de Funcionalidad

### 1. Probar Acciones Rápidas
- **Crear Estudiante**: Llena el formulario y verifica que se guarde
- **Crear Actividad**: Prueba con y sin día/horario establecido
- **Crear Evento**: Verifica que la fecha y hora se guarden correctamente
- **Registrar Pago**: Selecciona un estudiante y registra un pago

### 2. Probar la Conexión API
```bash
# Probar conexión a la API de estudiantes
curl http://localhost:3000/api/students

# Probar conexión a la API de actividades
curl http://localhost:3000/api/activities

# Probar conexión a la API de eventos
curl http://localhost:3000/api/events
```

### 3. Probar la Base de Datos
```bash
# Conectar a MySQL y verificar datos
mysql -u tiklay_user -p tiklay_db

# Contar registros en cada tabla
SELECT COUNT(*) as users_count FROM users;
SELECT COUNT(*) as students_count FROM students;
SELECT COUNT(*) as activities_count FROM activities;
SELECT COUNT(*) as events_count FROM events;

# Salir
EXIT;
```

## 📚 Recursos Adicionales

### Documentación
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

### Herramientas Útiles
- **MySQL Workbench**: Herramienta visual para MySQL
- **DBeaver**: Cliente de base de datos multiplataforma
- **Prisma Studio**: Interfaz visual para Prisma
- **Postman**: Para probar APIs

### Comunidad
- [GitHub Issues](https://github.com/Zacrow1/tiklay/issues)
- [Stack Overflow](https://stackoverflow.com/)
- [Discord/Slack]: Canales de comunidad (si están disponibles)

---

¡Listo! Ahora tienes Tiklay funcionando localmente con MySQL. Si encuentras algún problema, revisa la sección de solución de problemas o crea un issue en GitHub.