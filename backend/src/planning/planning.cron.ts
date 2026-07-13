// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, LessThan, In } from 'typeorm';
// import { PlanSurveillance } from './Plan-surveillance.entity';
// import { PlanStatut } from '../common/enums/Plan-statut.enum';

// @Injectable()
// export class PlanningCronService {
//   private readonly logger = new Logger(PlanningCronService.name);

//   constructor(
//     @InjectRepository(PlanSurveillance)
//     private readonly planRepo: Repository<PlanSurveillance>,
//   ) {}

//   /**
//    * S'exécute automatiquement toutes les nuits à minuit (0 0 * * *)
//    * pour basculer les plannings non réalisés et expirés à l'état "EN_RETARD".
//    */
// //   
// /**
//    * S'exécute automatiquement toutes les nuits à minuit.
//    * Passe en retard tous les plannings dont la semaine est inférieure à la semaine courante.
//    */
//   // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
//   @Cron('*/30 30 * * * *')
//   async checkOverduePlannings() {
//     this.logger.log('🚀 Vérification des plannings en retard par numéro de semaine...');

//     // 1. Calculer l'année et la semaine ISO courante
//     const now = new Date();
//     const currentYear = now.getFullYear();
    
//     // Calcul standard du numéro de semaine ISO
//     const startOfYear = new Date(currentYear, 0, 1);
//     const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
//     const currentWeek = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

//     try {
//       // 2. Exécuter la mise à jour selon votre règle
//       const result = await this.planRepo
//         .createQueryBuilder()
//         .update(PlanSurveillance)
//         .set({ statut: PlanStatut.EN_RETARD })
//         .where('statut IN (:...statuts)', {
//           statuts: [PlanStatut.PLANIFIE, PlanStatut.EN_COURS],
//         })
//         .andWhere(
//           `(annee < :currentYear) OR (annee = :currentYear AND semaine < :currentWeek)`,
//           { currentYear, currentWeek }
//         )
//         .execute();

//       if (result.affected && result.affected > 0) {
//         this.logger.log(`⚠️ ${result.affected} planning(s) de semaines antérieures sont passés en EN_RETARD.`);
//       } else {
//         this.logger.log('✅ Aucun planning en retard (toutes les lignes antérieures sont déjà traitées ou closes).');
//       }
//     } catch (error) {
//       this.logger.error('❌ Erreur lors de la mise à jour des retards par semaine :', error.message);
//     }
//   }
// 
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanSurveillance } from './Plan-surveillance.entity';
import { PlanStatut } from '../common/enums/Plan-statut.enum';
import { User } from '../users/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/notification.entity';
import { Role } from '../users/enums/role.enum';

@Injectable()
export class PlanningCronService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PlanningCronService.name);

  constructor(
    @InjectRepository(PlanSurveillance) private readonly planRepo: Repository<PlanSurveillance>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly notifService: NotificationsService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('[US24 - DEV] Scan automatique des Plannings au démarrage...');
    await this.checkOverduePlannings();
  }

  @Cron('*/30 30 * * * *')
  async checkOverduePlannings() {
    this.logger.log('🚀 Vérification des plannings en retard par numéro de semaine...');
    const now = new Date();
    const currentYear = now.getFullYear();
    
    const startOfYear = new Date(currentYear, 0, 1);
    const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
    const currentWeek = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

    try {
      // 🎯 Récupération avec le vrai champ 'responsableId'
      const planningsAVisualiser = await this.planRepo
        .createQueryBuilder('plan')
        .where('plan.statut IN (:...statuts)', { statuts: [PlanStatut.PLANIFIE, PlanStatut.EN_COURS] })
        .andWhere('(plan.annee < :currentYear) OR (plan.annee = :currentYear AND plan.semaine < :currentWeek)', { currentYear, currentWeek })
        .getMany();

      const result = await this.planRepo
        .createQueryBuilder()
        .update(PlanSurveillance)
        .set({ statut: PlanStatut.EN_RETARD })
        .where('statut IN (:...statuts)', { statuts: [PlanStatut.PLANIFIE, PlanStatut.EN_COURS] })
        .andWhere(`(annee < :currentYear) OR (annee = :currentYear AND semaine < :currentWeek)`, { currentYear, currentWeek })
        .execute();

      if (result.affected && result.affected > 0) {
        this.logger.log(`⚠️ ${result.affected} planning(s) passés en EN_RETARD.`);
        const admins = await this.userRepo.find({ where: { role: Role.ADMIN_HSEE } });

        for (const plan of planningsAVisualiser) {
          // 🔔 Responsable (ex-Auditeur)
          if (plan.responsableId) {
            await this.notifService.create({
              destinataireId: plan.responsableId,
              type:          NotificationType.PLAN_EN_RETARD,
              titre:         '⚠️ Inspection en retard',
              message:       `L'inspection du domaine ${plan.domaine || ''} prévue pour la semaine S${plan.semaine} est en retard.`,
              lien:          '/mes-taches',
              entityId:      plan.id,
            });
          }
          // 🔔 Admins
          for (const admin of admins) {
            await this.notifService.create({
              destinataireId: admin.id,
              type:          NotificationType.PLAN_EN_RETARD,
              titre:         '🚨 [ADMIN] Inspection en retard',
              message:       `L'inspection du domaine ${plan.domaine || ''} (Semaine S${plan.semaine}) est en retard.`,
              lien:          '/mes-taches',
              entityId:      plan.id,
            });
          }
        }
      } else {
        this.logger.log('✅ Aucun planning en retard.');
      }
    } catch (error) {
      this.logger.error('❌ Erreur plannings :', error.message);
    }
  }
}