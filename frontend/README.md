# Frontend - Centro Médico Sur

Aplicación web para el sistema de gestión del Centro Médico Sur.

## Características

- ⚡ Vite para desarrollo rápido
- ⚛️ React 18 con Hooks
- 🎨 TailwindCSS para estilos
- 🧭 React Router para navegación
- 📡 Axios para peticiones HTTP
- 🎯 Lucide React para iconos

## Estructura de Directorios

```
src/
├── components/     # Componentes reutilizables
├── pages/          # Páginas de la aplicación
├── services/       # Servicios API
├── utils/          # Utilidades
├── App.jsx         # Componente raíz
└── main.jsx        # Punto de entrada
```

## Agregar Nuevas Páginas

1. Crear el componente en `src/pages/`
2. Agregar la ruta en `src/App.jsx`

Ejemplo:
```jsx
// src/pages/Patients.jsx
function Patients() {
  return <div>Lista de Pacientes</div>
}

export default Patients

// src/App.jsx
import Patients from './pages/Patients'

<Route path="/patients" element={<Patients />} />
```

## Servicios API

El archivo `src/services/api.js` configura axios con:
- Base URL del backend
- Interceptores de request/response
- Manejo de errores global

Uso:
```javascript
import api from '../services/api'

const response = await api.get('/api/patients')
const data = response.data
```

## Estilos

El proyecto usa TailwindCSS. Los estilos se aplican mediante clases utility:

```jsx
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-bold text-gray-900">Título</h2>
</div>
```

## Desarrollo

```bash
npm run dev
```

La aplicación se recargará automáticamente con Hot Module Replacement (HMR).
