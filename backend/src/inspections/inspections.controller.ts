import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';

import { InspectionsService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/Update-inspection.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Domaine } from '../common/enums/domaine.enum';
import { InspectionStatus } from '../common/enums/Inspection-status.enum';

@Controller('inspections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  /**
   * POST /inspections
   * Création inspection par auditeur ou admin
   */
  @Post()
  @Roles('ADMIN_HSEE', 'AUDITEUR')
  create(@Body() dto: CreateInspectionDto, @Request() req) {
    return this.inspectionsService.create(
      dto,
      req.user.userId, // ID utilisateur connecté
      req.user.role, // rôle utilisateur connecté
    );
  }

  /**
   * GET /inspections
   */
  @Get()
  @Roles('ADMIN_HSEE', 'AUDITEUR', 'PILOTE_ACTION')
  findAll(
    @Request() req,
    @Query('domaine') domaine?: Domaine,
    @Query('site') site?: string,
    @Query('statut') statut?: InspectionStatus,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const isAdmin = req.user.role === 'ADMIN_HSEE';

    return this.inspectionsService.findAll({
      auditeurId: isAdmin ? undefined : req.user.userId,
      domaine,
      site,
      statut,
      dateFrom,
      dateTo,
    });
  }

  /**
   * GET /inspections/:id
   */
  @Get(':id')
  @Roles('ADMIN_HSEE', 'AUDITEUR', 'PILOTE_ACTION')
  findOne(@Param('id') id: string) {
    return this.inspectionsService.findOne(id);
  }

  /**
   * PATCH /inspections/:id/statut
   */
  @Patch(':id/statut')
  @Roles('ADMIN_HSEE', 'AUDITEUR', 'PILOTE_ACTION')
  updateStatut(
    @Param('id') id: string,
    @Body() dto: UpdateInspectionDto,
    @Request() req,
  ) {
    return this.inspectionsService.updateStatut(
      id,
      dto,
      req.user.userId,
      req.user.role,
    );
  }

  /**
   * DELETE /inspections/:id
   */
  @Delete(':id')
  @Roles('ADMIN_HSEE')
  remove(@Param('id') id: string) {
    return this.inspectionsService.remove(id);
  }
}
