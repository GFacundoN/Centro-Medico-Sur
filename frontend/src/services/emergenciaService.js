import api from './api';

export const emergenciaService = {
  getAll: async () => {
    const response = await api.get('/api/emergencias');
    return response.data;
  },

  getActivas: async () => {
    const response = await api.get('/api/emergencias/activas');
    return response.data;
  },

  getByProfesional: async (profesionalId) => {
    const response = await api.get(`/api/emergencias/profesional/${profesionalId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/emergencias/${id}`);
    return response.data;
  },

  create: async (emergenciaData) => {
    const response = await api.post('/api/emergencias', emergenciaData);
    return response.data;
  },

  update: async (id, emergenciaData) => {
    const response = await api.put(`/api/emergencias/${id}`, emergenciaData);
    return response.data;
  },

  updateEstado: async (id, estado) => {
    const response = await api.patch(`/api/emergencias/${id}/estado`, { estado });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/emergencias/${id}`);
    return response.data;
  }
};
