import api from './api';

export const turnoService = {
  getAll: async (fecha = null) => {
    const url = fecha ? `/api/turnos?fecha=${fecha}` : '/api/turnos';
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/turnos/${id}`);
    return response.data;
  },

  getByPaciente: async (pacienteId) => {
    const response = await api.get(`/api/turnos/paciente/${pacienteId}`);
    return response.data;
  },

  getByProfesional: async (profesionalId, fecha = null) => {
    const url = fecha 
      ? `/api/turnos/profesional/${profesionalId}?fecha=${fecha}` 
      : `/api/turnos/profesional/${profesionalId}`;
    const response = await api.get(url);
    return response.data;
  },

  getTurnosDisponibles: async (agendaId) => {
    const response = await api.get(`/api/turnos/disponibles/${agendaId}`);
    return response.data;
  },

  create: async (turnoData) => {
    const response = await api.post('/api/turnos', turnoData);
    return response.data;
  },

  update: async (id, turnoData) => {
    const response = await api.put(`/api/turnos/${id}`, turnoData);
    return response.data;
  },

  updateEstado: async (id, estado, atencionData = null) => {
    const payload = { estado };
    if (atencionData) {
      payload.diagnostico = atencionData.diagnostico;
      payload.tratamiento = atencionData.tratamiento;
      payload.notas = atencionData.notas;
    }
    const response = await api.patch(`/api/turnos/${id}/estado`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/turnos/${id}`);
    return response.data;
  }
};
