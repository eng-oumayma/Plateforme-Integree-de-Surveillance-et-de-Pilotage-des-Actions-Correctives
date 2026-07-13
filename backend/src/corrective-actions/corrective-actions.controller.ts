import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  Put,
  ForbiddenException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CorrectiveActionsService } from './corrective-actions.service';
import { CreateCorrectiveActionDto } from './dto/create-corrective-action.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ActionStatus } from './enums/action-status.enum';
import { Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { Sse, MessageEvent } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { CreateCommentDto } from './dto/create-comment.dto';
const proofsDir = './uploads/proofs';
if (!fs.existsSync(proofsDir)) fs.mkdirSync(proofsDir, { recursive: true });
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

  // ── Task 2 : PUT /corrective-actions/:id/status ────────────────
  @Put(':id/status')
  @Roles(Role.PILOTE_ACTION, Role.ADMIN_HSEE, Role.AUDITEUR)
  updateStatus(
    @Param('id') id: string,
    @Body('statut') statut: ActionStatus,
    @Body('progression') progression: number,
    @Request() req,
  ) {
    return this.service.updateStatus(
      id,
      statut,
      progression,
      req.user.userId,
      req.user.role,
    );
  }
  // POST /api/corrective-actions/:id/proofs
  @Post(':id/proofs')
  @Roles(Role.PILOTE_ACTION, Role.ADMIN_HSEE, Role.AUDITEUR)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/proofs',
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
      fileFilter: (req, file, cb) => {
        // Accepter images + PDF + docs Office
        const allowed = /jpg|jpeg|png|webp|pdf|doc|docx|xls|xlsx/;
        if (allowed.test(extname(file.originalname).toLowerCase())) {
          cb(null, true);
        } else {
          cb(
            new Error('Format non accepté. Formats: JPG, PNG, PDF, DOC, XLS'),
            false,
          );
        }
      },
    }),
  )
  uploadProof(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.service.addProof(id, file, req.user.userId);
  }

  // GET /api/corrective-actions/:id/proofs
  @Get(':id/proofs')
  @Roles(Role.PILOTE_ACTION, Role.ADMIN_HSEE, Role.AUDITEUR)
  getProofs(@Param('id') id: string) {
    return this.service.getProofs(id);
  }

  // DELETE /api/corrective-actions/proofs/:proofId
  @Delete('proofs/:proofId')
  @Roles(Role.PILOTE_ACTION, Role.ADMIN_HSEE, Role.AUDITEUR)
  removeProof(@Param('proofId') proofId: string, @Request() req) {
    return this.service.removeProof(proofId, req.user.userId, req.user.role);
  }
  // POST /api/corrective-actions/:id/comments
  @Post(':id/comments')
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR, Role.PILOTE_ACTION)
  addComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @Request() req,
  ) {
    return this.service.addComment(id, dto, req.user.userId);
  }

  // GET /api/corrective-actions/:id/comments
  @Get(':id/comments')
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR, Role.PILOTE_ACTION)
  getComments(@Param('id') id: string) {
    return this.service.getComments(id);
  }

  // GET /api/corrective-actions/:id/comments/stream  ← SSE polling
  @Sse(':id/comments/stream')
  @UseGuards(JwtAuthGuard)
  streamComments(@Param('id') id: string): Observable<MessageEvent> {
    // Polling toutes les 30s via SSE
    return interval(30000).pipe(
      switchMap(() => this.service.getComments(id)),
      map((comments) => ({ data: JSON.stringify(comments) }) as MessageEvent),
    );
  }
  // PUT /api/corrective-actions/:id/validate
  @Put(':id/validate')
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR)
  validate(@Param('id') id: string, @Request() req) {
    return this.service.validate(id, req.user.userId, req.user.role);
  }

  // PUT /api/corrective-actions/:id/reject
  @Put(':id/reject')
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR)
  reject(
    @Param('id') id: string,
    @Body('motif') motif: string,
    @Request() req,
  ) {
    return this.service.reject(id, motif, req.user.userId, req.user.role);
  }

  // GET /api/corrective-actions/:id/history
  @Get(':id/history')
  @Roles(Role.ADMIN_HSEE, Role.AUDITEUR, Role.PILOTE_ACTION)
  getHistory(@Param('id') id: string) {
    return this.service.getHistory(id);
  }
}
