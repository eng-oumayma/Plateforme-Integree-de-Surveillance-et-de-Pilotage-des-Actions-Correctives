// src/checklists/checklists.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ChecklistTemplate } from './checklist-template.entity';
import { ChecklistItem } from './checklist-item.entity';
import { ChecklistTemplatesService } from './checklist-templates.service';
import { ChecklistTemplatesController } from './checklist-templates.controller';
import { ChecklistResponse } from './checklist-response.entity';
import { ChecklistResponsePhoto } from './checklist-response-photo.entity';
import { ChecklistResponsesService } from './checklist-responses.service';
import { ChecklistResponsesController } from './checklist-responses.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChecklistTemplate,
      ChecklistItem,
      ChecklistResponse,
      ChecklistResponsePhoto,
    ]),
    MulterModule.register({ limits: { fileSize: 5 * 1024 * 1024 } }),
  ],
  controllers: [ChecklistTemplatesController, ChecklistResponsesController],
  providers: [ChecklistTemplatesService, ChecklistResponsesService],
  exports: [ChecklistTemplatesService, ChecklistResponsesService], // exporté pour Epic 2
})
export class ChecklistsModule {}
