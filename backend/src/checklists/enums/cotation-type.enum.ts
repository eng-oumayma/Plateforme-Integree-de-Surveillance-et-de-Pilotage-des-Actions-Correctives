// src/checklists/enums/cotation-type.enum.ts
export enum CotationType {
  ZERO_UN = '0_1', // 0/1 OUI/NON → Locaux tech, Chimique, Incendie
  ZERO_UN_DEUX = '0_1_2', // 0/1/2 → Cantine, Infirmerie, Transport
  ZERO_UN_DEUX_NA = '0_1_2_NA', // 0/1/2/NA → variante avec NA
  ZERO_UN_DEUX_TROIS = '0_1_2_3', // 0/1/2/3 → max selon target
  ECHELLE = '0_4_6_8_10', // 0/4/6/8/10 → Sanitaires
  TARGET_VARIABLE = 'TARGET', // Plant, Déchets : max = target de l'item
}

// Mapping domaine → cotation par défaut
export const DOMAINE_COTATION_DEFAULT: Record<string, CotationType> = {
  Plant: CotationType.TARGET_VARIABLE,
  Magasin: CotationType.TARGET_VARIABLE,
  Sanitaires: CotationType.ECHELLE,
  Cantine: CotationType.ZERO_UN_DEUX,
  Chimique: CotationType.ZERO_UN,
  'Locaux techniques': CotationType.ZERO_UN,
  Déchets: CotationType.TARGET_VARIABLE,
  Transport: CotationType.ZERO_UN_DEUX,
  Infirmerie: CotationType.ZERO_UN_DEUX,
  Recycleurs: CotationType.ZERO_UN,
  Incendie: CotationType.ZERO_UN,
};

// Labels affichables dans le frontend
export const COTATION_LABELS: Record<CotationType, string> = {
  [CotationType.ZERO_UN]: '0 / 1  (Non existant / Suffisant)',
  [CotationType.ZERO_UN_DEUX]:
    '0 / 1 / 2  (Inexistant / Insuffisant / Acceptable)',
  [CotationType.ZERO_UN_DEUX_NA]: '0 / 1 / 2 / NA',
  [CotationType.ZERO_UN_DEUX_TROIS]: '0 / 1 / 2 / 3',
  [CotationType.ECHELLE]: '0 / 4 / 6 / 8 / 10  (Sanitaires)',
  [CotationType.TARGET_VARIABLE]:
    'Variable par item (Plant, Déchets) — target = max',
};
