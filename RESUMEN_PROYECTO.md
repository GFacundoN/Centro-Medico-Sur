# 📋 Resumen del Proyecto - Centro Médico Sur

## 🎯 Descripción General

Sistema de gestión integral para Centro Médico Sur desarrollado con arquitectura cliente-servidor, implementando todos los requerimientos especificados en los diagramas UML proporcionados.

## 🏗️ Arquitectura del Sistema

### Backend (Node.js + Express)
- **Framework**: Express.js 4.18
- **Base de Datos**: MySQL con mysql2
- **Autenticación**: JWT (JSON Web Tokens)
- **Seguridad**: bcrypt para contraseñas, Helmet para headers HTTP
- **Validación**: express-validator
- **Arquitectura**: MVC (Model-View-Controller)

### Frontend (React + Vite)
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM 6
- **HTTP Client**: Axios
- **Estilos**: TailwindCSS 3.4
- **Iconos**: Lucide React
- **Gestión de Estado**: Context API

## 📊 Modelo de Datos Implementado

### Entidades Principales

1. **Usuario**
   - Autenticación y autorización
   - Roles: admin, profesional, recepcion, director
   - Relación con Profesional

2. **Paciente**
   - Datos personales completos
   - DNI único
   - Historial médico

3. **Profesional**
   - Especialidad médica
   - Vinculado a Usuario
   - Gestión de agendas

4. **Agenda**
   - Horarios de atención
   - Asignación de consultorio
   - Duración de turnos configurable

5. **Turno**
   - Estados: reservado, confirmado, cancelado, atendido, no-show
   - Vinculado a paciente y agenda
   - Descripción y duración

6. **Emergencia**
   - Registro de casos urgentes
   - Estados: activa, en_atencion, atendida, derivada
   - Asignación dinámica de profesional y consultorio

7. **ListaEspera**
   - Gestión de pacientes sin turno disponible
   - Estados: activa, asignada, cancelada
   - Orden por fecha de solicitud

8. **Consultorio**
   - Asignado a sectores
   - Disponibilidad para agendas

9. **Sector**
   - Organización por especialidades
   - Cardiología, Pediatría, Traumatología, etc.

10. **Atencion**
    - Registro de consultas médicas
    - Diagnóstico y tratamiento
    - Vinculado a turnos o emergencias

## 🔐 Sistema de Autenticación y Autorización

### Roles y Permisos

| Funcionalidad | Admin | Profesional | Recepción | Director |
|--------------|-------|-------------|-----------|----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Gestionar Pacientes | ✅ | ❌ | ✅ | ❌ |
| Crear/Editar Turnos | ✅ | ❌ | ✅ | ❌ |
| Ver Emergencias | ✅ | ✅ | ✅ | ✅ |
| Gestionar Emergencias | ✅ | ✅ | ✅ | ❌ |
| Lista de Espera | ✅ | ❌ | ✅ | ❌ |
| Gestionar Agendas | ✅ | ❌ | ❌ | ❌ |
| Configurar Sistema | ✅ | ❌ | ❌ | ❌ |
| Ver Reportes | ✅ | ❌ | ❌ | ✅ |

### Flujo de Autenticación

1. Usuario ingresa credenciales
2. Backend valida con bcrypt
3. Genera JWT con rol y datos del usuario
4. Frontend almacena token en localStorage
5. Cada request incluye token en header Authorization
6. Middleware verifica token y permisos
7. Acceso concedido o denegado según rol

## 📱 Funcionalidades Implementadas

### 1. Gestión de Pacientes
- ✅ Alta, baja y modificación (CRUD completo)
- ✅ Búsqueda por DNI, nombre, apellido, email
- ✅ Visualización de historial clínico
- ✅ Datos personales completos
- ✅ Validación de DNI único

### 2. Gestión de Turnos
- ✅ Asignación de turnos a pacientes
- ✅ Selección de profesional y especialidad
- ✅ Fecha y hora específica
- ✅ Estados del turno (reservado, confirmado, cancelado, atendido, no-show)
- ✅ Reprogramación y cancelación
- ✅ Filtrado por fecha
- ✅ Visualización por agenda

### 3. Sistema de Emergencias
- ✅ Registro rápido de emergencias
- ✅ Asignación de profesional y consultorio
- ✅ Estados de atención
- ✅ Priorización de casos activos
- ✅ Historial de emergencias

