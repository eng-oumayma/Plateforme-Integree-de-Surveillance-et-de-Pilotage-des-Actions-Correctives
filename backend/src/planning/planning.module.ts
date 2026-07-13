import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanSurveillance } from './Plan-surveillance.entity';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { PlanningCronService } from './planning.cron';

@Module({
  imports: [TypeOrmModule.forFeature([PlanSurveillance])],
  controllers: [PlanningController],
  providers: [PlanningService, PlanningCronService],
  exports: [PlanningService],
})
export class PlanningModule {}

