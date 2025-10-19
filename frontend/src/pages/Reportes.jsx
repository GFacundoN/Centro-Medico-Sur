import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Activity, FileText } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Reportes() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estadisticas, setEstadisticas] = useState({
    totalPacientes: 0,
    totalTurnos: 0,
    totalEmergencias: 0,
    turnosPorEstado: {},
    emergenciasPorEstado: {},
    profesionalesMasActivos: [],
    pacientesPorMes: [],
    turnosPorProfesional: []
  });

  useEffect(() => {
    // Establecer fechas por defecto
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    setFechaInicio(inicioMes.toISOString().split('T')[0]);
    setFechaFin(hoy.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      loadEstadisticas();
    }
  }, [fechaInicio, fechaFin]);

  const loadEstadisticas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/reportes/estadisticas', {
        params: { fechaInicio, fechaFin }
      });
      setEstadisticas(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const setPeriodoRapido = (tipo) => {
    const hoy = new Date();
    let inicio;
    
    switch(tipo) {
      case 'hoy':
        inicio = hoy;
        break;
      case 'semana':
        inicio = new Date(hoy.setDate(hoy.getDate() - 7));
        break;
      case 'mes':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        break;
      case 'anio':
        inicio = new Date(hoy.getFullYear(), 0, 1);
        break;
      default:
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    }
    
    setFechaInicio(inicio.toISOString().split('T')[0]);
    setFechaFin(new Date().toISOString().split('T')[0]);
    setPeriodo(tipo);
  };

  const canView = user?.rol === 'director' || user?.rol === 'admin';

  if (!canView) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No tiene permisos para acceder a esta sección</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reportes y Estadísticas</h2>
              <p className="text-gray-600">Indicadores de productividad y evolución</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de Periodo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setPeriodoRapido('hoy')}
              className={`px-4 py-2 rounded-lg ${
                periodo === 'hoy' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setPeriodoRapido('semana')}
              className={`px-4 py-2 rounded-lg ${
                periodo === 'semana' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Últimos 7 días
            </button>
            <button
              onClick={() => setPeriodoRapido('mes')}
              className={`px-4 py-2 rounded-lg ${
                periodo === 'mes' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Este mes
            </button>
            <button
              onClick={() => setPeriodoRapido('anio')}
              className={`px-4 py-2 rounded-lg ${
                periodo === 'anio' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Este año
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-gray-700">Desde:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => {
                setFechaInicio(e.target.value);
                setPeriodo('personalizado');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">Hasta:</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => {
                setFechaFin(e.target.value);
                setPeriodo('personalizado');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      ) : (
        <>
          {/* Tarjetas de Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pacientes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas.totalPacientes}</p>
                </div>
                <Users className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Turnos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas.totalTurnos}</p>
                </div>
                <Calendar className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Emergencias</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas.totalEmergencias}</p>
                </div>
                <Activity className="h-12 w-12 text-red-600" />
              </div>
            </div>
          </div>

          {/* Turnos por Estado */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Turnos por Estado</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(estadisticas.turnosPorEstado || {}).map(([estado, cantidad]) => (
                <div key={estado} className="border rounded-lg p-4">
                  <p className="text-sm text-gray-600 capitalize">{estado}</p>
                  <p className="text-2xl font-bold text-gray-900">{cantidad}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergencias por Estado */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Emergencias por Estado</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(estadisticas.emergenciasPorEstado || {}).map(([estado, cantidad]) => (
                <div key={estado} className="border rounded-lg p-4">
                  <p className="text-sm text-gray-600 capitalize">{estado.replace('_', ' ')}</p>
                  <p className="text-2xl font-bold text-gray-900">{cantidad}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Profesionales Más Activos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Profesionales Más Activos</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesional</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turnos Atendidos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emergencias</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(estadisticas.profesionalesMasActivos || []).map((prof, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {prof.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prof.especialidad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prof.turnos_atendidos}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prof.emergencias_atendidas}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Indicadores de Productividad */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <TrendingUp className="inline h-5 w-5 mr-2" />
              Indicadores de Productividad
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600">Tasa de Atención de Turnos</p>
                <p className="text-3xl font-bold text-green-600">
                  {estadisticas.totalTurnos > 0
                    ? Math.round((estadisticas.turnosPorEstado?.atendido || 0) / estadisticas.totalTurnos * 100)
                    : 0}%
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600">Tasa de Cancelación</p>
                <p className="text-3xl font-bold text-red-600">
                  {estadisticas.totalTurnos > 0
                    ? Math.round((estadisticas.turnosPorEstado?.cancelado || 0) / estadisticas.totalTurnos * 100)
                    : 0}%
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600">Emergencias Resueltas</p>
                <p className="text-3xl font-bold text-blue-600">
                  {estadisticas.totalEmergencias > 0
                    ? Math.round((estadisticas.emergenciasPorEstado?.atendida || 0) / estadisticas.totalEmergencias * 100)
                    : 0}%
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600">Promedio Turnos/Día</p>
                <p className="text-3xl font-bold text-purple-600">
                  {fechaInicio && fechaFin
                    ? Math.round(estadisticas.totalTurnos / Math.max(1, Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24))))
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Reportes;