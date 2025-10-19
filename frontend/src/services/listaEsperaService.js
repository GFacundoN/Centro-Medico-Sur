import api from './api';

export const listaEsperaService = {
  getAll: async () => {
    const response = await api.get('/api/lista-espera');
    return response.data;
  },

  getActivas: async () => {
    const response = await api.get('/api/lista-espera/activas');
    return response.data;
  },

  create: async (id_paciente) => {
    const response = await api.post('/api/lista-espera', { id_paciente });
    return response.data;
  },

  updateEstado: async (id, estado) => {
    const response = await api.patch(`/api/lista-espera/${id}/estado`, { estado });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/lista-espera/${id}`);
    return response.data;
  }
};
