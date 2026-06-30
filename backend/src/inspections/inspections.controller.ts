// import {
//   Controller,
//   Post,
//   Get,
//   Patch,
//   Delete,
//   Body,
//   Param,
//   Query,
//   UseGuards,
//   Request,
//   Req,
// } from '@nestjs/common';
// import { InspectionsService } from './inspections.service';
// import { CreateInspectionDto } from './dto/create-inspection.dto';
// import { UpdateInspectionDto } from './dto/Update-inspection.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../common/guards/roles.guard';
// import { Roles } from '../common/decorators/roles.decorator';
// import { Domaine } from '../common/enums/domaine.enum';
// import { InspectionStatus } from '../common/enums/Inspection-status.enum';

// @Controller('inspections')
// @UseGuards(JwtAuthGuard, RolesGuard)
// export class InspectionsController {
//   constructor(private readonly inspectionsService: InspectionsService) {}

//  /**
//    * POST /inspections
//    * L'Auditeur crée une inspection — son ID vient du JWT (req.user.sub)
//    * Il ne fournit PAS auditeurId dans le body
//    * Il peut fournir planId si l'inspection réalise un plan planifié
//    */
//   @Post()
//   @Roles('ADMIN_HSEE', 'AUDITEUR')

//   create(@Body() dto: CreateInspectionDto, @Req() req) {
//      const requesterId   = req.user.userId;
//     const requesterRole = req.user?.role;
//     return this.inspectionsService.create(dto, requesterId, requesterRole);

//   create(@Body() dto: CreateInspectionDto, @Request() req) {
//     return this.inspectionsService.create(
//       dto,
//       req.user.userId, // ID du connecté
//       req.user.role, // rôle du connecté
//     );

//   }
// }

//   /**
//    * GET /inspections
//    * Admin → toutes les inspections
//    * Auditeur → uniquement les siennes
//    */
//   @Get()
//   @Roles('ADMIN_HSEE', 'AUDITEUR', 'PILOTE_ACTION')
//   findAll(
//     @Request() req,
//     @Query('domaine') domaine?: Domaine,
//     @Query('site') site?: string,
//     @Query('statut') statut?: InspectionStatus,
//     @Query('dateFrom') dateFrom?: string,
//     @Query('dateTo') dateTo?: string,
//   ) {
//     const isAdmin = req.user.role === 'ADMIN_HSEE';
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
//   @Roles('ADMIN_HSEE', 'AUDITEUR', 'PILOTE_ACTION')
//   findOne(@Param('id') id: string) {
//     return this.inspectionsService.findOne(id);
//   }

//   /**
//    * PATCH /inspections/:id/statut
//    * Mettre à jour le statut (TERMINEE, VALIDEE, ANNULEE)
//    */
//   @Patch(':id/statut')
//   @Roles('ADMIN_HSEE', 'AUDITEUR', 'PILOTE_ACTION')
//   updateStatut(
//     @Param('id') id: string,
//     @Body() dto: UpdateInspectionDto,
//     @Request() req,
//   ) {
//     return this.inspectionsService.updateStatut(
//       id,
//       dto,
//       req.user.sub,
//       req.user.role,
//     );
//   }

//   /**
//    * DELETE /inspections/:id
//    */
//   @Delete(':id')
//   @Roles('ADMIN_HSEE')
//   remove(@Param('id') id: string) {
//     return this.inspectionsService.remove(id);
//   }


//   /**
//    * PATCH /inspections/:id
//    */
//   // @Patch(':id')
//   // @Roles('ADMIN_HSEE', 'AUDITEUR')
//   // update(
//   //   @Param('id') id: string,
//   //   @Body() dto: UpdateInspectionDto,
//   //   @Req() req,
//   // ) {
//   //   return this.inspectionsService.update(
//   //     id, dto,
//   //     req.user?.sub ?? req.user?.id,
//   //     req.user?.role,
//   //   );
//   // }


// }


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
  Req,
} from '@nestjs/common';

import { InspectionsService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/Update-inspection.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Domaine } from '../common/enums/domaine.enum';
import { InspectionStatus } from '../common/enums/Inspection-status.enum';
import { CloseInspectionDto } from './dto/Close-inspection.dto';

@Controller('inspections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  /**
   * POST /inspections
   * L'Auditeur crée une inspection — son ID vient du JWT (req.user.sub)
   * Il ne fournit PAS auditeurId dans le body
   * Il peut fournir planId si l'inspection réalise un plan planifié
   */
  @Post()
  @Roles('ADMIN_HSEE', 'AUDITEUR')

  create(@Body() dto: CreateInspectionDto, @Req() req) {
     const requesterId   = req.user.userId;
    const requesterRole = req.user?.role;
    return this.inspectionsService.create(dto, requesterId, requesterRole);

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
      auditeurId: isAdmin ? undefined : req.user.sub,
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
    const requesterId = req.user.sub || req.user.userId;
    return this.inspectionsService.updateStatut(
      id,
      dto,
      req.user.sub,
      req.user.role,
    );
  }

  @Patch(':id')
  @Roles('ADMIN_HSEE', 'AUDITEUR')
  update(@Param('id') id: string, @Body() dto: UpdateInspectionDto, @Req() req) {
    return this.inspectionsService.update(id, dto, req.user.userId, req.user.role);
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

