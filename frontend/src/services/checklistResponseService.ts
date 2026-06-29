// src/services/checklistResponseService.ts
import api from "../api/api";

export const checklistResponseService = {
  async saveResponse(dto: {
    inspectionId: string;
    itemId: string;
    cotation?: string;
    observation?: string;
    analyseCauses?: string;
    responsable?: string;
    delai?: string;
    isDeviation?: boolean;
  }) {
    const { data } = await api.post("/checklist-responses", dto);
    return data;
  },

  async uploadPhoto(inspectionId: string, itemId: string, file: File) {
    const form = new FormData();
    form.append("photo", file);
    const { data } = await api.post(
      `/checklist-responses/photo/${inspectionId}/${itemId}`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },

  async deletePhoto(photoId: string) {
    await api.delete(`/checklist-responses/photo/${photoId}`);
  },

  async getByInspection(inspectionId: string) {
    const { data } = await api.get(`/checklist-responses/${inspectionId}`);
    return data;
  },

  async getScore(inspectionId: string, templateId: string) {
    const { data } = await api.get(
      `/checklist-responses/${inspectionId}/score/${templateId}`,
    );
    return data;
  },

  async checkComplete(inspectionId: string, templateId: string) {
    const { data } = await api.get(
      `/checklist-responses/${inspectionId}/complete/${templateId}`,
    );
    return data;
  },
  // Ajouter ces 2 méthodes dans checklistResponseService

  // GET résultats complets (read-only)
  async getFullResult(inspectionId: string, templateId: string) {
    const { data } = await api.get(
      `/checklist-responses/inspection/${inspectionId}/full/${templateId}`,
    );
    return data;
  },

  // GET historique scores par domaine
  async getScoreHistory(domaine: string) {
    const { data } = await api.get(
      `/checklist-responses/score-history/${domaine}`,
    );
    return data;
  },

  // GET export PDF (déclenche téléchargement)
  async downloadPdf(inspectionId: string, templateId: string) {
    const response = await api.get(
      `/checklist-responses/inspection/${inspectionId}/pdf/${templateId}`,
      { responseType: "blob" },
    );
    const url = URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `rapport-checklist-${inspectionId.slice(0, 8)}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  },
};
