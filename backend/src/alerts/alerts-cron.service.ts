import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between, Not, In } from 'typeorm';
import { NotificationHelper } from '../notifications/notification-helper';
import { NotificationsService } from '../notifications/notifications.service';

// Importez vos entités réelles ici
import { CorrectiveAction } from '../corrective-actions/corrective-action.entity';
import{ActionStatus} from '../corrective-actions/enums/action-status.enum';
import { Inspection } from '../inspections/inspection.entity';
import { InspectionStatus } from '../common/enums/Inspection-status.enum';

import { RegulatoryEvent, RegulatoryEventStatut } from '../regulatory-events/entities/regulatory-event.entity';
import { User } from '../users/user.entity';
import { NotificationType } from 'src/notifications/notification.entity';
import { Role } from '../users/enums/role.enum';

@Injectable()
export class AlertsCronService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(CorrectiveAction) private actionRepo: Repository<CorrectiveAction>,
    @InjectRepository(Inspection) private inspectionRepo: Repository<Inspection>,
    @InjectRepository(RegulatoryEvent) private eventRepo: Repository<RegulatoryEvent>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly notifService: NotificationsService,
  ) {}

  // 🚀 SE DÉCLENCHE AU DÉMARRAGE (Idéal pour le développement)
  async onApplicationBootstrap() {
    console.log('[US24 - DEV] Déclenchement automatique de TOUTES les alertes et retards au démarrage...');
    await this.runAllAlerts();
  }
  private async runAllAlerts() {
    console.log('[DEBUG] Début du scan de toutes les alertes...');
    
    // ── 1. Actions Expirées ─────────────────────────────────
    try {
      await this.checkOverdueActions();
    } catch (error) {
      console.error('[🚨 ERREUR - Actions Expirées]', error.message);
    }
    
    // ── 2. Tâche 1 : Inspections en retard ──────────────────
    try {
      await this.checkTask1OverdueInspections();
    } catch (error) {
      console.error('[🚨 ERREUR - Tâche 1 Inspections]', error.message);
    }
    
    // ── 3. Tâche 2 : Rappels Actions J-3 / J-1 ──────────────
    try {
      await this.checkTask2ActionDeadlineReminder();
    } catch (error) {
      console.error('[🚨 ERREUR - Tâche 2 Rappels Actions]', error.message);
    }
    
    // ── 4. Tâche 4 : Événements Réglementaires ──────────────
    try {
      await this.checkTask4RegulatoryEventReminder();
    } catch (error) {
      console.error('[🚨 ERREUR - Tâche 4 Événements]', error.message);
    }
    
    console.log('[DEBUG] Fin du scan.');
  }

  // 🕒 CRON JOURNALIER À MINUIT (Pour la production)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async runDailyCron() {
    console.log('[US24 - PROD] Lancement du Cron Journalier automatique...');
    await this.runAllAlerts();
  }

  // Regroupement de toutes les vérifications quotidiennes
