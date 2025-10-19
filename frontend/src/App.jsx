import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Pacientes from './pages/Pacientes'
import Turnos from './pages/Turnos'
import Emergencias from './pages/Emergencias'
import ListaEspera from './pages/ListaEspera'
import './App.css'

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/pacientes" element={<PrivateRoute><Layout><Pacientes /></Layout></PrivateRoute>} />
          <Route path="/turnos" element={<PrivateRoute><Layout><Turnos /></Layout></PrivateRoute>} />
          <Route path="/emergencias" element={<PrivateRoute><Layout><Emergencias /></Layout></PrivateRoute>} />
          <Route path="/lista-espera" element={<PrivateRoute><Layout><ListaEspera /></Layout></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
