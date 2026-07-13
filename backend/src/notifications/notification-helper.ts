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
}