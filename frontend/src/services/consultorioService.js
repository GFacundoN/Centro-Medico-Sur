import api from './api';

export const consultorioService = {
  getAll: async () => {
    const response = await api.get('/api/consultorios');
    return response.data;
  },

  getSectores: async () => {
    const response = await api.get('/api/consultorios/sectores/all');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/consultorios/${id}`);
    return response.data;
  },

  create: async (consultorioData) => {
    const response = await api.post('/api/consultorios', consultorioData);
    return response.data;
  },

  update: async (id, consultorioData) => {
    const response = await api.put(`/api/consultorios/${id}`, consultorioData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/consultorios/${id}`);
    return response.data;
  }
};