### 4. Lista de Espera
- ✅ Agregar pacientes sin turno disponible
- ✅ Orden cronológico de solicitudes
- ✅ Gestión de estados (activa, asignada, cancelada)
- ✅ Asignación a turno cuando hay disponibilidad

### 5. Gestión de Agendas
- ✅ Configuración de horarios de profesionales
- ✅ Asignación de consultorios
- ✅ Duración de turnos configurable
- ✅ Visualización por profesional y fecha

### 6. Dashboard y Estadísticas
- ✅ Turnos del día
- ✅ Emergencias activas
- ✅ Cantidad en lista de espera
- ✅ Accesos rápidos según rol
- ✅ Información en tiempo real

## 🔄 Flujos de Trabajo Implementados

### Flujo 1: Asignación de Turno
1. Recepcionista busca o crea paciente
2. Selecciona fecha y profesional deseado
3. Sistema muestra agendas disponibles
4. Recepcionista selecciona horario
5. Sistema crea turno en estado "reservado"
6. Paciente puede confirmar turno (cambio a "confirmado")

### Flujo 2: Atención de Emergencia
1. Recepcionista/Profesional registra emergencia
2. Selecciona paciente y describe motivo
3. Sistema crea registro en estado "activa"
4. Profesional toma la emergencia (estado "en_atencion")
5. Se asigna consultorio disponible
6. Al finalizar, se marca como "atendida"
7. Se registra atención médica con diagnóstico

### Flujo 3: Gestión de Lista de Espera
1. Paciente solicita turno sin disponibilidad
2. Recepcionista agrega a lista de espera
3. Sistema ordena por fecha de solicitud
4. Cuando hay disponibilidad, recepcionista asigna turno
5. Estado cambia a "asignada"
6. Paciente es notificado (funcionalidad base implementada)

## 📡 API REST Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña

### Pacientes
- `GET /api/pacientes` - Listar todos
- `GET /api/pacientes/search?q=` - Buscar
- `GET /api/pacientes/:id` - Obtener uno
- `GET /api/pacientes/:id/historial` - Historial médico
- `POST /api/pacientes` - Crear
- `PUT /api/pacientes/:id` - Actualizar
- `DELETE /api/pacientes/:id` - Eliminar

### Turnos
- `GET /api/turnos` - Listar todos
- `GET /api/turnos?fecha=YYYY-MM-DD` - Filtrar por fecha
- `GET /api/turnos/:id` - Obtener uno
- `GET /api/turnos/paciente/:id` - Por paciente
- `GET /api/turnos/disponibles/:agendaId` - Horarios disponibles
- `POST /api/turnos` - Crear
- `PUT /api/turnos/:id` - Actualizar
- `PATCH /api/turnos/:id/estado` - Cambiar estado
- `DELETE /api/turnos/:id` - Eliminar

### Agendas
- `GET /api/agendas` - Listar todas
- `GET /api/agendas?fecha=&profesionalId=` - Filtrar
- `GET /api/agendas/:id` - Obtener una
- `POST /api/agendas` - Crear
- `PUT /api/agendas/:id` - Actualizar
- `DELETE /api/agendas/:id` - Eliminar

### Emergencias
- `GET /api/emergencias` - Listar todas
- `GET /api/emergencias/activas` - Solo activas
- `GET /api/emergencias/:id` - Obtener una
- `POST /api/emergencias` - Registrar
- `PUT /api/emergencias/:id` - Actualizar
- `PATCH /api/emergencias/:id/estado` - Cambiar estado
- `DELETE /api/emergencias/:id` - Eliminar

### Lista de Espera
- `GET /api/lista-espera` - Listar todas
- `GET /api/lista-espera/activas` - Solo activas
- `POST /api/lista-espera` - Agregar
- `PATCH /api/lista-espera/:id/estado` - Cambiar estado
- `DELETE /api/lista-espera/:id` - Eliminar

### Consultorios y Sectores
- `GET /api/consultorios` - Listar consultorios
- `GET /api/consultorios/sectores/all` - Listar sectores
- `POST /api/consultorios` - Crear consultorio
- `PUT /api/consultorios/:id` - Actualizar
- `DELETE /api/consultorios/:id` - Eliminar

