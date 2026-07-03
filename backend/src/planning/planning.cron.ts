// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { PlanningService } from './planning.service';

// @Injectable()
// export class PlanningCronService {
//   private readonly logger = new Logger(PlanningCronService.name);

//   constructor(private readonly planningService: PlanningService) {}

//   /**
//    * Tâche quotidienne à 00:05
//    * Passe les plans PLANIFIE → EN_RETARD si leur dateFin est dépassée
//    */
//   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
//   async markOverdueInspections() {
//     this.logger.log('⏰ Cron : vérification des inspections en retard...');
//     const count = await this.planningService.markOverdue();
//     this.logger.log(`✅ ${count} inspection(s) marquée(s) EN_RETARD`);
//   }

//   /**
//    * Tâche hebdomadaire le vendredi à 18h
//    * Génère automatiquement les plans de la semaine suivante
//    */
//   @Cron('0 18 * * 5')
//   async autoGenerateNextWeekPlans() {
//     this.logger.log('⏰ Cron : génération automatique plan semaine suivante...');
//     const count = await this.planningService.autoGenerateNextWeek();
//     this.logger.log(`✅ ${count} plan(s) généré(s) automatiquement`);
//   }
// }

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, In } from 'typeorm';
import { PlanSurveillance } from './Plan-surveillance.entity';
import { PlanStatut } from '../common/enums/Plan-statut.enum';

@Injectable()
export class PlanningCronService {
  private readonly logger = new Logger(PlanningCronService.name);

  constructor(
    @InjectRepository(PlanSurveillance)
    private readonly planRepo: Repository<PlanSurveillance>,
  ) {}

  /**
   * S'exécute automatiquement toutes les nuits à minuit (0 0 * * *)
   * pour basculer les plannings non réalisés et expirés à l'état "EN_RETARD".
   */
//   
/**
   * S'exécute automatiquement toutes les nuits à minuit.
   * Passe en retard tous les plannings dont la semaine est inférieure à la semaine courante.
   */
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Cron('*/10 * * * * *')
  async checkOverduePlannings() {
    this.logger.log('🚀 Vérification des plannings en retard par numéro de semaine...');

    // 1. Calculer l'année et la semaine ISO courante
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Calcul standard du numéro de semaine ISO
    const startOfYear = new Date(currentYear, 0, 1);
    const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
    const currentWeek = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

    try {
      // 2. Exécuter la mise à jour selon votre règle
      const result = await this.planRepo
        .createQueryBuilder()
        .update(PlanSurveillance)
        .set({ statut: PlanStatut.EN_RETARD })
        .where('statut IN (:...statuts)', {
          statuts: [PlanStatut.PLANIFIE, PlanStatut.EN_COURS],
        })
        .andWhere(
          `(annee < :currentYear) OR (annee = :currentYear AND semaine < :currentWeek)`,
          { currentYear, currentWeek }
        )
        .execute();

      if (result.affected && result.affected > 0) {
        this.logger.log(`⚠️ ${result.affected} planning(s) de semaines antérieures sont passés en EN_RETARD.`);
      } else {
        this.logger.log('✅ Aucun planning en retard (toutes les lignes antérieures sont déjà traitées ou closes).');
      }
    } catch (error) {
      this.logger.error('❌ Erreur lors de la mise à jour des retards par semaine :', error.message);
    }
  }
}