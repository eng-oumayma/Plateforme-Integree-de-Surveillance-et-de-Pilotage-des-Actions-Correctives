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
=======

import { ChecklistTemplate } from './checklists/checklist-template.entity';
import { ChecklistItem } from './checklists/checklist-item.entity';
import { ChecklistsModule } from './checklists/checklists.module';
import { ChecklistResponsePhoto } from './checklists/checklist-response-photo.entity';
import { ChecklistResponse } from './checklists/checklist-response.entity';
// Ajouter ServeStaticModule pour servir les photos
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  entities: [User,Inspection,PlanSurveillance, ChecklistTemplate,
          ChecklistItem,
          ChecklistResponse, // ← ajouter
          ChecklistResponsePhoto],
  synchronize: true, 
  logging: false,
}),
    }),
    UsersModule,
    AuthModule,
    InspectionsModule,
    ScheduleModule.forRoot(),   // ← active les crons NestJS
    PlanningModule,
    ChecklistsModule,
  ],
})
export class AppModule {}
