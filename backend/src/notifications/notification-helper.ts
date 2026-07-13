/**
 * Helper centralisé — appelé par tous les modules pour créer des notifications
 * Import : import { NotificationsService } from '../notifications/notifications.service';
 *          constructor(private readonly notifService: NotificationsService) {}
 */
import { NotificationsService } from './notifications.service';
import { NotificationType } from './notification.entity';

export class NotificationHelper {
  constructor(private readonly notifService: NotificationsService) {}

  // ── Inspection créée ──────────────────────────────────────────────────────
  async notifyInspectionCreee(auditeurId: string, domaine: string, site: string, inspectionId: string) {
    await this.notifService.create({
      destinataireId: auditeurId,
      type:    NotificationType.INSPECTION_CREEE,
      titre:   'Inspection créée',
      message: `Votre inspection ${domaine.replace(/_/g, ' ')} sur le site ${site} a été créée.`,
      lien:    `/inspections/${inspectionId}`,
      entityId: inspectionId,
    });
  }

  // ── Inspection clôturée ───────────────────────────────────────────────────
  async notifyInspectionCloturee(auditeurId: string, domaine: string, inspectionId: string) {
    await this.notifService.create({
      destinataireId: auditeurId,
      type:    NotificationType.INSPECTION_CLOTUREE,
      titre:   'Inspection clôturée',
      message: `L'inspection ${domaine.replace(/_/g, ' ')} a été clôturée avec succès.`,
      lien:    `/inspections/${inspectionId}`,
      entityId: inspectionId,
    });
  }

  // ── Plan assigné à un auditeur ────────────────────────────────────────────
  async notifyPlanAssigne(responsableId: string, domaine: string, semaine: number, annee: number, planId: string) {
    await this.notifService.create({
      destinataireId: responsableId,
      type:    NotificationType.PLAN_ASSIGNE,
      titre:   'Nouvelle inspection planifiée',
      message: `Une inspection ${domaine.replace(/_/g, ' ')} vous a été assignée pour la semaine S${semaine}/${annee}.`,
      lien:    '/mes-taches',
      entityId: planId,
    });
  }

  // ── Plan en retard ────────────────────────────────────────────────────────
  async notifyPlanEnRetard(responsableId: string, domaine: string, semaine: number, planId: string) {
    await this.notifService.create({
      destinataireId: responsableId,
      type:    NotificationType.PLAN_EN_RETARD,
      titre:   '⚠️ Inspection en retard',
      message: `L'inspection ${domaine.replace(/_/g, ' ')} de la semaine S${semaine} est en retard.`,
      lien:    '/mes-taches',
      entityId: planId,
    });
  }

  // ── Événement réglementaire proche ───────────────────────────────────────
  async notifyEvenementEcheance(responsableId: string, titre: string, jours: number, eventId: string) {
    await this.notifService.create({
      destinataireId: responsableId,
      type:    NotificationType.EVENEMENT_ECHEANCE,
      titre:   `Échéance dans ${jours} jour(s)`,
      message: `L'événement "${titre}" arrive à échéance dans ${jours} jour(s).`,
      lien:    `/regulatory-events/${eventId}`,
      entityId: eventId,
    });
  }

  // ── Anomalie détectée ─────────────────────────────────────────────────────
  async notifyAnomalieDetectee(adminIds: string[], domaine: string, inspectionId: string) {
    await this.notifService.createForMany(adminIds, {
      type:    NotificationType.ANOMALIE_DETECTEE,
      titre:   'Anomalie détectée',
      message: `Une anomalie a été détectée lors de l'inspection ${domaine.replace(/_/g, ' ')}.`,
      lien:    `/inspections/${inspectionId}`,
      entityId: inspectionId,
    });
  }


