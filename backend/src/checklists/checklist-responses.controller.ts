// src/checklists/checklist-responses.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { ChecklistResponsesService } from './checklist-responses.service';
import {
  CreateResponseDto,
  SubmitChecklistDto,
} from './dto/create-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import express from 'express';
// Créer le dossier uploads si absent
const uploadsDir = './uploads/checklists';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

@Controller('checklist-responses')
@UseGuards(JwtAuthGuard)
export class ChecklistResponsesController {
  constructor(private readonly service: ChecklistResponsesService) {}

  // POST /api/checklist-responses
  // Sauvegarder une réponse item par item (offline-friendly)
  @Post()
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR)
  saveResponse(@Body() dto: CreateResponseDto) {
    return this.service.saveResponse(dto);
  }

  // POST /api/checklist-responses/photo/:inspectionId/:itemId
  // Upload photo pour un item
  @Post('photo/:inspectionId/:itemId')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/checklists',
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
      fileFilter: (req, file, cb) => {
        const allowed = /jpg|jpeg|png|webp/;
        if (allowed.test(extname(file.originalname).toLowerCase())) {
          cb(null, true);
        } else {
          cb(
            new Error('Seules les images JPG, PNG, WEBP sont acceptées'),
            false,
          );
        }
      },
    }),
  )
  uploadPhoto(
    @Param('inspectionId') inspectionId: string,
    @Param('itemId') itemId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.addPhoto(inspectionId, itemId, file);
  }

  // GET /api/checklist-responses/:inspectionId
  // Récupérer toutes les réponses d'une inspection
  @Get(':inspectionId')
  getByInspection(@Param('inspectionId') inspectionId: string) {
    return this.service.getByInspection(inspectionId);
  }

  // GET /api/checklist-responses/:inspectionId/score/:templateId
  // Calculer le score final
  @Get(':inspectionId/score/:templateId')
  calculateScore(
    @Param('inspectionId') inspectionId: string,
    @Param('templateId') templateId: string,
  ) {
    return this.service.calculateInspectionScore(inspectionId, templateId);
  }

  // GET /api/checklist-responses/:inspectionId/complete/:templateId
  // Vérifier si la checklist est complète
  @Get(':inspectionId/complete/:templateId')
  checkComplete(
    @Param('inspectionId') inspectionId: string,
    @Param('templateId') templateId: string,
  ) {
    return this.service.isComplete(inspectionId, templateId);
  }

  // DELETE /api/checklist-responses/photo/:photoId
  @Delete('photo/:photoId')
  removePhoto(@Param('photoId') photoId: string) {
    return this.service.removePhoto(photoId);
  }
  // GET /api/inspections/:id/checklist
  // Réponse complète : items + cotations + score + déviations
  @Get('inspection/:inspectionId/full/:templateId')
  getFullResult(
    @Param('inspectionId') inspectionId: string,
    @Param('templateId') templateId: string,
  ) {
    return this.service.getFullResult(inspectionId, templateId);
  }
  // GET /api/checklist-responses/inspection/:inspectionId/pdf/:templateId
  // Générer et télécharger le PDF
  @Get('inspection/:inspectionId/pdf/:templateId')
  async exportPdf(
    @Param('inspectionId') inspectionId: string,
    @Param('templateId') templateId: string,
    @Res() res: express.Response,
  ) {
    const buffer = await this.service.generatePdf(inspectionId, templateId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="rapport-checklist-${inspectionId}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
  @Get('score-history/:domaine')
  getScoreHistory(@Param('domaine') domaine: string) {
    return this.service.getScoreHistory(domaine);
  }
}
