// src/checklists/utils/score-calculator.ts
import { CotationType } from '../enums/cotation-type.enum';

// Valeurs possibles selon le type
export const COTATION_VALUES: Record<CotationType, (number | string)[]> = {
  [CotationType.ZERO_UN]: [0, 1],
  [CotationType.ZERO_UN_DEUX]: [0, 1, 2],
  [CotationType.ZERO_UN_DEUX_NA]: [0, 1, 2, 'NA'],
  [CotationType.ZERO_UN_DEUX_TROIS]: [0, 1, 2, 3],
  [CotationType.ECHELLE]: [0, 4, 6, 8, 10],
  [CotationType.TARGET_VARIABLE]: [0, 1, 2, 3], // max dépend du target de l'item
};

// Max fixe pour les types non-variables
export const COTATION_MAX: Partial<Record<CotationType, number>> = {
  [CotationType.ZERO_UN]: 1,
  [CotationType.ZERO_UN_DEUX]: 2,
  [CotationType.ZERO_UN_DEUX_NA]: 2,
  [CotationType.ZERO_UN_DEUX_TROIS]: 3,
  [CotationType.ECHELLE]: 10,
  // TARGET_VARIABLE : max = item.target (lu depuis chaque item)
};

// Retourner les valeurs possibles pour un item précis
export function getCotationValues(
  cotationType: CotationType,
  itemTarget?: string,
): (number | string)[] {
  if (cotationType === CotationType.TARGET_VARIABLE && itemTarget) {
    const max = Number(itemTarget);
    if (max === 1) return [0, 1];
    if (max === 2) return [0, 1, 2];
    if (max === 3) return [0, 1, 2, 3];
  }
  return COTATION_VALUES[cotationType];
}

// Calculer le score global en %
export function calculateScore(
  cotationType: CotationType,
  reponses: { valeur: number | string; itemTarget?: string }[],
): number {
  const valid = reponses.filter((r) => r.valeur !== 'NA');
  if (valid.length === 0) return 0;

  let total = 0;
  let maxTotal = 0;

  for (const r of valid) {
    total += Number(r.valeur);

    if (cotationType === CotationType.TARGET_VARIABLE) {
      maxTotal += r.itemTarget ? Number(r.itemTarget) : 3;
    } else {
      maxTotal += COTATION_MAX[cotationType] ?? 2;
    }
  }

  return maxTotal === 0 ? 0 : Math.round((total / maxTotal) * 100);
}

// Statut coloré selon le score
export function getScoreStatus(score: number): 'VERT' | 'JAUNE' | 'ROUGE' {
  if (score >= 85) return 'VERT';
  if (score >= 75) return 'JAUNE';
  return 'ROUGE';
}
