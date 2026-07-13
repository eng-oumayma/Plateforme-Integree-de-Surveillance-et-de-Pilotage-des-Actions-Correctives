// src/anomalies/anomalies.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anomaly } from './anomaly.entity';
import { AnomalyPhoto } from './anomaly-photo.entity';
import { ChecklistItem } from '../checklists/checklist-item.entity';
import { AnomaliesService } from './anomalies.service';
import { AnomaliesController } from './anomalies.controller';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Anomaly, AnomalyPhoto, ChecklistItem, User])],
  controllers: [AnomaliesController],
  providers: [AnomaliesService],
  exports: [AnomaliesService],
})
export class AnomaliesModule {}
