import { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { pacienteService } from '../services/pacienteService';
import { useAuth } from '../context/AuthContext';

function Pacientes() {
  const { user } = useAuth();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [pacienteDetalle, setPacienteDetalle] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    telefono: '',
    email: ''
  });

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      const data = await pacienteService.getAll();
      setPacientes(data);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const data = await pacienteService.search(searchTerm);
        setPacientes(data);
      } catch (error) {
        console.error('Error al buscar:', error);
      }
    } else {
      loadPacientes();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPaciente) {
        await pacienteService.update(selectedPaciente.id_paciente, formData);
      } else {
        await pacienteService.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadPacientes();
    } catch (error) {
      console.error('Error al guardar paciente:', error);
      alert(error.response?.data?.error || 'Error al guardar paciente');
    }
  };

  const handleView = async (paciente) => {
    try {
      const [detalles, historialData] = await Promise.all([
        pacienteService.getById(paciente.id_paciente),
        pacienteService.getHistorial(paciente.id_paciente)
      ]);
      
      // Combinar turnos y emergencias en un solo array
      const turnosFormateados = (historialData.turnos || []).map(t => ({
        tipo: 'turno',
        fecha: t.fecha,
        profesional: t.profesional_nombre,
        especialidad: t.especialidad,
        descripcion: t.descripcion,
        diagnostico: t.diagnostico,
        tratamiento: t.tratamiento,
        notas: t.notas
      }));
      
      const emergenciasFormateadas = (historialData.emergencias || []).map(e => ({
        tipo: 'emergencia',
        fecha: e.fecha_hora,
        profesional: e.profesional_nombre,
        especialidad: e.especialidad,
        motivo: e.motivo,
        diagnostico: e.diagnostico,
        tratamiento: e.tratamiento,
        notas: e.notas
      }));
      
      // Combinar y ordenar por fecha descendente
      const historialCombinado = [...turnosFormateados, ...emergenciasFormateadas]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      
      setPacienteDetalle(detalles);
      setHistorial(historialCombinado);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      alert('Error al cargar detalles del paciente');
    }
  };

  const handleEdit = (paciente) => {
    setSelectedPaciente(paciente);
    setFormData({
      dni: paciente.dni,
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      fecha_nacimiento: paciente.fecha_nacimiento.split('T')[0],
      telefono: paciente.telefono || '',
      email: paciente.email || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este paciente?')) {
      try {
        await pacienteService.delete(id);
        loadPacientes();
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar paciente');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      dni: '',
      nombre: '',
      apellido: '',
      fecha_nacimiento: '',
      telefono: '',
      email: ''
    });
    setSelectedPaciente(null);
  };

  const canEdit = user?.rol === 'recepcion' || user?.rol === 'admin';
  const canDelete = user?.rol === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Pacientes</h2>
              <p className="text-gray-600">Administrar información de pacientes</p>
            </div>
          </div>
          {canEdit && (
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Paciente
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar por DNI, nombre, apellido o email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Buscar
          </button>
          <button
            onClick={loadPacientes}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Nac.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : pacientes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No se encontraron pacientes
                  </td>
                </tr>
              ) : (
                pacientes.map((paciente) => (
                  <tr key={paciente.id_paciente} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {paciente.dni}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {paciente.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {paciente.apellido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(paciente.fecha_nacimiento).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paciente.telefono || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paciente.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(paciente)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => handleEdit(paciente)}
                            className="text-primary-600 hover:text-primary-900"
                            title="Editar"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(paciente.id_paciente)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {selectedPaciente ? 'Editar Paciente' : 'Nuevo Paciente'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DNI *</label>
                  <input
                    type="text"
                    value={formData.dni}
                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
                  <input
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {selectedPaciente ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalles */}
      {showDetailModal && pacienteDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Detalles del Paciente</h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setPacienteDetalle(null);
                  setHistorial([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Información Personal */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">DNI</p>
                  <p className="text-base font-medium text-gray-900">{pacienteDetalle.dni}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nombre Completo</p>
                  <p className="text-base font-medium text-gray-900">{pacienteDetalle.nombre} {pacienteDetalle.apellido}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(pacienteDetalle.fecha_nacimiento).toLocaleDateString('es-AR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Edad</p>
                  <p className="text-base font-medium text-gray-900">
                    {Math.floor((new Date() - new Date(pacienteDetalle.fecha_nacimiento)) / (365.25 * 24 * 60 * 60 * 1000))} años
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="text-base font-medium text-gray-900">{pacienteDetalle.telefono || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-base font-medium text-gray-900">{pacienteDetalle.email || '-'}</p>
                </div>
              </div>
            </div>

            {/* Historial Médico */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Historial Médico</h4>
              {historial.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay historial médico registrado</p>
              ) : (
                <div className="space-y-4">
                  {historial.map((registro, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {registro.tipo === 'turno' ? 'Consulta' : 'Emergencia'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(registro.fecha).toLocaleString('es-AR')}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          registro.tipo === 'turno' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {registro.tipo === 'turno' ? 'Turno' : 'Emergencia'}
                        </span>
                      </div>
                      {registro.profesional && (
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-medium">Profesional:</span> {registro.profesional}
                        </p>
                      )}
                      {registro.especialidad && (
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-medium">Especialidad:</span> {registro.especialidad}
                        </p>
                      )}
                      {registro.descripcion && (
                        <p className="text-sm text-gray-700 mt-2">
                          <span className="font-medium">Descripción:</span> {registro.descripcion}
                        </p>
                      )}
                      {registro.motivo && (
                        <p className="text-sm text-gray-700 mt-2">
                          <span className="font-medium">Motivo:</span> {registro.motivo}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setPacienteDetalle(null);
                  setHistorial([]);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pacientes;
