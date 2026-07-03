// src/corrective-actions/enums/action-status.enum.ts
export enum ActionStatus {
  A_FAIRE = 'A_FAIRE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  VALIDEE = 'VALIDEE',
  REJETEE = 'REJETEE',
}

export const ACTION_STATUS_LABELS: Record<ActionStatus, string> = {
  [ActionStatus.A_FAIRE]: 'À faire',
  [ActionStatus.EN_COURS]: 'En cours',
  [ActionStatus.TERMINEE]: 'Terminée',
  [ActionStatus.VALIDEE]: 'Validée',
  [ActionStatus.REJETEE]: 'Rejetée',
};
