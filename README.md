# Centro Médico Sur - Sistema de Gestión

Sistema de gestión integral para Centro Médico Sur, desarrollado con React en el frontend y Node.js/Express en el backend.

## 🏗️ Estructura del Proyecto

```
Centro Medico Sur/
├── backend/                 # Servidor Node.js/Express
│   ├── src/
│   │   ├── controllers/    # Controladores de la API
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Rutas de la API
│   │   ├── middlewares/    # Middlewares personalizados
│   │   ├── utils/          # Utilidades y helpers
│   │   └── server.js       # Punto de entrada del servidor
│   ├── package.json
│   └── .env.example
│
└── frontend/               # Aplicación React
    ├── src/
    │   ├── components/     # Componentes reutilizables
    │   ├── pages/          # Páginas de la aplicación
    │   ├── services/       # Servicios API
    │   ├── utils/          # Utilidades
    │   ├── App.jsx         # Componente principal
    │   └── main.jsx        # Punto de entrada
    ├── package.json
    └── vite.config.js
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn

### Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Editar el archivo `.env` con tus configuraciones

5. Iniciar el servidor:
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:5000`

### Frontend

1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Iniciar la aplicación:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **Helmet** - Seguridad HTTP
- **CORS** - Manejo de CORS
- **Morgan** - Logger de peticiones
- **dotenv** - Variables de entorno

### Frontend
- **React 18** - Librería UI
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **TailwindCSS** - Framework CSS
- **Lucide React** - Iconos

## 📝 Scripts Disponibles

### Backend
- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon

### Frontend
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción

## 🔐 Variables de Entorno

### Backend (.env)
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```
### Frontend (.env)
VITE_API_URL=http://localhost:5000

Todos los derechos reservados - Centro Médico Sur
