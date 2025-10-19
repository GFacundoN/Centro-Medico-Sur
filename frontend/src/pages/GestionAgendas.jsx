import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, Filter } from 'lucide-react';
import { agendaService } from '../services/agendaService';
import { profesionalService } from '../services/profesionalService';
import { consultorioService } from '../services/consultorioService';
import { useAuth } from '../context/AuthContext';

function GestionAgendas() {
  const { user } = useAuth();
  const [agendas, setAgendas] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    id_profesional: '',
    id_consultorio: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    duracion_turno_min: 30
  });

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    try {
      const params = selectedDate ? { fecha: selectedDate } : {};
      const [agendasData, profesionalesData, consultoriosData] = await Promise.all([
        agendaService.getAll(params),
        profesionalService.getAll(),
        consultorioService.getAll()
      ]);
      
      setAgendas(agendasData);
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
      if (editingAgenda) {
        await agendaService.update(editingAgenda.id_agenda, formData);
      } else {
        await agendaService.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error al guardar agenda:', error);
      alert(error.response?.data?.error || 'Error al guardar agenda');
    }
  };

  const handleEdit = (agenda) => {
    setEditingAgenda(agenda);
    setFormData({
      id_profesional: agenda.id_profesional,
      id_consultorio: agenda.id_consultorio,
      fecha: agenda.fecha,
      hora_inicio: agenda.hora_inicio,
      hora_fin: agenda.hora_fin,
      duracion_turno_min: agenda.duracion_turno_min
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta agenda?')) return;
    
    try {
      await agendaService.delete(id);
      loadData();
    } catch (error) {
      console.error('Error al eliminar agenda:', error);
      alert('Error al eliminar agenda');
    }
  };

  const resetForm = () => {
    setFormData({
      id_profesional: '',
      id_consultorio: '',
      fecha: '',
      hora_inicio: '',
      hora_fin: '',
      duracion_turno_min: 30
    });
    setEditingAgenda(null);
  };

  const canManage = user?.rol === 'admin';

  if (!canManage) {
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
            <Calendar className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Agendas</h2>
              <p className="text-gray-600">Configurar horarios de atención de profesionales</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Agenda
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">Fecha:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={() => setSelectedDate('')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Todas
          </button>
        </div>
      </div>

      {/* Agendas List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesional</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consultorio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duración Turno</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">Cargando...</td>
                </tr>
              ) : agendas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No hay agendas configuradas
                  </td>
                </tr>
              ) : (
                agendas.map((agenda) => (
                  <tr key={agenda.id_agenda} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(agenda.fecha).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {agenda.profesional_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agenda.especialidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agenda.consultorio_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agenda.hora_inicio} - {agenda.hora_fin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agenda.duracion_turno_min} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(agenda)}
                        className="text-blue-600 hover:text-blue-800 inline-block"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(agenda.id_agenda)}
                        className="text-red-600 hover:text-red-800 inline-block"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
              {editingAgenda ? 'Editar Agenda' : 'Nueva Agenda'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultorio *</label>
                  <select
                    value={formData.id_consultorio}
                    onChange={(e) => setFormData({ ...formData, id_consultorio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Seleccionar consultorio</option>
                    {consultorios
                      .filter(c => c.sector_nombre !== 'Emergencias')
                      .map((consultorio) => (
                        <option key={consultorio.id_consultorio} value={consultorio.id_consultorio}>
                          {consultorio.nombre}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duración Turno (min) *</label>
                  <input
                    type="number"
                    value={formData.duracion_turno_min}
                    onChange={(e) => setFormData({ ...formData, duracion_turno_min: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="15"
                    step="15"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio *</label>
                  <input
                    type="time"
                    value={formData.hora_inicio}
                    onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin *</label>
                  <input
                    type="time"
                    value={formData.hora_fin}
                    onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingAgenda ? 'Actualizar' : 'Crear'} Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionAgendas;