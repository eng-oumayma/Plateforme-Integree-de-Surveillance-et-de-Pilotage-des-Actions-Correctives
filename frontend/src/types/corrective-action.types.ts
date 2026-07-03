// src/types/corrective-action.types.ts
export type ActionStatus =
  | "A_FAIRE"
  | "EN_COURS"
  | "TERMINEE"
  | "VALIDEE"
  | "REJETEE";

export type Criticality = "FAIBLE" | "MODERE" | "CRITIQUE" | "BLOQUANT";

export interface CorrectiveAction {
  id: string;
  anomalyId: string;
  anomaly: {
    id: string;
    description: string;
    criticite: Criticality;
    domaine: string;
  };
  description: string;
  criticite: Criticality;
  deadline: string;
  criteresValidation: string;
  statut: ActionStatus;
  progression: number;
  pilote: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
  };
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  domaine: string;
  site: string;
  createdAt: string;
}

export interface CreateCorrectiveActionDto {
  anomalyId: string;
  description: string;
  criticite: Criticality;
  piloteId: string;
  deadline: string;
  criteresValidation?: string;
}
