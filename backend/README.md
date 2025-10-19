# Backend - Centro Médico Sur API

API REST para el sistema de gestión del Centro Médico Sur.

## Endpoints Disponibles

### Health Check
- `GET /health` - Verifica el estado del servidor

### API Base
- `GET /api` - Información de la API

## Estructura de Directorios

```
src/
├── controllers/    # Lógica de negocio
├── models/         # Modelos de datos
├── routes/         # Definición de rutas
├── middlewares/    # Middlewares personalizados
├── utils/          # Funciones auxiliares
└── server.js       # Configuración del servidor
```

## Agregar Nuevas Rutas

1. Crear el archivo de rutas en `src/routes/`
2. Crear el controlador en `src/controllers/`
3. Importar y registrar en `src/routes/index.js`

Ejemplo:
```javascript
// src/routes/patients.routes.js
const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patients.controller');

router.get('/', patientsController.getAll);
router.post('/', patientsController.create);

module.exports = router;

// src/routes/index.js
const patientsRoutes = require('./patients.routes');
router.use('/patients', patientsRoutes);
```

## Seguridad

El servidor incluye:
- **Helmet** - Headers de seguridad HTTP
- **CORS** - Configurado para el frontend
- **Express.json()** - Límite de payload configurado

## Desarrollo

```bash
npm run dev
```

El servidor se reiniciará automáticamente con nodemon cuando detecte cambios.
