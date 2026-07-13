import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { RegulatoryEvent, RegulatoryEventStatut } from './entities/regulatory-event.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from 'src/notifications/notification.entity';

@Injectable()
export class RegulatoryEventsCronService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RegulatoryEventsCronService.name);

  constructor(
    @InjectRepository(RegulatoryEvent) private readonly repo: Repository<RegulatoryEvent>,
    private readonly notifService: NotificationsService, // 🎯 Injecté
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('[US24 - DEV] Scan automatique des Échéances Réglementaires au démarrage...');
    await this.checkRegulatoryDeadlines();
  }

  @Cron('*/30 30 * * * *')
  async checkRegulatoryDeadlines() {
    this.logger.log('🚀 Analyse quotidienne des échéances réglementaires (J-30 / J-7)...');
    await this.processAlertsForDays(30);
    await this.processAlertsForDays(7);
  }

  private async processAlertsForDays(daysRemaining: number) {
    const today = new Date();
    
    const targetDateStart = new Date();
    targetDateStart.setDate(today.getDate() + daysRemaining);
    targetDateStart.setHours(0, 0, 0, 0);

    const targetDateEnd = new Date();
    targetDateEnd.setDate(today.getDate() + daysRemaining);
    targetDateEnd.setHours(23, 59, 59, 999);

    const events = await this.repo.find({
      where: {
        statut: RegulatoryEventStatut.PLANIFIE,
        datePrevue: Between(targetDateStart, targetDateEnd),
      },
      relations: { responsable: true },
    });

    if (events.length === 0) {
      this.logger.log(`🔍 J-${daysRemaining} : Aucun événement réglementaire trouvé pour cette échéance.`);
      return;
    }

    this.logger.warn(`⚠️ J-${daysRemaining} : ${events.length} événement(s) nécessitent une alerte !`);

    for (const event of events) {
      try {
        this.logger.log(`✉️ Envoi d'alerte à ${event.responsable?.email} pour l'événement : ${event.titre}`);
        
        // 🎯 Envoi de la notification en base de données pour l'interface utilisateur
        if (event.responsableId) {
          await this.notifService.create({
            destinataireId: event.responsableId,
            type:         NotificationType.EVENEMENT_ECHEANCE,
            titre:         `⏳ Échéance réglementaire J-${daysRemaining}`,
            message:       `L'événement "${event.titre}" arrive à échéance dans ${daysRemaining} jours.`,
            lien:          '/regulatory-events',
            entityId:      event.id,
          });
        }
        
      } catch (err) {
        this.logger.error(`❌ Échec de l'envoi de l'alerte pour l'événement #${event.id} :`, err.message);
      }
    }
  }
}