### Profesionales
- `GET /api/profesionales` - Listar todos
- `GET /api/profesionales/:id` - Obtener uno
- `PUT /api/profesionales/:id` - Actualizar

## 🗂️ Estructura de Archivos

```
Centro Medico Sur/
├── database/
│   ├── schema.sql          # Estructura de BD
│   └── seed.sql            # Datos de prueba
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Definición de rutas
│   │   ├── middlewares/    # Auth y validación
│   │   └── server.js
│   ├── scripts/
│   │   └── generateHash.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/     # Componentes reutilizables
    │   ├── context/        # Context API (Auth)
    │   ├── pages/          # Páginas principales
    │   ├── services/       # Servicios API
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── .env.example
```

## 🧪 Datos de Prueba

### Usuarios Creados
- **Admin**: admin@centromedicosur.com
- **Profesional Cardiólogo**: juan.perez@centromedicosur.com
- **Profesional Pediatra**: maria.gonzalez@centromedicosur.com
- **Profesional Traumatólogo**: carlos.rodriguez@centromedicosur.com
- **Recepcionista 1**: ana.martinez@centromedicosur.com
- **Recepcionista 2**: pedro.lopez@centromedicosur.com
- **Director**: director@centromedicosur.com

**Contraseña para todos**: `password123`

### Datos Incluidos
- 10 pacientes de ejemplo
- 3 profesionales con especialidades
- 5 sectores médicos
- 6 consultorios
- Agendas programadas para los próximos días
- Turnos de ejemplo
- Emergencias de prueba
- Registros en lista de espera

## 🔒 Seguridad Implementada

1. **Contraseñas**: Hasheadas con bcrypt (10 rounds)
2. **JWT**: Tokens con expiración configurable
3. **CORS**: Configurado para frontend específico
4. **Helmet**: Headers de seguridad HTTP
5. **Validación**: express-validator en todos los endpoints
6. **Autorización**: Middleware de roles en rutas protegidas
7. **SQL Injection**: Prevención con prepared statements (mysql2)

## 📈 Mejoras Futuras Sugeridas

1. **Notificaciones**: Email/SMS para recordatorios de turnos
2. **Reportes Avanzados**: Gráficos y estadísticas detalladas
3. **Historia Clínica Digital**: Formularios específicos por especialidad
4. **Recetas Electrónicas**: Generación de prescripciones
5. **Integración con Obras Sociales**: Validación de cobertura
6. **App Móvil**: Para pacientes y profesionales
7. **Telemedicina**: Videoconsultas integradas
8. **Backup Automático**: De base de datos
9. **Logs de Auditoría**: Registro de todas las acciones
10. **Multiidioma**: Soporte para múltiples idiomas

## ✅ Cumplimiento de Requerimientos

### Diagrama de Casos de Uso ✅
- Todos los casos de uso implementados
- Actores: Recepcionista, Profesional, Admin, Director
- Funcionalidades según permisos de cada rol

### Diagrama de Clases ✅
- Todas las clases del diagrama implementadas
- Relaciones entre entidades respetadas
- Atributos y métodos según especificación

### Diagrama Entidad-Relación ✅
- Base de datos completa con todas las tablas
- Relaciones (1:1, 1:N, N:M) implementadas
- Claves foráneas y restricciones

### Diagrama de Actividad ✅
- Flujos de trabajo implementados
- Validaciones en cada paso
- Estados y transiciones correctas

## 🎓 Tecnologías y Conceptos Aplicados

- **Arquitectura REST**: API RESTful completa
- **MVC**: Separación de responsabilidades
- **JWT**: Autenticación stateless
- **CRUD**: Operaciones completas en todas las entidades
- **Middleware**: Autenticación y validación
- **Context API**: Gestión de estado global
- **React Hooks**: useState, useEffect, useContext
- **React Router**: Navegación y rutas protegidas
- **Responsive Design**: TailwindCSS
- **SQL**: Queries complejas con JOINs
- **Async/Await**: Manejo de promesas
- **Error Handling**: Try-catch y middleware de errores

## 📞 Soporte

Para dudas o problemas:
1. Revisa `INSTRUCCIONES.md` para instalación
2. Verifica los logs del backend y frontend
3. Consulta la documentación de los endpoints en `/api`

---

**Desarrollado para**: Centro Médico Sur  
**Fecha**: Octubre 2025  
**Versión**: 1.0.0
