import api from './api';

export const agendaService = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `/api/agendas?${queryParams}` : '/api/agendas';
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/agendas/${id}`);
    return response.data;
  },

  create: async (agendaData) => {
    const response = await api.post('/api/agendas', agendaData);
    return response.data;
  },

  update: async (id, agendaData) => {
    const response = await api.put(`/api/agendas/${id}`, agendaData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/agendas/${id}`);
    return response.data;
  }
};
