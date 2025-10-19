import { useState, useEffect } from 'react';
import { AlertCircle, Plus } from 'lucide-react';
import { emergenciaService } from '../services/emergenciaService';
import { pacienteService } from '../services/pacienteService';
import { profesionalService } from '../services/profesionalService';
import { consultorioService } from '../services/consultorioService';
import { useAuth } from '../context/AuthContext';

function Emergencias() {
  const { user } = useAuth();
  const [emergencias, setEmergencias] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id_paciente: '',
    id_profesional: '',
    id_consultorio: '',
    motivo: '',
    estado: 'activa'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      let emergenciasData;
      
      // Si es profesional, solo cargar sus emergencias
      if (user?.rol === 'profesional' && user?.profesional?.id_profesional) {
        emergenciasData = await emergenciaService.getByProfesional(user.profesional.id_profesional);
      } else {
        emergenciasData = await emergenciaService.getAll();
      }
      
      const [pacientesData, profesionalesData, consultoriosData] = await Promise.all([
        pacienteService.getAll(),
        profesionalService.getAll(),
        consultorioService.getAll()
      ]);
      
      setEmergencias(emergenciasData);
      setPacientes(pacientesData);
      setProfesionales(profesionalesData);
      setConsultorios(consultoriosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await emergenciaService.create(formData);
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error al crear emergencia:', error);
      alert(error.response?.data?.error || 'Error al crear emergencia');
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    // Confirmación para marcar como atendida
    if (nuevoEstado === 'atendida') {
      if (!window.confirm('¿Confirma que la emergencia ha sido atendida?')) {
        return; // Cancelar el cambio
      }
    }

    try {
      await emergenciaService.updateEstado(id, nuevoEstado);
      loadData();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar estado');
    }
  };

  const resetForm = () => {
    setFormData({
      id_paciente: '',
      id_profesional: '',
      id_consultorio: '',
      motivo: '',
      estado: 'activa'
    });
  };

  const getEstadoColor = (estado) => {
    const colors = {
      activa: 'bg-red-100 text-red-800',
      en_atencion: 'bg-yellow-100 text-yellow-800',
      atendida: 'bg-green-100 text-green-800',
      derivada: 'bg-blue-100 text-blue-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const canCreate = user?.rol === 'recepcion' || user?.rol === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Emergencias</h2>
              <p className="text-gray-600">Administrar casos de emergencia</p>
            </div>
          </div>
          {canCreate && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nueva Emergencia
            </button>
          )}
        </div>
      </div>

      {/* Emergencias List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DNI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesional</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consultorio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">Cargando...</td>
                </tr>
              ) : emergencias.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No hay emergencias registradas
                  </td>
                </tr>
              ) : (
                emergencias.map((emergencia) => (
                  <tr key={emergencia.id_emergencia} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(emergencia.fecha_hora).toLocaleString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emergencia.paciente_nombre} {emergencia.paciente_apellido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {emergencia.paciente_dni}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {emergencia.motivo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {emergencia.profesional_nombre || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {emergencia.consultorio_nombre || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(emergencia.estado)}`}>
                        {emergencia.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {canCreate && emergencia.estado !== 'atendida' && (
                        <select
                          value={emergencia.estado}
                          onChange={(e) => handleEstadoChange(emergencia.id_emergencia, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="activa">Activa</option>
                          <option value="en_atencion">En Atención</option>
                          <option value="atendida">Atendida</option>
                          <option value="derivada">Derivada</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nueva Emergencia</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
                  <select
                    value={formData.id_paciente}
                    onChange={(e) => setFormData({ ...formData, id_paciente: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Seleccionar paciente</option>
                    {pacientes.map((paciente) => (
                      <option key={paciente.id_paciente} value={paciente.id_paciente}>
                        {paciente.nombre} {paciente.apellido} - DNI: {paciente.dni}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profesional *</label>
                  <select
                    value={formData.id_profesional}
                    onChange={(e) => setFormData({ ...formData, id_profesional: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Seleccionar profesional</option>
                    {profesionales.map((prof) => (
                      <option key={prof.id_profesional} value={prof.id_profesional}>
                        {prof.nombre} - {prof.especialidad}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sala de Emergencia *</label>
                  <select
                    value={formData.id_consultorio}
                    onChange={(e) => setFormData({ ...formData, id_consultorio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Seleccionar sala</option>
                    {consultorios
                      .filter(c => c.sector_nombre === 'Emergencias')
                      .map((consultorio) => (
                        <option key={consultorio.id_consultorio} value={consultorio.id_consultorio}>
                          {consultorio.nombre}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivo *</label>
                  <textarea
                    value={formData.motivo}
                    onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows="4"
                    placeholder="Describa el motivo de la emergencia..."
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Registrar Emergencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Emergencias;