//   private async runAllAlerts() {
//     await this.checkOverdueActions(); // 🔥 Ancienne tâche ajoutée ici !
//     await this.checkTask1OverdueInspections();
//     await this.checkTask2ActionDeadlineReminder();
//     await this.checkTask4RegulatoryEventReminder();
//   }

  // ── 🗲 Ancienne Tâche : Détection des Actions Expirées (Alerte Pilote + Auditeur) ──
  private async checkOverdueActions() {
    const maintenant = new Date();
    const notifHelper = new NotificationHelper(this.notifService);

    // Trouver toutes les actions dont la deadline est dépassée et qui ne sont pas finies/validées/rejetées
    const actionsExpirées = await this.actionRepo.find({
      where: {
        deadline: LessThan(maintenant),
        statut: Not(In([ActionStatus.TERMINEE, ActionStatus.VALIDEE, ActionStatus.REJETEE])),
      },
    });

    console.log(`[ALERTES] Vérification des actions : ${actionsExpirées.length} action(s) en retard.`);

    for (const action of actionsExpirées) {
      // A. Alerte au Pilote d'action
      if (action.piloteId) {
        try {
          await notifHelper.notifyActionEnRetard(action.piloteId, 'PILOTE', action.description, action.id);
        } catch (e) { console.warn(`Échec alerte pilote action ${action.id}:`, e); }
      }

      // B. Alerte à l'Auditeur (Créateur de l'action)
      if (action.createdById) {
        try {
          await notifHelper.notifyActionEnRetard(action.createdById, 'AUDITEUR', action.description, action.id);
        } catch (e) { console.warn(`Échec alerte auditeur action ${action.id}:`, e); }
      }
    }
  }

 // ── Tâche 1 : Inspections planifiées passées non réalisées ────────────────
  private async checkTask1OverdueInspections() {
    const maintenant = new Date();
    const notifHelper = new NotificationHelper(this.notifService);

    const inspectionsEnRetard = await this.inspectionRepo.find({
      where: {
        datePrevue: LessThan(maintenant),
        statut: In(['PLANIFIE', 'EN_COURS']), // Corrigé selon votre BDD
      },
    });

    if (inspectionsEnRetard.length === 0) return;

    //  1. Récupérer tous les Admins HSEE du système
    const admins = await this.userRepo.find({ where: { role: Role.ADMIN_HSEE } });

    for (const insp of inspectionsEnRetard) {
      insp.statut = InspectionStatus.EN_RETARD; 
      await this.inspectionRepo.save(insp);

      //  A. Notification à l'auditeur assigné 
      if (insp.auditeurId) {
        await notifHelper.notifyInspectionEnRetard(
          insp.auditeurId, 
          insp.domaine, 
          insp.datePrevue, 
          insp.id
        );
      }

      // B. AJOUT : Notification à CHAQUE administrateur HSEE
      for (const admin of admins) {
        try {
          await this.notifService.create({
            destinataireId: admin.id,
            type:          NotificationType.PLAN_EN_RETARD,
            titre:         '🚨 [ADMIN] Inspection en retard détectée',
            message:       `L'inspection ${insp.domaine.replace(/_/g, ' ')} assignée à l'auditeur est en retard depuis le ${new Date(insp.datePrevue).toLocaleDateString('fr-FR')}.`,
            lien:          '/mes-taches', // Ou le lien vers votre dashboard admin
            entityId:      insp.id,
          });
        } catch (e) {
          console.warn(`Impossible d'envoyer la notification à l'admin ${admin.id}:`, e);
        }
      }
    }
    console.log(`[ALERTES] ${inspectionsEnRetard.length} inspection(s) traitée(s) et notifiée(s) aux auditeurs et admins.`);
  }

  // ── Tâche 2 : Rappel Action Pilote (J-3 et J-1) ───────────────────────────
  private async checkTask2ActionDeadlineReminder() {
    const notifHelper = new NotificationHelper(this.notifService);
    
    const j3Debut = this.getRelativeDate(3, true);
    const j3Fin = this.getRelativeDate(3, false);
    const j1Debut = this.getRelativeDate(1, true);
    const j1Fin = this.getRelativeDate(1, false);

    const actionsJ3 = await this.actionRepo.find({
      where: { deadline: Between(j3Debut, j3Fin), statut: Not(ActionStatus.TERMINEE) },
    });

    const actionsJ1 = await this.actionRepo.find({
      where: { deadline: Between(j1Debut, j1Fin), statut: Not(ActionStatus.TERMINEE) },
    });

    for (const a of actionsJ3) {
      if (a.piloteId) await notifHelper.notifyActionRappel(a.piloteId, 3, a.description, a.id);
    }

    for (const a of actionsJ1) {
      if (a.piloteId) await notifHelper.notifyActionRappel(a.piloteId, 1, a.description, a.id);
    }
  }
// ── Tâche 4 : Rappels anticipés & Détection des retards Événements ──────
private async checkTask4RegulatoryEventReminder() {
  const maintenant = new Date();
  const notifHelper = new NotificationHelper(this.notifService);
  
  // -------------------------------------------------------------------------
  // 🛑 PARTIE A : Détection des événements EN RETARD (Date passée & non réalisé)
  // -------------------------------------------------------------------------
  const eventsEnRetard = await this.eventRepo.find({
    where: {
      datePrevue: LessThan(maintenant),
      statut: RegulatoryEventStatut.PLANIFIE, // Uniquement ceux qui attendent d'être faits
    },
  });

  for (const event of eventsEnRetard) {
    event.statut = RegulatoryEventStatut.EN_RETARD;
    await this.eventRepo.save(event);

    if (event.responsableId) {
      // Notification d'échéance immédiate / retard
      await notifHelper.notifyEvenementEcheance(event.responsableId, event.titre, 0, event.id);
    }
  }

  // -------------------------------------------------------------------------
  // ⏳ PARTIE B : Rappels anticipés à J-30 et J-7
  // -------------------------------------------------------------------------
  const j30Debut = this.getRelativeDate(30, true);
  const j30Fin = this.getRelativeDate(30, false);
  const j7Debut = this.getRelativeDate(7, true);
  const j7Fin = this.getRelativeDate(7, false);

  // Événements à J-30 (Toujours sur l'état PLANIFIE)
  const eventsJ30 = await this.eventRepo.find({ 
    where: { 
      datePrevue: Between(j30Debut, j30Fin),
      statut: RegulatoryEventStatut.PLANIFIE 
    } 
  });
  
  // Événements à J-7
  const eventsJ7 = await this.eventRepo.find({ 
    where: { 
      datePrevue: Between(j7Debut, j7Fin),
      statut: RegulatoryEventStatut.PLANIFIE 
    } 
  });

  // Envoi des notifications J-30
  for (const e of eventsJ30) {
    if (e.responsableId) {
      await notifHelper.notifyEvenementEcheance(e.responsableId, e.titre, 30, e.id);
    }
  }

  // Envoi des notifications J-7
  for (const e of eventsJ7) {
    if (e.responsableId) {
      await notifHelper.notifyEvenementEcheance(e.responsableId, e.titre, 7, e.id);
    }
  }
}

  private getRelativeDate(daysFromNow: number, startOfDay: boolean): Date {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    if (startOfDay) {
      d.setHours(0, 0, 0, 0);
    } else {
      d.setHours(23, 59, 59, 999);
    }
    return d;
  }

}