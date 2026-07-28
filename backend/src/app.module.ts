import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InspectionsModule } from './inspections/inspections.module';
import { Inspection } from './inspections/inspection.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { PlanningModule } from './planning/planning.module';
import { PlanSurveillance } from './planning/Plan-surveillance.entity';
import { CorrectiveActionsModule } from './corrective-actions/corrective-actions.module';
import { CorrectiveAction } from './corrective-actions/corrective-action.entity';
import { ChecklistTemplate } from './checklists/checklist-template.entity';
import { ChecklistItem } from './checklists/checklist-item.entity';
import { ChecklistsModule } from './checklists/checklists.module';
import { ChecklistResponsePhoto } from './checklists/checklist-response-photo.entity';
import { ChecklistResponse } from './checklists/checklist-response.entity';
import { ActionProof } from './corrective-actions/action-proof.entity';
import { ActionHistory } from './corrective-actions/action-history.entity';

// Ajouter ServeStaticModule pour servir les photos
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AnomaliesModule } from './anomalies/anomalies.module';
import { Anomaly } from './anomalies/anomaly.entity';
import { AnomalyPhoto } from './anomalies/anomaly-photo.entity';
import { RegulatoryEventsModule } from './regulatory-events/regulatory-events.module';
import { RegulatoryEvent } from './regulatory-events/entities/regulatory-event.entity';

import { ActionComment } from './corrective-actions/action-comment.entity';

import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/notification.entity';
import { Not } from 'typeorm';
import { BullModule } from '@nestjs/bull';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') || '5432', 10), //  Conversion propre
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [
          User,
          Inspection,
          PlanSurveillance,
          ChecklistTemplate,
          ChecklistItem,
          ChecklistResponse,
          ChecklistResponsePhoto,
          Anomaly,
          AnomalyPhoto,

          ActionProof,
          CorrectiveAction,
          ActionComment,
          RegulatoryEvent,
          ActionHistory,

          CorrectiveAction,
          RegulatoryEvent,
          Notification,
        ],
        synchronize: true,
        logging: false,
      }),
    }),
    UsersModule,
    AuthModule,
    InspectionsModule,
    ScheduleModule.forRoot(), // ← active les crons NestJS
    PlanningModule,
    ChecklistsModule,
    AnomaliesModule,
    CorrectiveActionsModule,
    RegulatoryEventsModule,

    NotificationsModule,
  ],
})
export class AppModule {}
