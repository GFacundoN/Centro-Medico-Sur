import { useState, useEffect } from 'react';
import { Users, Calendar, AlertCircle, Clock, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { turnoService } from '../services/turnoService';
import { emergenciaService } from '../services/emergenciaService';
import { listaEsperaService } from '../services/listaEsperaService';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    turnosHoy: 0,
    emergenciasActivas: 0,
    listaEspera: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [turnos, emergencias, listaEspera] = await Promise.all([
        turnoService.getAll(today),
        emergenciaService.getActivas(),
        listaEsperaService.getActivas()
      ]);

      setStats({
        turnosHoy: turnos.length,
        emergenciasActivas: emergencias.length,
        listaEspera: listaEspera.length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Turnos Hoy',
      value: stats.turnosHoy,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Emergencias Activas',
      value: stats.emergenciasActivas,
      icon: AlertCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Lista de Espera',
      value: stats.listaEspera,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Bienvenido, {user?.nombre}
            </h2>
            <p className="text-gray-600 mt-1">
              Rol: <span className="font-medium capitalize">{user?.rol}</span>
            </p>
          </div>
          <Activity className="h-12 w-12 text-primary-600" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-8 w-8 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(user?.rol === 'recepcion' || user?.rol === 'admin') && (
            <>
              <a
                href="/pacientes"
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <Users className="h-6 w-6 text-primary-600 mr-3" />
                <span className="font-medium text-gray-900">Gestionar Pacientes</span>
              </a>
              <a
                href="/turnos"
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <Calendar className="h-6 w-6 text-primary-600 mr-3" />
                <span className="font-medium text-gray-900">Gestionar Turnos</span>
              </a>
            </>
          )}
          {(user?.rol === 'profesional' || user?.rol === 'recepcion' || user?.rol === 'admin') && (
            <a
              href="/emergencias"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <AlertCircle className="h-6 w-6 text-primary-600 mr-3" />
              <span className="font-medium text-gray-900">Ver Emergencias</span>
            </a>
          )}
          {(user?.rol === 'recepcion' || user?.rol === 'admin') && (
            <a
              href="/lista-espera"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <Clock className="h-6 w-6 text-primary-600 mr-3" />
              <span className="font-medium text-gray-900">Lista de Espera</span>
            </a>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-primary-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sistema de Gestión - Centro Médico Sur
        </h3>
        <p className="text-gray-700">
          Utiliza el menú de navegación para acceder a las diferentes funcionalidades del sistema
          según tu rol de usuario.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
