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
};
