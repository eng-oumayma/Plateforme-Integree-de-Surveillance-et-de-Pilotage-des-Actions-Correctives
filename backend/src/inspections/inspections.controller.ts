// import {
//   Controller, Post, Get, Patch, Body, Param,
//   Query, UseGuards, Request,
// } from '@nestjs/common';
// import { InspectionsService } from './inspections.service';
// import { CreateInspectionDto } from './dto/create-inspection.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { Domaine } from '../common/enums/domaine.enum';

// @Controller('inspections')
// @UseGuards(JwtAuthGuard, RolesGuard)
// export class InspectionsController {
//   constructor(private readonly inspectionsService: InspectionsService) {}

//   /**
//    * POST /inspections
//    * Auditeur crée une inspection — le timestamp est injecté côté serveur.
//    */
//   @Post()
//   @Roles('ADMIN', 'AUDITEUR', 'PILOTE_ACTION')
//   create(@Body() dto: CreateInspectionDto, @Request() req) {
//     return this.inspectionsService.create(dto, req.user.sub);
//   }

//   /**
//    * GET /inspections
//    * - Admin voit toutes les inspections
//    * - Auditeur voit seulement les siennes
//    */
//   @Get()
//   @Roles('ADMIN', 'AUDITEUR', 'PILOTE_ACTION')
//   findAll(
//     @Request() req,
//     @Query('domaine') domaine?: Domaine,
//     @Query('site') site?: string,
//     @Query('statut') statut?: string,
//     @Query('dateFrom') dateFrom?: string,
//     @Query('dateTo') dateTo?: string,
//   ) {
//     const isAdmin = req.user.role === 'ADMIN';
//     return this.inspectionsService.findAll({
//       auditeurId: isAdmin ? undefined : req.user.sub,
//       domaine,
//       site,
//       statut,
//       dateFrom,
//       dateTo,
//     });
//   }

//   /**
//    * GET /inspections/:id
//    */
//   @Get(':id')
//   @Roles('ADMIN', 'AUDITEUR', 'PILOTE_ACTION')
//   findOne(@Param('id') id: string) {
//     return this.inspectionsService.findOne(id);
//   }

//   /**
//    * PATCH /inspections/:id/statut
//    * Mettre à jour le statut (TERMINEE, VALIDEE, ANNULEE)
//    */
//   @Patch(':id/statut')
//   @Roles('ADMIN', 'AUDITEUR', 'PILOTE_ACTION')
//   updateStatut(@Param('id') id: string, @Body('statut') statut: string) {
//     return this.inspectionsService.updateStatut(id, statut);
//   }
// }
