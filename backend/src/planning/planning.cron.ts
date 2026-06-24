import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PlanningService } from './planning.service';

@Injectable()
export class PlanningCronService {
  private readonly logger = new Logger(PlanningCronService.name);

  constructor(private readonly planningService: PlanningService) {}

  /**
   * Tâche quotidienne à 00:05
   * Passe les plans PLANIFIE → EN_RETARD si leur dateFin est dépassée
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async markOverdueInspections() {
    this.logger.log('⏰ Cron : vérification des inspections en retard...');
    const count = await this.planningService.markOverdue();
    this.logger.log(`✅ ${count} inspection(s) marquée(s) EN_RETARD`);
  }

  /**
   * Tâche hebdomadaire le vendredi à 18h
   * Génère automatiquement les plans de la semaine suivante
   */
  @Cron('0 18 * * 5')
  async autoGenerateNextWeekPlans() {
    this.logger.log('⏰ Cron : génération automatique plan semaine suivante...');
    const count = await this.planningService.autoGenerateNextWeek();
    this.logger.log(`✅ ${count} plan(s) généré(s) automatiquement`);
  }
}