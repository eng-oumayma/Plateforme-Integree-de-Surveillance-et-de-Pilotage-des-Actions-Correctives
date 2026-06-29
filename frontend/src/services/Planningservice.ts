import api from '../api/api';

export const planningService = {
  // POST /planning — créer plan + récurrences
  async create(payload) {
    const { data } = await api.post('/planning', payload);
    return data;
  },

  // GET /planning?annee=2025&domaine=&statut=&site=
  async getAll(params) {
    const { data } = await api.get('/planning', { params });
    return data;
  },
   // GET /planning/mes-taches  ← NOUVEAU : tâches de l'auditeur connecté
  async getMesTaches() {
    const { data } = await api.get('/planning/mes-taches');
    return data;
  },

  // GET /planning/:id
  async getById(id: string) {
    const { data } = await api.get(`/planning/${id}`);
    return data;
  },

  // PATCH /planning/:id
  async update(id: string, payload) {
    const { data } = await api.patch(`/planning/${id}`, payload);
    return data;
  },

  // DELETE /planning/:id
  async remove(id: string) {
    const { data } = await api.delete(`/planning/${id}`);
    return data;
  },

  // GET /planning/export/csv?annee=2025
  async exportCsv(annee: number) {
    const { data } = await api.get('/planning/export/csv', {
      params: { annee },
      responseType: 'blob',
    });
    return data;
  },

  // POST /planning/import/csv?annee=2025
  async importCsv(file: File, annee: number) {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post('/planning/import/csv', form, {
      params: { annee },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // POST /planning/cron/mark-overdue (admin only)
  async triggerMarkOverdue() {
    const { data } = await api.post('/planning/cron/mark-overdue');
    return data;
  },
};