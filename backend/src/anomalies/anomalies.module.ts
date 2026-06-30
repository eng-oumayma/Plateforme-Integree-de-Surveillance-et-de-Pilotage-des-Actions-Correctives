// src/anomalies/anomalies.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anomaly } from './anomaly.entity';
import { AnomalyPhoto } from './anomaly-photo.entity';
import { ChecklistItem } from '../checklists/checklist-item.entity';
import { AnomaliesService } from './anomalies.service';
import { AnomaliesController } from './anomalies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Anomaly, AnomalyPhoto, ChecklistItem])],
  controllers: [AnomaliesController],
  providers: [AnomaliesService],
  exports: [AnomaliesService],
})
export class AnomaliesModule {}
