# Centro Médico Sur - Instrucciones de Instalación y Uso

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **MySQL** 5.7 o superior (o MariaDB)
- **npm** o **yarn**

## 🗄️ Configuración de la Base de Datos

### 1. Crear la Base de Datos

Abre MySQL Workbench o tu cliente MySQL preferido y ejecuta los siguientes scripts en orden:

```bash
# Conéctate a MySQL
mysql -u root -p
```

Luego ejecuta los scripts:

```sql
-- 1. Ejecutar schema.sql (crea la base de datos y tablas)
source database/schema.sql

-- 2. Ejecutar seed.sql (inserta datos de prueba)
source database/seed.sql
```

O desde la línea de comandos:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Usuarios de Prueba Creados

La base de datos incluye los siguientes usuarios de prueba:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@centromedicosur.com | password123 | Admin |
| juan.perez@centromedicosur.com | password123 | Profesional (Cardiólogo) |
| maria.gonzalez@centromedicosur.com | password123 | Profesional (Pediatra) |
| carlos.rodriguez@centromedicosur.com | password123 | Profesional (Traumatólogo) |
| ana.martinez@centromedicosur.com | password123 | Recepción |
| pedro.lopez@centromedicosur.com | password123 | Recepción |
| director@centromedicosur.com | password123 | Director |

**IMPORTANTE:** La contraseña en el script SQL es un hash de bcrypt. Para que funcione correctamente, debes generar el hash real. Por ahora, después de instalar, puedes usar el endpoint de registro para crear usuarios o actualizar manualmente las contraseñas.

## 🔧 Configuración del Backend

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=centro_medico_sur
DB_PORT=3306

# JWT Configuration
JWT_SECRET=tu_clave_secreta_muy_segura_cambiala_en_produccion
JWT_EXPIRES_IN=24h
```

### 3. Iniciar el Servidor Backend

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: **http://localhost:5000**

### 4. Verificar que el Backend Funciona

Abre tu navegador y ve a: **http://localhost:5000/health**

Deberías ver:
```json
{
  "status": "OK",
  "message": "Centro Médico Sur API is running",
  "timestamp": "2025-10-13T..."
}
```

## 🎨 Configuración del Frontend

### 1. Instalar Dependencias

```bash
cd frontend
npm install
```

### 2. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

El archivo `.env` debe contener:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Iniciar la Aplicación Frontend

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## 🚀 Uso del Sistema

### 1. Iniciar Sesión

1. Abre tu navegador en **http://localhost:3000**
2. Serás redirigido a la página de login
3. Usa uno de los usuarios de prueba listados arriba
4. Ejemplo: 
   - Email: `admin@centromedicosur.com`
   - Contraseña: `password123`

### 2. Funcionalidades por Rol

#### **Recepcionista**
- ✅ Ver y gestionar pacientes
- ✅ Crear, editar y cancelar turnos
- ✅ Registrar emergencias
- ✅ Gestionar lista de espera
- ✅ Ver dashboard con estadísticas

#### **Profesional de Salud**
- ✅ Ver dashboard
- ✅ Ver emergencias activas
- ✅ Actualizar estado de emergencias
- ✅ Ver turnos asignados

#### **Administrador**
- ✅ Todas las funcionalidades de recepcionista
- ✅ Crear y gestionar agendas
- ✅ Gestionar consultorios y sectores
- ✅ Eliminar registros
- ✅ Gestionar usuarios

#### **Director**
- ✅ Ver dashboard con estadísticas
- ✅ Consultar reportes
- ✅ Ver información general del sistema

## 📊 Estructura de la Base de Datos

El sistema incluye las siguientes tablas principales:

- **Usuario**: Usuarios del sistema con autenticación
- **Paciente**: Información de pacientes
- **Profesional**: Profesionales de salud (médicos)
- **Sector**: Sectores del centro médico
- **Consultorio**: Consultorios disponibles
- **Agenda**: Horarios de atención de profesionales
- **Turno**: Turnos médicos programados
- **Emergencia**: Casos de emergencia
- **ListaEspera**: Pacientes en espera de turno
- **Atencion**: Registro de atenciones médicas

## 🔐 Seguridad

- Las contraseñas se almacenan hasheadas con bcrypt
- Autenticación mediante JWT (JSON Web Tokens)
- Tokens con expiración configurable
- Validación de permisos por rol en cada endpoint
- CORS configurado para el frontend

## 🛠️ Solución de Problemas

### Error de Conexión a la Base de Datos

```
❌ Database connection failed: Access denied for user
```

**Solución**: Verifica las credenciales en el archivo `.env` del backend

### Error: Cannot find module

```
Error: Cannot find module 'express'
```

**Solución**: Ejecuta `npm install` en la carpeta correspondiente

### Puerto ya en uso

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solución**: 
- Cambia el puerto en el archivo `.env`
- O detén el proceso que está usando el puerto

### Frontend no se conecta al Backend

**Solución**:
- Verifica que el backend esté corriendo
- Verifica la URL en `frontend/.env`
- Revisa la consola del navegador para errores CORS

## 📝 Notas Importantes

1. **Contraseñas de Prueba**: El hash en `seed.sql` es un placeholder. Para testing rápido, usa el endpoint `/api/auth/register` para crear usuarios nuevos.

2. **Datos de Prueba**: El sistema incluye:
   - 7 usuarios de diferentes roles
   - 10 pacientes
   - 3 profesionales con especialidades
   - 6 consultorios
   - Agendas y turnos de ejemplo
   - Emergencias de prueba

3. **Desarrollo**: En modo desarrollo, el backend usa `nodemon` para auto-reload y el frontend usa Vite con HMR (Hot Module Replacement).

## 📞 Endpoints Principales del API

- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario
- `GET /api/pacientes` - Listar pacientes
- `POST /api/pacientes` - Crear paciente
- `GET /api/turnos` - Listar turnos
- `POST /api/turnos` - Crear turno
- `GET /api/emergencias` - Listar emergencias
- `POST /api/emergencias` - Registrar emergencia
- `GET /api/lista-espera` - Ver lista de espera

Para ver todos los endpoints disponibles: **http://localhost:5000/api**

## ✅ Checklist de Instalación

- [ ] MySQL instalado y corriendo
- [ ] Base de datos creada (schema.sql ejecutado)
- [ ] Datos de prueba cargados (seed.sql ejecutado)
- [ ] Backend: dependencias instaladas (`npm install`)
- [ ] Backend: archivo `.env` configurado
- [ ] Backend: servidor corriendo (`npm run dev`)
- [ ] Backend: health check funcionando (http://localhost:5000/health)
- [ ] Frontend: dependencias instaladas (`npm install`)
- [ ] Frontend: archivo `.env` configurado
- [ ] Frontend: aplicación corriendo (`npm run dev`)
- [ ] Frontend: login funcionando con usuario de prueba

¡Listo! El sistema debería estar completamente funcional.
