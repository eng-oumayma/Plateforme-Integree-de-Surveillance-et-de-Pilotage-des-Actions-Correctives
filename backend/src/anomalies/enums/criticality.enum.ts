// src/anomalies/enums/criticality.enum.ts
export enum Criticality {
  FAIBLE = 'FAIBLE',
  MODERE = 'MODERE',
  CRITIQUE = 'CRITIQUE',
  BLOQUANT = 'BLOQUANT',
}

export const CRITICALITY_LABELS: Record<Criticality, string> = {
  [Criticality.FAIBLE]: 'Faible',
  [Criticality.MODERE]: 'Modéré',
  [Criticality.CRITIQUE]: 'Critique',
  [Criticality.BLOQUANT]: 'Bloquant',
};

export const CRITICALITY_COLORS: Record<Criticality, string> = {
  [Criticality.FAIBLE]: '#4CAF50',
  [Criticality.MODERE]: '#FFC107',
  [Criticality.CRITIQUE]: '#FF9800',
  [Criticality.BLOQUANT]: '#F44336',
};
