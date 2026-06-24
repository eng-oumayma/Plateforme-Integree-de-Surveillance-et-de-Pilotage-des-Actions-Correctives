// src/services/checklistService.ts
import api from "../api/api";
import type {
  ChecklistTemplate,
  CreateChecklistTemplateDto,
  Domaine,
} from "../types/checklist.types";

export const checklistService = {
  // GET tous les templates
  async getAll(): Promise<ChecklistTemplate[]> {
    const { data } = await api.get("/checklist-templates");
    return data;
  },

  // GET par ID
  async getById(id: string): Promise<ChecklistTemplate> {
    const { data } = await api.get(`/checklist-templates/${id}`);
    return data;
  },

  // GET actif par domaine
  async getByDomaine(domaine: Domaine): Promise<ChecklistTemplate> {
    const { data } = await api.get(
      `/checklist-templates/by-domaine/${domaine}`,
    );
    return data;
  },

  // POST créer un template
  async create(dto: CreateChecklistTemplateDto): Promise<ChecklistTemplate> {
    const { data } = await api.post("/checklist-templates", dto);
    return data;
  },

  // PUT modifier un template
  async update(
    id: string,
    dto: Partial<CreateChecklistTemplateDto>,
  ): Promise<ChecklistTemplate> {
    const { data } = await api.put(`/checklist-templates/${id}`, dto);
    return data;
  },

  // DELETE désactiver un template
  async remove(id: string): Promise<void> {
    await api.delete(`/checklist-templates/${id}`);
  },

  // POST importer depuis Excel
  async importFromExcel(
    file: File,
    domaine: Domaine,
    titre: string,
    cotationType: string,
  ): Promise<ChecklistTemplate> {
    const form = new FormData();
    form.append("file", file);
    form.append("domaine", domaine);
    form.append("titre", titre);
    form.append("cotationType", cotationType);
    const { data } = await api.post("/checklist-templates/import", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
