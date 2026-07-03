import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { RegulatoryEvent, RegulatoryEventStatut } from './entities/regulatory-event.entity';

@Injectable()
export class RegulatoryEventsCronService {
  private readonly logger = new Logger(RegulatoryEventsCronService.name);

  constructor(
    @InjectRepository(RegulatoryEvent)
    private readonly repo: Repository<RegulatoryEvent>,
    
    // 💡 Injectez votre service d'envoi d'emails ou de notifications ici
    // private readonly mailerService: MailerService,
  ) {}

  /**
   * S'exécute automatiquement toutes les nuits à 1h00 du matin.
   * Scanne les événements à venir à J-30 et J-7.
   */
//   @Cron(CronExpression.EVERY_DAY_AT_1AM)
  @Cron('*/10 * * * * *')
  async checkRegulatoryDeadlines() {
    this.logger.log('🚀 Analyse quotidienne des échéances réglementaires (J-30 / J-7)...');

    await this.processAlertsForDays(30);
    await this.processAlertsForDays(7);
  }

  /**
   * Calcule la plage exacte de la journée cible et envoie les alertes
   */
  private async processAlertsForDays(daysRemaining: number) {
    const today = new Date();
    
    // Définir le jour cible (Aujourd'hui + X jours)
    const targetDateStart = new Date();
    targetDateStart.setDate(today.getDate() + daysRemaining);
    targetDateStart.setHours(0, 0, 0, 0);

    const targetDateEnd = new Date();
    targetDateEnd.setDate(today.getDate() + daysRemaining);
    targetDateEnd.setHours(23, 59, 59, 999);

    // Récupérer les événements PLANIFIE qui tombent précisément sur ce jour-là
    const events = await this.repo.find({
      where: {
        statut: RegulatoryEventStatut.PLANIFIE,
        datePrevue: Between(targetDateStart, targetDateEnd),
      },
      relations: { responsable: true }, // Pour avoir l'email et le nom du responsable
    });

    if (events.length === 0) {
      this.logger.log(`🔍 J-${daysRemaining} : Aucun événement réglementaire trouvé pour cette échéance.`);
      return;
    }

    this.logger.warn(`⚠️ J-${daysRemaining} : ${events.length} événement(s) nécessitent une alerte !`);

    for (const event of events) {
      try {
        this.logger.log(`✉️ Envoi d'alerte à ${event.responsable.email} pour l'événement : ${event.titre}`);
        
        // 🎯 LOGIQUE D'ENVOI D'EMAIL (Exemple à adapter avec votre MailerService)
        /*
        await this.mailerService.sendMail({
          to: event.responsable.email,
          subject: `🚨 [Rappel J-${daysRemaining}] Obligation Réglementaire : ${event.titre}`,
          template: 'regulatory-deadline-alert', // votre template html
          context: {
            titre: event.titre,
            type: event.type.replace(/_/g, ' '),
            date: event.datePrevue.toLocaleDateString('fr-FR'),
            description: event.description,
            daysRemaining,
          },
        });
        */
        
      } catch (err) {
        this.logger.error(`❌ Échec de l'envoi de l'alerte pour l'événement #${event.id} :`, err.message);
      }
    }
  }
}