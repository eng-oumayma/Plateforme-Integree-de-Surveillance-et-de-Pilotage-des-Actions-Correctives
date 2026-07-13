// src/services/correctiveActionService.ts
import api from "../api/api";
import type {
  CorrectiveAction,
  CreateCorrectiveActionDto,
} from "../types/corrective-action.types";

export const correctiveActionService = {
  async create(dto: CreateCorrectiveActionDto): Promise<CorrectiveAction> {
    const { data } = await api.post("/corrective-actions", dto);
    return data;
  },

  async getAll(filters?: {
    piloteId?: string;
    statut?: string;
    criticite?: string;
    domaine?: string;
  }): Promise<CorrectiveAction[]> {
    const { data } = await api.get("/corrective-actions", { params: filters });
    return data;
  },

  async getMyActions(): Promise<CorrectiveAction[]> {
    const { data } = await api.get("/corrective-actions/my-actions");
    return data;
  },

  async getById(id: string): Promise<CorrectiveAction> {
    const { data } = await api.get(`/corrective-actions/${id}`);
    return data;
  },

  // Récupérer les utilisateurs avec rôle PILOTE_ACTION
  async getPilotes(): Promise<
    {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      department: string;
    }[]
  > {
    const { data } = await api.get("/users", {
      params: { role: "PILOTE_ACTION" },
    });
    return data.filter((u: any) => u.status === "ACTIVE");
  },
  // Ajouter cette méthode

  async updateStatus(
    id: string,
    statut: string,
    progression: number,
  ): Promise<any> {
    const { data } = await api.put(`/corrective-actions/${id}/status`, {
      statut,
      progression,
    });
    return data;
  },

  async uploadProof(actionId: string, file: File): Promise<any> {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post(
      `/corrective-actions/${actionId}/proofs`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },

  async getProofs(actionId: string): Promise<any[]> {
    const { data } = await api.get(`/corrective-actions/${actionId}/proofs`);
    return data;
  },

  async deleteProof(proofId: string): Promise<void> {
    await api.delete(`/corrective-actions/proofs/${proofId}`);
  },
  async getComments(actionId: string): Promise<any[]> {
    const { data } = await api.get(`/corrective-actions/${actionId}/comments`);
    return data;
  },

  async addComment(
    actionId: string,
    message: string,
    mentions?: string[],
  ): Promise<any> {
    const { data } = await api.post(
      `/corrective-actions/${actionId}/comments`,
      { message, mentions: mentions ?? [] },
    );
    return data;
  },
  async getActionMembers(actionId: string): Promise<any[]> {
    // Récupère pilote + créateur de l'action pour les suggestions @mention
    const action = await this.getById(actionId);
    const members: any[] = [];
    if (action.pilote) members.push(action.pilote);
    if (action.createdBy) members.push(action.createdBy);
    return members;
  },

  async validate(id: string): Promise<any> {
    const { data } = await api.put(`/corrective-actions/${id}/validate`);
    return data;
  },

  async reject(id: string, motif: string): Promise<any> {
    const { data } = await api.put(`/corrective-actions/${id}/reject`, {
      motif,
    });
    return data;
  },

  async getHistory(id: string): Promise<any[]> {
    const { data } = await api.get(`/corrective-actions/${id}/history`);
    return data;
  },
};
