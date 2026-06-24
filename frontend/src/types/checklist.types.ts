// src/types/checklist.types.ts

export type CotationType =
  | "0_1"
  | "0_1_2"
  | "0_1_2_NA"
  | "0_1_2_3"
  | "0_4_6_8_10"
  | "TARGET";

export type Domaine =
  | "Plant"
  | "Magasin"
  | "Sanitaires"
  | "Cantine"
  | "Chimique"
  | "Locaux techniques"
  | "Déchets"
  | "Transport"
  | "Infirmerie"
  | "Recycleurs"
  | "Incendie";

export interface ChecklistItem {
  id?: string;
  section: string;
  libelle: string;
  target?: string;
  ordre: number;
  actif: boolean;
}

export interface ChecklistTemplate {
  id: string;
  domaine: Domaine;
  titre: string;
  version: number;
  cotationType: CotationType;
  actif: boolean;
  items: ChecklistItem[];
  createdAt: string;
}

export interface CreateChecklistTemplateDto {
  domaine: Domaine;
  titre: string;
  cotationType: CotationType;
  items: Omit<ChecklistItem, "id">[];
}
