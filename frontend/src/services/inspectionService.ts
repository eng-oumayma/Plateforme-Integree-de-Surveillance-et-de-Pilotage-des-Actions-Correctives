import api from "../api/api";

export const inspectionService = {
  // POST /inspections — créer une inspection
  async create(payload) {
    const { data } = await api.post("/inspections", payload);
    return data;
  },

  /** POST /inspections/:id/close — clôture (vérifie checklist complète) */
  async close(id: string, payload: { commentaire?: string }) {
    const { data } = await api.post(`/inspections/${id}/close`, payload);
    return data;
  },

  /** GET /inspections/:id/checklist-status — état checklist sans clôturer */
  async getChecklistStatus(id: string) {
    const { data } = await api.get(`/inspections/${id}/checklist-status`);
    return data;
  },

  // GET /inspections?domaine=&site=&statut=&dateFrom=&dateTo=
  async getAll(params?) {
    const { data } = await api.get("/inspections", { params });
    return data;
  },

  // GET /inspections/:id
  async getById(id: string) {
    const { data } = await api.get(`/inspections/${id}`);
    return data;
  },

  // PATCH /inspections/:id/statut  { statut: 'TERMINEE' | 'VALIDEE' | 'ANNULEE' }
  async updateStatut(id: string, statut) {
    const { data } = await api.patch(`/inspections/${id}/statut`, { statut });
    return data;
  },
  async update(id: string, payload) {
    const { data } = await api.patch(`/inspections/${id}`, payload);
    return data;
  },

  // DELETE /inspections/:id
  async remove(id: string) {
    const { data } = await api.delete(`/inspections/${id}`);
    return data;
  },

  async exportCsv(params?) {
    const { data } = await api.get("/inspections/export/csv", {
      params,
      responseType: "blob",
    });
    return data;
  },
};
