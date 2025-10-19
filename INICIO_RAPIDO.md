# 🚀 Inicio Rápido - Centro Médico Sur

## ⚡ Comandos de Instalación Rápida

### 1. Base de Datos (MySQL)

```bash
# Conectarse a MySQL
mysql -u root -p

# Ejecutar scripts (dentro de MySQL)
source database/schema.sql
source database/seed.sql

# O desde la terminal
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de MySQL
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 🔑 Credenciales de Prueba

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| Admin | admin@centromedicosur.com | password123 | Administrador |
| Recepción | ana.martinez@centromedicosur.com | password123 | Recepcionista |
| Médico | juan.perez@centromedicosur.com | password123 | Profesional |
| Director | director@centromedicosur.com | password123 | Director |

## 📍 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API Info**: http://localhost:5000/api

## ✅ Verificación Rápida

### Backend funcionando:
```bash
curl http://localhost:5000/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "message": "Centro Médico Sur API is running"
}
```

### Frontend funcionando:
Abre http://localhost:3000 en tu navegador

## 🐛 Solución Rápida de Problemas

### Error: Cannot connect to database
```bash
# Verifica que MySQL esté corriendo
# Windows:
net start MySQL80

# Verifica credenciales en backend/.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=centro_medico_sur
```

### Error: Port already in use
```bash
# Backend (puerto 5000)
# Cambia PORT en backend/.env

# Frontend (puerto 3000)
# Vite te ofrecerá usar otro puerto automáticamente
```

### Error: Module not found
```bash
# Reinstala dependencias
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 Configuración Mínima

### backend/.env
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=centro_medico_sur
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura
```

### frontend/.env
```env
VITE_API_URL=http://localhost:5000
```

## 🎯 Primeros Pasos en la Aplicación

1. **Login**: http://localhost:3000/login
   - Usa: admin@centromedicosur.com / password123

2. **Dashboard**: Verás estadísticas del día

3. **Crear Paciente**:
   - Ve a "Pacientes" en el menú
   - Click en "Nuevo Paciente"
   - Completa el formulario

4. **Asignar Turno**:
   - Ve a "Turnos"
   - Click en "Nuevo Turno"
   - Selecciona agenda, paciente y horario

5. **Registrar Emergencia**:
   - Ve a "Emergencias"
   - Click en "Nueva Emergencia"
   - Selecciona paciente y describe el motivo

## 📚 Documentación Completa

- **INSTRUCCIONES.md**: Guía detallada de instalación
- **RESUMEN_PROYECTO.md**: Documentación técnica completa
- **README.md**: Información general del proyecto

## 🆘 Ayuda Adicional

Si algo no funciona:

1. Verifica que MySQL esté corriendo
2. Verifica que los puertos 3000 y 5000 estén libres
3. Revisa los logs en la consola del backend y frontend
4. Asegúrate de haber ejecutado `npm install` en ambas carpetas
5. Verifica que los archivos `.env` estén configurados correctamente

---

¡Listo para usar! 🎉
