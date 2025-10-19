import api from './api';

export const profesionalService = {
  getAll: async () => {
    const response = await api.get('/api/profesionales');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/profesionales/${id}`);
    return response.data;
  },

  update: async (id, profesionalData) => {
    const response = await api.put(`/api/profesionales/${id}`, profesionalData);
    return response.data;
  }
};
