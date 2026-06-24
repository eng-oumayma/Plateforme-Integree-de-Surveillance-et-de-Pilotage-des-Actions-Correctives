import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlanningService } from './planning.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Domaine } from '../common/enums/domaine.enum';
import { PlanStatut } from '../common/enums/Plan-statut.enum';

@Controller('planning')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  /**
   * POST /planning
   * Créer un plan avec génération automatique des occurrences selon la fréquence
   */
  @Post()
  @Roles('ADMIN_HSEE')
  create(@Body() dto: CreatePlanDto) {
    return this.planningService.create(dto);
  }

  /**
   * GET /planning?annee=2025&domaine=PLANT&statut=PLANIFIE
   * Liste du plan annuel — 52 semaines
   */
  @Get()
  @Roles('ADMIN_HSEE', 'AUDITEUR', 'PILOTE')
  findAll(
    @Query('annee', ParseIntPipe) annee: number,
    @Query('domaine') domaine?: Domaine,
    @Query('statut')  statut?: PlanStatut,
    @Query('site')    site?: string,
  ) {
    return this.planningService.findAll({ annee, domaine, statut, site });
  }

  /**
   * GET /planning/:id
   */
  @Get(':id')
  @Roles('ADMIN_HSEE', 'AUDITEUR')
  findOne(@Param('id') id: string) {
    return this.planningService.findOne(id);
  }

  /**
   * PATCH /planning/:id
   * Modifier statut, responsable, commentaire
   */
  @Patch(':id')
  @Roles('ADMIN_HSEE')
  update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.planningService.update(id, dto);
  }

  /**
   * DELETE /planning/:id
   */
  @Delete(':id')
  @Roles('ADMIN_HSEE')
  remove(@Param('id') id: string) {
    return this.planningService.remove(id);
  }

  /**
   * GET /planning/export/csv?annee=2025
   * Export CSV du plan annuel — avec BOM UTF-8 pour Excel
   */
  @Get('export/csv')
  @Roles('ADMIN_HSEE')
  async exportCsv(
    @Query('annee', ParseIntPipe) annee: number,
    @Res() res,
  ) {
    const csv = await this.planningService.exportCsv(annee);
    const filename = `plan-surveillance-${annee}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv);
  }

  /**
   * POST /planning/import/csv?annee=2025
   * Import CSV du plan Excel existant (multipart/form-data, champ "file")
   */
  @Post('import/csv')
  @Roles('ADMIN_HSEE')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(
    @UploadedFile() file: Express.Multer.File,
    @Query('annee', ParseIntPipe) annee: number,
  ) {
    const csvContent = file.buffer.toString('utf-8');
    return this.planningService.importFromCsv(csvContent, annee);
  }

  /**
   * POST /planning/cron/mark-overdue
   * Déclencher manuellement le job de marquage en retard (debug / admin)
   */
  @Post('cron/mark-overdue')
  @Roles('ADMIN_HSEE')
  async triggerMarkOverdue() {
    const count = await this.planningService.markOverdue();
    return { message: `${count} plan(s) passé(s) EN_RETARD` };
  }
}