  // ── Action terminée par le pilote ──────────────────────────────────────────
async notifyActionTerminee(auditeurId: string, piloteName: string, actionDescription: string, actionId: string) {
  await this.notifService.create({
    destinataireId: auditeurId,
    type:          NotificationType.ACTION_TERMINEE,
    titre:         '✅ Action corrective terminée',
    message:       `Le pilote ${piloteName} a marqué l'action comme terminée : "${actionDescription.substring(0, 30)}..."`,
    lien:          `/actions/${actionId}`,
    entityId:      actionId,
  });
}

// ── Action validée ou rejetée par l'auditeur ──────────────────────────────
async notifyActionStatutModifie(piloteId: string, status: string, actionDescription: string, actionId: string) {
  const isValide = status === 'VALIDEE';
  await this.notifService.create({
    destinataireId: piloteId,
    type:          isValide ? NotificationType.ACTION_VALIDEE : NotificationType.ACTION_REJETEE,
    titre:         isValide ? '🎉 Action validée' : '❌ Action rejetée',
    message:       `Votre action a été ${isValide ? 'validée' : 'rejetée'} par l'auditeur.`,
    lien:          `/actions/${actionId}`,
    entityId:      actionId,
  });

}


// ── Action corrective assignée à un pilote ────────────────────────────────
async notifyActionAssignee(piloteId: string, createdByName: string, actionDescription: string, actionId: string) {
  await this.notifService.create({
    destinataireId: piloteId,
    type:          NotificationType.ACTION_ASSIGNEE,
    titre:         '⚡ Nouvelle action corrective',
    message:       `${createdByName} vous a assigné une action : "${actionDescription.substring(0, 35)}..."`,
    lien:          `/actions/${actionId}`, // Redirection directe vers la page de l'action
    entityId:      actionId,
  });
}

// ── Action en retard (Alerte Pilote et Auditeur) ───────────────────────────
async notifyActionEnRetard(
  destinataireId: string,
  roleDestinataire: 'PILOTE' | 'AUDITEUR',
  actionDescription: string,
  actionId: string,
) {
  const titre = '⚠️ Action corrective en retard';
  const message = roleDestinataire === 'PILOTE'
    ? `Votre action corrective est expirée : "${actionDescription.substring(0, 30)}..." Merci de la traiter rapidement.`
    : `L'action corrective créée est arrivée à échéance sans être finalisée : "${actionDescription.substring(0, 30)}..."`;

  await this.notifService.create({
    destinataireId,
    type:          NotificationType.ACTION_EN_RETARD,
    titre,
    message,
    lien:          `/actions/${actionId}`,
    entityId:      actionId,
  });
}
// ── Inspection en Retard (Tâche 1) ─────────────────────────────────────────

// ── Inspection en Retard (Tâche 1) ─────────────────────────────────────────
async notifyInspectionEnRetard(auditeurId: string, domaine: string, datePrevue: Date | string, planId: string) {
  // Formatage de la date en version lisible (fr-FR) si c'est un objet Date
  const dateFormatee = datePrevue instanceof Date 
    ? datePrevue.toLocaleDateString('fr-FR') 
    : new Date(datePrevue).toLocaleDateString('fr-FR');

  await this.notifService.create({
    destinataireId: auditeurId,
    type:          NotificationType.PLAN_EN_RETARD,
    titre:         '⚠️ Inspection en retard',
    message:       `L'inspection ${domaine.replace(/_/g, ' ')} prévue le ${dateFormatee} est en retard.`,
    lien:          '/mes-taches',
    entityId:      planId,
  });
}

// ── Rappel Action J-3 / J-1 (Tâche 2) ──────────────────────────────────────
async notifyActionRappel(piloteId: string, joursRestants: number, description: string, actionId: string) {
  await this.notifService.create({
    destinataireId: piloteId,
    type:          NotificationType.ACTION_ASSIGNEE,
    titre:         `⏳ Rappel : Échéance dans ${joursRestants} jour(s)`,
    message:       `Il vous reste ${joursRestants} jour(s) pour terminer l'action : "${description.substring(0, 30)}..."`,
    lien:          `/actions/${actionId}`,
    entityId:      actionId,
  });
}

}