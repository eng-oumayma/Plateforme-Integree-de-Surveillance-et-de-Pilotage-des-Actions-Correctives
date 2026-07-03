// src/services/anomalyService.ts
import api from "../api/api";

export type Criticality = "FAIBLE" | "MODERE" | "CRITIQUE" | "BLOQUANT";

export const anomalyService = {
  async create(dto: {
    inspectionId: string;
    checklistItemId?: string;
    description: string;
    criticite: Criticality;
    domaine?: string;
    site?: string;
  }) {
    const { data } = await api.post("/anomalies", dto);
    return data;
  },

  async uploadPhoto(anomalyId: string, file: File) {
    const form = new FormData();
    form.append("photo", file);
    const { data } = await api.post(`/anomalies/${anomalyId}/photo`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async deletePhoto(photoId: string) {
    await api.delete(`/anomalies/photo/${photoId}`);
  },

  async getByInspection(inspectionId: string) {
    const { data } = await api.get(`/anomalies/inspection/${inspectionId}`);
    return data;
  },

  async getAll(filters?: {
    criticite?: string;
    statut?: string;
    domaine?: string;
  }) {
    const { data } = await api.get("/anomalies", { params: filters });
    return data;
  },

  async updateStatus(id: string, statut: string) {
    const { data } = await api.patch(`/anomalies/${id}/status`, { statut });
    return data;
  },
  // Ajouter ces méthodes dans anomalyService.ts

  async getStats(filters?: {
    domaine?: string;
    site?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const { data } = await api.get("/anomalies/stats", { params: filters });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/anomalies/${id}`);
    return data;
  },
  // Ajouter dans anomalyService.ts
  async downloadPdf(filters?: {
    criticite?: string;
    statut?: string;
    domaine?: string;
    site?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const response = await api.get("/anomalies/export/pdf", {
      params: filters,
      responseType: "blob",
    });
    const url = URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `rapport-anomalies-${new Date().toISOString().slice(0, 10)}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Export CSV — généré côté client depuis les données déjà chargées
  exportCsv(anomalies: any[]) {
    const headers = [
      "Date",
      "Domaine",
      "Site",
      "Criticité",
      "Statut",
      "Description",
      "Créé par",
    ];
    const rows = anomalies.map((a) => [
      new Date(a.createdAt).toLocaleDateString("fr-FR"),
      a.domaine || "",
      a.site || "",
      a.criticite,
      a.statut,
      `"${(a.description || "").replace(/"/g, '""')}"`,
      a.createdBy ? `${a.createdBy.firstName} ${a.createdBy.lastName}` : "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `anomalies-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },
};
