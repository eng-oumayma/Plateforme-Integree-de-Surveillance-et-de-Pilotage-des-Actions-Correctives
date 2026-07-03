// export enum InspectionStatus {
//   // PLANIFIE  = 'PLANIFIE',   // Plan créé mais inspection pas encore commencée
//   EN_COURS  = 'EN_COURS',   // Auditeur a créé l'inspection — checklist en cours
//   // REALISE   = 'REALISE',    // Checklist complète + clôturée par l'auditeur
//   // EN_RETARD = 'EN_RETARD',  // Échéance dépassée sans clôture
//   ANNULEE   = 'ANNULEE',    // Annulée manuellement
//   TERMINEE  = 'TERMINEE',    // Terminée manuellement
//   VALIDEE ='VALIDEE',

// }

export enum InspectionStatus {
  PLANIFIE  = 'PLANIFIE',
  EN_COURS  = 'EN_COURS',
  REALISE   = 'REALISE',
  EN_RETARD = 'EN_RETARD',
  ANNULEE   = 'ANNULEE',
}