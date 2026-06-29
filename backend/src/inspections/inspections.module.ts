import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inspection } from './inspection.entity';
import { InspectionsService } from './inspections.service';
import { InspectionsController } from './inspections.controller';
import { PlanningModule } from 'src/planning/planning.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inspection]),PlanningModule],
  controllers: [InspectionsController],
  providers: [InspectionsService],
  exports: [InspectionsService],
})
export class InspectionsModule {}