import api from './api';

export const pacienteService = {
  getAll: async () => {
    const response = await api.get('/api/pacientes');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/pacientes/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(`/api/pacientes/search?q=${query}`);
    return response.data;
  },

  create: async (pacienteData) => {
    const response = await api.post('/api/pacientes', pacienteData);
    return response.data;
  },

  update: async (id, pacienteData) => {
    const response = await api.put(`/api/pacientes/${id}`, pacienteData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/pacientes/${id}`);
    return response.data;
  },

  getHistorial: async (id) => {
    const response = await api.get(`/api/pacientes/${id}/historial`);
    return response.data;
  }
};
