// src/anomalies/anomalies.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { AnomaliesService } from './anomalies.service';
import { CreateAnomalyDto } from './dto/create-anomaly.dto';
import { AnomalyStatus } from './enums/anomaly-status.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { Res } from '@nestjs/common';
import express from 'express';
// Créer le dossier uploads si absent
const uploadsDir = './uploads/anomalies';
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

@Controller('anomalies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnomaliesController {
  constructor(private readonly service: AnomaliesService) {}

  // POST /api/anomalies
  @Post()
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR)
  create(@Body() dto: CreateAnomalyDto, @Request() req) {
    return this.service.create(dto, req.user.userId);
  }

  // POST /api/anomalies/:id/photo
  @Post(':id/photo')
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/anomalies',
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = /jpg|jpeg|png|webp/;
        if (allowed.test(extname(file.originalname).toLowerCase()))
          cb(null, true);
        else
          cb(
            new Error('Seules les images JPG, PNG, WEBP sont acceptées'),
            false,
          );
      },
    }),
  )
  uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.addPhoto(id, file);
  }

  // GET /api/anomalies
  // Remplacer la méthode findAll dans anomalies.controller.ts

  // GET /api/anomalies/stats — indicateurs de criticité
  @Get('stats')
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR)
  getStats(
    @Query('domaine') domaine?: string,
    @Query('site') site?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.service.getStats({ domaine, site, dateFrom, dateTo });
  }

  // GET /api/anomalies/inspection/:inspectionId
  @Get('inspection/:inspectionId')
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR)
  findByInspection(@Param('inspectionId') inspectionId: string) {
    return this.service.findByInspection(inspectionId);
  }

  // GET /api/anomalies/:id
  @Get(':id')
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR)
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  // PATCH /api/anomalies/:id/status
  @Patch(':id/status')
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR)
  updateStatus(@Param('id') id: string, @Body('statut') statut: AnomalyStatus) {
    return this.service.updateStatus(id, statut);
  }

  // DELETE /api/anomalies/photo/:photoId
  @Delete('photo/:photoId')
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR)
  removePhoto(@Param('photoId') photoId: string) {
    return this.service.removePhoto(photoId);
  }
  // GET /api/anomalies/export/pdf
  // Remplacer la méthode findAll dans anomalies.controller.ts

  @Get()
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR)
  findAll(
    @Request() req,
    @Query('inspectionId') inspectionId?: string,
    @Query('criticite') criticite?: string,
    @Query('statut') statut?: string,
    @Query('domaine') domaine?: string,
    @Query('site') site?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('pilote') pilote?: string,
  ) {
    const isAdmin = req.user.role === 'ADMIN_HSEE';

    const filters: any = {
      inspectionId,
      criticite,
      statut,
      domaine,
      site,
      dateFrom,
      dateTo,
      pilote,
    };
    if (!isAdmin) filters.createdById = req.user.userId;

    return this.service.findAll(filters);
  }

  // Même correction pour export PDF
  @Get('export/pdf')
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR)
  async exportPdf(
    @Request() req,
    @Res() res: express.Response,
    @Query('criticite') criticite?: string,
    @Query('statut') statut?: string,
    @Query('domaine') domaine?: string,
    @Query('site') site?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const isAdmin = req.user.role === 'ADMIN_HSEE';

    const filters: any = {
      criticite,
      statut,
      domaine,
      site,
      dateFrom,
      dateTo,
    };
    if (!isAdmin) filters.createdById = req.user.userId;

    const buffer = await this.service.generatePdf(filters);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="rapport-anomalies-${new Date().toISOString().slice(0, 10)}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
