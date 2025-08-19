# Guía para Publicar Tiklay en GitHub

## Requisitos Previos

1. **Cuenta de GitHub**: Asegúrate de tener una cuenta en [github.com](https://github.com)
2. **Git instalado**: Verifica que Git esté instalado en tu sistema
3. **GitHub CLI (opcional)**: Para facilitar el proceso, puedes instalar GitHub CLI

## Opción 1: Usando GitHub CLI (Recomendado)

### 1. Instalar GitHub CLI

**macOS (Homebrew):**
```bash
brew install gh
```

**Windows (winget):**
```bash
winget install --id GitHub.cli
```

**Linux (Debian/Ubuntu):**
```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

### 2. Autenticarse con GitHub

```bash
gh auth login
```

Sigue las instrucciones para autenticarte con tu cuenta de GitHub.

### 3. Crear repositorio y subir código

```bash
# Crear repositorio en GitHub
gh repo create tiklay --public --description "Sistema de gestión de estudios de yoga/fitness con cálculo automático de pagos" --source=. --remote=origin --push

# O si prefieres crearlo como privado
gh repo create tiklay --private --description "Sistema de gestión de estudios de yoga/fitness con cálculo automático de pagos" --source=. --remote=origin --push
```

## Opción 2: Método Manual (Sin GitHub CLI)

### 1. Crear repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Inicia sesión con tu cuenta
3. Haz clic en el botón "+" en la esquina superior derecha
4. Selecciona "New repository"
5. Completa la información:
   - **Repository name**: `tiklay`
   - **Description**: `Sistema de gestión de estudios de yoga/fitness con cálculo automático de pagos`
   - **Public/Private**: Elige según tu preferencia
   - **No inicializar con README** (ya tenemos uno)
6. Haz clic en "Create repository"

### 2. Conectar y subir código

Ejecuta los siguientes comandos en tu terminal:

```bash
# Añadir el repositorio remoto
git remote add origin https://github.com/TU_USUARIO/tiklay.git

# Cambiar el nombre de la rama a main (si es necesario)
git branch -M main

# Subir el código a GitHub
git push -u origin main
```

Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

## Verificación

Después de subir el código, verifica que:

1. **El repositorio se ha creado correctamente**: Visita `https://github.com/TU_USUARIO/tiklay`
2. **Todos los archivos están presentes**: Deberías ver:
   - `src/` con todo el código fuente
   - `prisma/` con el esquema de la base de datos
   - `package.json` con las dependencias
   - `README.md` con la documentación
   - Archivos de configuración (`.gitignore`, `tailwind.config.ts`, etc.)
3. **El README se muestra correctamente**: GitHub debería renderizar el markdown
4. **Los commits están presentes**: Deberías ver el commit inicial con el mensaje descriptivo

## Próximos Pasos

Una vez que el código esté en GitHub, puedes:

1. **Añadir colaboradores**: En la sección "Settings" > "Collaborators"
2. **Configurar GitHub Pages**: Para documentación estática
3. **Añadir issues**: Para seguimiento de bugs y features
4. **Configurar GitHub Actions**: Para CI/CD automatizado
5. **Añadir un proyecto de GitHub**: Para gestión de proyectos

## Solución de Problemas

### Error: "Permission denied (publickey)"
- Necesitas configurar tus claves SSH en GitHub
- O usa HTTPS en lugar de SSH: `git remote set-url origin https://github.com/TU_USUARIO/tiklay.git`

### Error: "Repository not found"
- Verifica que el nombre del repositorio sea correcto
- Asegúrate de tener permisos para acceder al repositorio

### Error: "Authentication failed"
- Verifica tus credenciales de GitHub
- Si usas token, asegúrate de que tenga los permisos necesarios

## Enlaces Útiles

- [GitHub Documentation](https://docs.github.com/)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)