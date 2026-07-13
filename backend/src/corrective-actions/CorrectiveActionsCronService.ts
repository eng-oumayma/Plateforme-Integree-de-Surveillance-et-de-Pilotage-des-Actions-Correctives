// import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, LessThan, In, Between } from 'typeorm';
// import { CorrectiveAction } from './corrective-action.entity';
// import { ActionStatus } from './enums/action-status.enum';
// import { User } from '../users/user.entity';
// import { NotificationsService } from '../notifications/notifications.service';
// import { NotificationType } from '../notifications/notification.entity';
// import { Role } from 'src/users/enums/role.enum';

// @Injectable()
// export class CorrectiveActionsCronService implements OnApplicationBootstrap {
//   private readonly logger = new Logger(CorrectiveActionsCronService.name);

//   constructor(
//     @InjectRepository(CorrectiveAction) private readonly actionRepo: Repository<CorrectiveAction>,
//     @InjectRepository(User) private readonly userRepo: Repository<User>,
//     private readonly notifService: NotificationsService,
//   ) {}

//   async onApplicationBootstrap() {
//     this.logger.log('[US24 - DEV] Scan automatique des Actions Expirées au démarrage...');
//     await this.checkOverdueActions();
//   }

//   @Cron('*/30 30 * * * *')
//   async checkOverdueActions() {
//     this.logger.log('🚀 Vérification des actions correctives en retard...');
//     const maintenant = new Date();

//     try {
//       // 🎯 Trié avec le champ exact 'deadline'
//       const actionsExpirées = await this.actionRepo.find({
//         where: {
//           deadline: LessThan(maintenant),
//           statut: In([ActionStatus.A_FAIRE, ActionStatus.EN_COURS]),
//         },
//       });

//       if (actionsExpirées.length === 0) {
//         this.logger.log('✅ Aucune action corrective en retard.');
//         return;
//       }

//       this.logger.warn(`⚠️ ${actionsExpirées.length} action(s) en retard !`);
//       const admins = await this.userRepo.find({ where: { role: Role.ADMIN_HSEE }});

//       for (const action of actionsExpirées) {
//         // 🔔 Pilote (Responsable de l'action)
//         if (action.piloteId) {
//           await this.notifService.create({
//             destinataireId: action.piloteId,
//             type:          NotificationType.ACTION_EN_RETARD,
//             titre:         '⚠️ Action corrective en retard',
//             message:       `L'action "${action.description?.substring(0, 40)}..." a dépassé sa date limite.`,
//             lien:          '/mes-actions',
//             entityId:      action.id,
//           });
//         }
//         // 🔔 Admins
//         for (const admin of admins) {
//           await this.notifService.create({
//             destinataireId: admin.id,
//             type:          NotificationType.ACTION_EN_RETARD,
//             titre:         '🚨 [ADMIN] Action en retard',
//             message:       `L'action "${action.description?.substring(0, 40)}..." assignée au pilote Id ${action.piloteId} est en retard.`,
//             lien:          '/mes-actions',
//             entityId:      action.id,
//           });
//         }
//       }
//     } catch (error) {
//       this.logger.error('❌ Erreur actions :', error.message);
//     }
//   }

//   // À mettre dans votre fonction de rappel d'actions
// private async sendRemindersForDays(daysRemaining: number) {
//   const targetDate = new Date();
//   targetDate.setDate(targetDate.getDate() + daysRemaining);
  
//   const start = new Date(targetDate.setHours(0,0,0,0));
//   const end = new Date(targetDate.setHours(23,59,59,999));

//   const actionsA_Notifier = await this.actionRepo.find({
//     where: {
//       deadline: Between(start, end),
//       statut: In([ActionStatus.A_FAIRE, ActionStatus.EN_COURS]),
//     }
//   });

