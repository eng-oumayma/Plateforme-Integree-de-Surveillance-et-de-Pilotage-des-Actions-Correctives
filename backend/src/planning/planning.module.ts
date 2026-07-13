import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanSurveillance } from './Plan-surveillance.entity';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { PlanningCronService } from './planning.cron';
import { use } from 'passport';

import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanSurveillance , User])],
  controllers: [PlanningController],
  providers: [PlanningService, PlanningCronService],
  exports: [PlanningService],
})
export class PlanningModule {}

