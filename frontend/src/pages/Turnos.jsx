import { useState, useEffect } from 'react';
import { Calendar, Plus, Filter, Edit } from 'lucide-react';
import { turnoService } from '../services/turnoService';
import { agendaService } from '../services/agendaService';
import { pacienteService } from '../services/pacienteService';
import { useAuth } from '../context/AuthContext';

function Turnos() {
  const { user } = useAuth();
  const [turnos, setTurnos] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTurnoId, setEditingTurnoId] = useState(null);
  const [showAtencionModal, setShowAtencionModal] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [atencionData, setAtencionData] = useState({
    diagnostico: '',
    tratamiento: '',
    notas: ''
  });
  const [formData, setFormData] = useState({
    id_agenda: '',
    id_paciente: '',
    descripcion: '',
    fecha_hora: '',
    duracion_min: 30,
    estado: 'reservado'
  });

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    try {
      let turnosData;
      
      // Si es profesional, solo cargar sus turnos
      if (user?.rol === 'profesional' && user?.profesional?.id_profesional) {
        turnosData = await turnoService.getByProfesional(user.profesional.id_profesional, selectedDate);
      } else {
        turnosData = await turnoService.getAll(selectedDate);
      }
      
      const pacientesData = await pacienteService.getAll();
      
      setTurnos(turnosData);
      setPacientes(pacientesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAgendasDisponibles = async () => {
    try {
      // Cargar todas las agendas sin filtro de fecha
      const agendasData = await agendaService.getAll();
      setAgendas(agendasData);
    } catch (error) {
      console.error('Error al cargar agendas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await turnoService.update(editingTurnoId, formData);
      } else {
        await turnoService.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error(isEditing ? 'Error al actualizar turno:' : 'Error al crear turno:', error);
      alert(error.response?.data?.error || (isEditing ? 'Error al actualizar turno' : 'Error al crear turno'));
    }
  };

  const handleEstadoChange = async (id, nuevoEstado, turno) => {
    // Si es profesional y marca como atendido desde confirmado, mostrar modal de atención
    if (user?.rol === 'profesional' && nuevoEstado === 'atendido' && turno.estado === 'confirmado') {
      setTurnoSeleccionado({ id, ...turno });
      setShowAtencionModal(true);
      return;
    }

    // Mensajes de confirmación según el estado
    const confirmaciones = {
      cancelado: '¿Está seguro de cancelar este turno?',
      atendido: '¿Confirma que el turno ha sido atendido?'
    };

    // Si el estado requiere confirmación, mostrar diálogo
    if (confirmaciones[nuevoEstado]) {
      if (!window.confirm(confirmaciones[nuevoEstado])) {
        return; // Cancelar el cambio
      }
    }

    try {
      await turnoService.updateEstado(id, nuevoEstado);
      loadData();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar estado');
    }
  };

  const handleAtencionSubmit = async (e) => {
    e.preventDefault();
    try {
      await turnoService.updateEstado(turnoSeleccionado.id, 'atendido', atencionData);
      setShowAtencionModal(false);
      setTurnoSeleccionado(null);
      setAtencionData({ diagnostico: '', tratamiento: '', notas: '' });
      loadData();
    } catch (error) {
      console.error('Error al registrar atención:', error);
      alert('Error al registrar atención médica');
    }
  };

  const handleEdit = async (turno) => {
    setIsEditing(true);
    setEditingTurnoId(turno.id_turno);
    
    // Cargar agendas disponibles
    await loadAgendasDisponibles();
    
    // Pre-cargar datos del turno
    const fechaHora = new Date(turno.fecha_hora).toISOString().slice(0, 16);
    setFormData({
      id_agenda: turno.id_agenda,
      id_paciente: turno.id_paciente,
      descripcion: turno.descripcion || '',
      fecha_hora: fechaHora,
      duracion_min: turno.duracion_min,
      estado: turno.estado
    });
    
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      id_agenda: '',
      id_paciente: '',
      descripcion: '',
      fecha_hora: '',
      duracion_min: 30,
      estado: 'reservado'
    });
    setIsEditing(false);
    setEditingTurnoId(null);
  };

  const getEstadoColor = (estado) => {
    const colors = {
      reservado: 'bg-blue-100 text-blue-800',
      confirmado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
      atendido: 'bg-gray-100 text-gray-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const canEdit = user?.rol === 'recepcion' || user?.rol === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Turnos</h2>
              <p className="text-gray-600">Administrar turnos médicos</p>
            </div>
          </div>
          {canEdit && (
            <button
              onClick={() => {
                loadAgendasDisponibles();
                setShowModal(true);
              }}
              className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Turno
            </button>
          )}
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
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Hoy
          </button>
        </div>
      </div>

      {/* Turnos List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesional</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consultorio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">Cargando...</td>
                </tr>
              ) : turnos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No hay turnos para esta fecha
                  </td>
                </tr>
              ) : (
                turnos.map((turno) => (
                  <tr key={turno.id_turno} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(turno.fecha_hora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {turno.paciente_nombre} {turno.paciente_apellido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {turno.profesional_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {turno.especialidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {turno.consultorio_nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {turno.descripcion || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(turno.estado)}`}>
                        {turno.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {canEdit && turno.estado !== 'atendido' && turno.estado !== 'cancelado' && (
                          <>
                            <button
                              onClick={() => handleEdit(turno)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Editar turno"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <select
                              value={turno.estado}
                              onChange={(e) => handleEstadoChange(turno.id_turno, e.target.value, turno)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="reservado">Reservado</option>
                              <option value="confirmado">Confirmado</option>
                              <option value="cancelado">Cancelado</option>
                              <option value="atendido">Atendido</option>
                            </select>
                          </>
                        )}
                        {user?.rol === 'profesional' && turno.estado === 'confirmado' && (
                          <button
                            onClick={() => handleEstadoChange(turno.id_turno, 'atendido', turno)}
                            className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Atender
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

      {/* Modal Atención Médica */}
      {showAtencionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Registrar Atención Médica</h3>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Paciente:</strong> {turnoSeleccionado?.paciente_nombre} {turnoSeleccionado?.paciente_apellido}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Fecha:</strong> {turnoSeleccionado?.fecha_hora && new Date(turnoSeleccionado.fecha_hora).toLocaleString('es-AR')}
              </p>
            </div>
            <form onSubmit={handleAtencionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico *</label>
                <textarea
                  value={atencionData.diagnostico}
                  onChange={(e) => setAtencionData({ ...atencionData, diagnostico: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Diagnóstico del paciente..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tratamiento *</label>
                <textarea
                  value={atencionData.tratamiento}
                  onChange={(e) => setAtencionData({ ...atencionData, tratamiento: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Tratamiento prescrito..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  value={atencionData.notas}
                  onChange={(e) => setAtencionData({ ...atencionData, notas: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Notas adicionales..."
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAtencionModal(false);
                    setTurnoSeleccionado(null);
                    setAtencionData({ diagnostico: '', tratamiento: '', notas: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Registrar Atención
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{isEditing ? 'Editar Turno' : 'Nuevo Turno'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agenda *</label>
                  <select
                    value={formData.id_agenda}
                    onChange={(e) => setFormData({ ...formData, id_agenda: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Seleccionar agenda</option>
                    {agendas.length === 0 ? (
                      <option disabled>No hay agendas disponibles</option>
                    ) : (
                      agendas.map((agenda) => (
                        <option key={agenda.id_agenda} value={agenda.id_agenda}>
                          {new Date(agenda.fecha).toLocaleDateString('es-AR')} - {agenda.profesional_nombre} - {agenda.especialidad} ({agenda.hora_inicio?.slice(0,5)} - {agenda.hora_fin?.slice(0,5)})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
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
                        {paciente.nombre} {paciente.apellido} - {paciente.dni}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora *</label>
                  <input
                    type="datetime-local"
                    value={formData.fecha_hora}
                    onChange={(e) => setFormData({ ...formData, fecha_hora: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duración (min)</label>
                  <input
                    type="number"
                    value={formData.duracion_min}
                    onChange={(e) => setFormData({ ...formData, duracion_min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="15"
                    step="15"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows="3"
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
                  {isEditing ? 'Actualizar Turno' : 'Crear Turno'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Turnos;