//   for (const action of actionsA_Notifier) {
//     if (action.piloteId) {
//       await this.notifService.create({
//         destinataireId: action.piloteId,
//         type: NotificationType.ACTION_RAPPEL,
//         titre: `⏳ Rappel J-${daysRemaining} : Action corrective`,
//         message: `L'action "${action.description.substring(0, 30)}..." arrive à échéance dans ${daysRemaining} jours.`,
//         lien: '/mes-actions',
//         entityId: action.id,
//       });
//     }
//   }
// }
// }
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, In, Between } from 'typeorm';
import { CorrectiveAction } from './corrective-action.entity';
import { ActionStatus } from './enums/action-status.enum';
import { User } from '../users/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/notification.entity';
import { Role } from 'src/users/enums/role.enum';
@Injectable()
export class CorrectiveActionsCronService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CorrectiveActionsCronService.name);

  constructor(
    @InjectRepository(CorrectiveAction) private readonly actionRepo: Repository<CorrectiveAction>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly notifService: NotificationsService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('[US24 - DEV] Initialisation et rappels au démarrage...');
    await this.checkActionRemindersAndOverdue();
  }

  /**
   * S'exécute toutes les 30 secondes en dev (ou toutes les nuits à minuit en prod : '0 0 * * *')
   */
  @Cron('*/30 30 * * * *')
  async checkActionRemindersAndOverdue() {
    this.logger.log('🚀 [Tâche 2] Vérification des échéances d\'actions (J-3 / J-1) et des retards...');
    
    // 1. Gérer les rappels J-3 et J-1 avant échéance
    await this.processRemindersForDays(3);
    await this.processRemindersForDays(1);
  }

  /**
   * Tâche 2 : Rappels J-3 / J-1 au pilote
   */
  private async processRemindersForDays(daysRemaining: number) {
    const targetDateStart = new Date();
    targetDateStart.setDate(targetDateStart.getDate() + daysRemaining);
    targetDateStart.setHours(0, 0, 0, 0);

    const targetDateEnd = new Date();
    targetDateEnd.setDate(targetDateEnd.getDate() + daysRemaining);
    targetDateEnd.setHours(23, 59, 59, 999);

    const actions = await this.actionRepo.find({
      where: {
        deadline: Between(targetDateStart, targetDateEnd),
        statut: In([ActionStatus.A_FAIRE, ActionStatus.EN_COURS]),
      },
    });

    for (const action of actions) {
      if (action.piloteId) {
        await this.notifService.create({
          destinataireId: action.piloteId,
          type:          NotificationType.ACTION_RAPPEL,
          titre:         `⏳ Échéance Proche : J-${daysRemaining}`,
          message:       `L'action "${action.description.substring(0, 40)}..." se termine dans ${daysRemaining} jour(s).`,
          lien:          '/mes-actions',
          entityId:      action.id,
        });
      }
    }
  }

  /**
   * 🎯 Tâche 3 : Rapport hebdomadaire groupé pour l'ADMIN HSEE
   * S'exécute tous les lundis matin à 8h00 ('0 0 8 * * 1')
   * Pour le développement, vous pouvez utiliser un cron plus court si vous voulez tester.
   */
  @Cron('0 0 8 * * 1')
  async sendWeeklyOverdueReportToAdmin() {
    this.logger.log('📧 [Tâche 3] Génération du récapitulatif hebdomadaire des retards pour l\'Admin...');
    const maintenant = new Date();

    try {
      // Récupérer toutes les actions en retard
      const actionsEnRetard = await this.actionRepo.find({
        where: {
          deadline: LessThan(maintenant),
          statut: In([ActionStatus.A_FAIRE, ActionStatus.EN_COURS]),
        },
        relations: { pilote: true }, // Pour afficher le nom du responsable dans le récap
      });

      if (actionsEnRetard.length === 0) {
        this.logger.log('✅ Rapport Hebdo : Aucune action en retard à signaler.');
        return;
      }

      // Trouver les Admins HSEE à notifier
      const admins = await this.userRepo.find({ where: { role: Role.ADMIN_HSEE } });

      // Construire un message récapitulatif propre
      let listeActionsTxt = `Voici le récapitulatif des ${actionsEnRetard.length} actions en retard :\n`;
      actionsEnRetard.forEach((act, index) => {
        listeActionsTxt += `\n${index + 1}. [${act.criticite}] ${act.description.substring(0, 50)}... (Pilote : ${act.pilote?.lastName|| 'Non assigné'}) - Date limite : ${new Date(act.deadline).toLocaleDateString('fr-FR')}`;
      });

      // Envoyer une SEULE notification groupée à chaque admin
      for (const admin of admins) {
        await this.notifService.create({
          destinataireId: admin.id,
          type:          NotificationType.REPORT_HEBDO_ADMIN,
          titre:         `🚨 Rapport Hebdo : ${actionsEnRetard.length} Actions en Retard`,
          message:       listeActionsTxt,
          lien:          '/admin/dashboard-actions',
        });

        // 💡 Ici, si votre service email est configuré, vous mettriez :
        // await this.mailerService.sendWeeklyReport(admin.email, actionsEnRetard);
      }

      this.logger.log(`✅ Rapport hebdomadaire envoyé à ${admins.length} Administrateur(s).`);
    } catch (error) {
      this.logger.error('❌ Erreur lors de la génération du rapport hebdo admin :', error.message);
    }
  }
}