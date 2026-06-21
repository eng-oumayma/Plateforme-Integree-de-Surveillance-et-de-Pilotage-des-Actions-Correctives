import api from './api';

export const inspectionService = {
  async create(payload) {
    const { data } = await api.post('/inspections', payload);
    return data;
  },

  async getAll(params) {
    const { data } = await api.get('/inspections', { params });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/inspections/${id}`);
    return data;
  },

  async updateStatut(id, statut) {
    const { data } = await api.patch(`/inspections/${id}/statut`, { statut });
    return data;
  },
};
