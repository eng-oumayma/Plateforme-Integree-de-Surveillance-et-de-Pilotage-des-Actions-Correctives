import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsCronService } from './alerts-cron.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { CorrectiveAction } from '../corrective-actions/corrective-action.entity';
import { Inspection } from '../inspections/inspection.entity';
import { RegulatoryEvent } from '../regulatory-events/entities/regulatory-event.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    // Indispensable pour injecter les Repositories dans votre service de Cron
    TypeOrmModule.forFeature([CorrectiveAction, Inspection, RegulatoryEvent, User]),
    NotificationsModule,
  ],
  providers: [AlertsCronService],
})
export class AlertsModule {}