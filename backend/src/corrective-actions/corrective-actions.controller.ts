import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CorrectiveActionsService } from './corrective-actions.service';
import { CreateCorrectiveActionDto } from './dto/create-corrective-action.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@Controller('corrective-actions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CorrectiveActionsController {
  constructor(private readonly service: CorrectiveActionsService) {}

  // POST /api/corrective-actions
  @Post()
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR)
  create(@Body() dto: CreateCorrectiveActionDto, @Request() req) {
    return this.service.create(dto, req.user.userId);
  }

  // GET /api/corrective-actions/my-actions ← Pilote voit ses actions
  @Get('my-actions')
  @Roles(Role.PILOTE_ACTION, Role.ADMIN_HSEE, Role.AUDITEUR)
  findMyActions(@Request() req) {
    return this.service.findMyActions(req.user.userId);
  }

  // GET /api/corrective-actions
  @Get()
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR)
  findAll(
    @Request() req,
    @Query('piloteId') piloteId?: string,
    @Query('statut') statut?: string,
    @Query('criticite') criticite?: string,
    @Query('domaine') domaine?: string,
  ) {
    const isAdmin = req.user.role === 'ADMIN_HSEE';
    return this.service.findAll({
      piloteId,
      statut,
      criticite,
      domaine,
      createdById: isAdmin ? undefined : req.user.userId,
    });
  }

  // GET /api/corrective-actions/:id
  @Get(':id')
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR, Role.PILOTE_ACTION)
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
