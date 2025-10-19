import { Activity, Users, Calendar, AlertCircle, Clock, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Activity, roles: ['recepcion', 'profesional', 'admin', 'director'] },
    { path: '/pacientes', label: 'Pacientes', icon: Users, roles: ['recepcion', 'admin'] },
    { path: '/turnos', label: 'Turnos', icon: Calendar, roles: ['recepcion', 'admin'] },
    { path: '/emergencias', label: 'Emergencias', icon: AlertCircle, roles: ['recepcion', 'profesional', 'admin'] },
    { path: '/lista-espera', label: 'Lista Espera', icon: Clock, roles: ['recepcion', 'admin'] }
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(user?.rol));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Centro Médico Sur</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.nombre}</span>
              <button onClick={handleLogout} className="flex items-center text-gray-600 hover:text-gray-900">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <nav className="bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-700 text-white'
                        : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        </nav>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-600 text-sm">
            © 2025 Centro Médico Sur. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
