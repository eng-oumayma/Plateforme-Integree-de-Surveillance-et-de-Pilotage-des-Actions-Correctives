import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspection } from './inspection.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/Update-inspection.dto';
import { InspectionStatus } from '../common/enums/Inspection-status.enum';
import { Domaine } from '../common/enums/domaine.enum';
import { PlanningService } from 'src/planning/planning.service';
import { PlanStatut } from 'src/common/enums/Plan-statut.enum';
import { CloseInspectionDto } from './dto/Close-inspection.dto';

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(Inspection)
    private readonly repo: Repository<Inspection>,
    private readonly planningService: PlanningService,
  ) {}

async create(
  dto: CreateInspectionDto,
  requesterId: string,   // ID de l'utilisateur connecté (depuis JWT)
  requesterRole: string, // rôle de l'utilisateur connecté
): Promise<Inspection> {
 
  // Si Admin → utilise l'auditeurId choisi dans le formulaire
  // Si Auditeur → utilise son propre ID (depuis le token JWT)
  const auditeurId =
    requesterRole === 'ADMIN_HSEE' && dto.auditeurId
      ? dto.auditeurId
      : requesterId;
 
  const inspection = this.repo.create({
    domaine:    dto.domaine,
    site:       dto.site,
    datePrevue: new Date(dto.datePrevue),
    latitude:   dto.latitude  ?? null,
    longitude:  dto.longitude ?? null,
    timestamp:  new Date(),
    auditeurId,
    statut:     InspectionStatus.EN_COURS,
  });
 
  const saved = await this.repo.save(inspection);
    // ── Lier automatiquement au plan si planId fourni ────────────────────
  if (dto.planId) {
    await this.planningService.update(dto.planId, {
      
      inspectionId: saved.id,
    });
  }


  return this.findOne(saved.id);
}



 
  // ── Clôturer une inspection (US7) ─────────────────────────────────────────
  async close(id: string, dto: CloseInspectionDto, requesterId: string): Promise<Inspection> {
    const inspection = await this.findOne(id);
 
    if (inspection.auditeurId !== requesterId) {
      throw new ForbiddenException("Seul l'auditeur responsable peut clôturer cette inspection");
    }
 
    if (inspection.statut !== InspectionStatus.EN_COURS) {
      throw new BadRequestException(
        `Impossible de clôturer une inspection avec le statut "${inspection.statut}"`,
      );
    }
 
    // ── Vérification checklist (Epic 3 — à activer quand les réponses existent) ──
    // const responses = await this.checklistResponseRepo.count({ where: { inspectionId: id, answered: true } });
    // const total     = await this.checklistItemRepo.count({ where: { templateId: inspection.checklistId } });
    // if (responses < total) throw new BadRequestException(`Checklist incomplète : ${responses}/${total} réponses`);
 
    const now             = new Date();
    const durationMinutes = Math.round((now.getTime() - inspection.timestamp.getTime()) / 60000);
 
    inspection.statut          = InspectionStatus.REALISE;  // ✅ REALISE à la clôture
    inspection.closedById      = requesterId;
    inspection.closedAt        = now;
    inspection.dateRealise     = now;
    inspection.durationMinutes = durationMinutes;
 
    const closed = await this.repo.save(inspection);
 
    // ✅ C'est ici qu'on met à jour le plan (inspection terminée = plan réalisé)
    if (inspection.planId) {
      try {
        await this.planningService.update(inspection.planId, {
          statut:       PlanStatut.REALISE,
          inspectionId: closed.id,
        });
      } catch (e) {
        console.warn(`[close] Impossible de lier le plan ${inspection.planId}:`, e.message);
      }
    }
 
    return this.findOne(closed.id);
  }
 
  // ── Lister les inspections ────────────────────────────────────────────────
  async findAll(options: {
    auditeurId?: string;
    domaine?: Domaine;
    site?: string;
    statut?: InspectionStatus;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Inspection[]> {
    const qb = this.repo
      .createQueryBuilder('inspection')
      .leftJoinAndSelect('inspection.auditeur', 'auditeur')
      .select([
        'inspection',
        'auditeur.id',
        'auditeur.firstName',
        'auditeur.lastName',
        'auditeur.email',
      ])
      .orderBy('inspection.datePrevue', 'ASC');

    if (options.auditeurId) {
      qb.andWhere('inspection.auditeurId = :auditeurId', {
        auditeurId: options.auditeurId,
      });
    }
    if (options.domaine) {
      qb.andWhere('inspection.domaine = :domaine', {
        domaine: options.domaine,
      });
    }
    if (options.site) {
      qb.andWhere('inspection.site ILIKE :site', {
        site: `%${options.site}%`,
      });
    }
    if (options.statut) {
      qb.andWhere('inspection.statut = :statut', {
        statut: options.statut,
      });
    }
    if (options.dateFrom) {
      qb.andWhere('inspection.datePrevue >= :dateFrom', {
        dateFrom: new Date(options.dateFrom),
      });
    }
    if (options.dateTo) {
      qb.andWhere('inspection.datePrevue <= :dateTo', {
        dateTo: new Date(options.dateTo),
      });
    }

    return qb.getMany();
  }

  // ── Récupérer une inspection par ID ──────────────────────────────────────
  async findOne(id: string): Promise<Inspection> {
    const inspection = await this.repo
      .createQueryBuilder('inspection')
      .leftJoinAndSelect('inspection.auditeur', 'auditeur')
      .select([
        'inspection',
        'auditeur.id',
        'auditeur.firstName',
        'auditeur.lastName',
        'auditeur.email',
      ])
      .where('inspection.id = :id', { id })
      .getOne();

    if (!inspection) {
      throw new NotFoundException(`Inspection #${id} introuvable`);
    }
    return inspection;
  }

  // ── Mettre à jour le statut ───────────────────────────────────────────────
  async updateStatut(
    id: string,
    dto: UpdateInspectionDto,
    requesterId: string,
    requesterRole: string,
  ): Promise<Inspection> {
    const inspection = await this.findOne(id);

    // Seul l'auditeur propriétaire ou un admin peut modifier
    if (
      requesterRole !== 'ADMIN_HSEE' &&
      inspection.auditeurId !== requesterId
    ) {
      throw new ForbiddenException(
        "Vous ne pouvez modifier que vos propres inspections",
      );
    }

    if (dto.statut) {
      inspection.statut = dto.statut;
      // Horodater la fin si on passe à TERMINEE
      if (dto.statut ===InspectionStatus.REALISE) {         //InspectionStatus.REALISE
        inspection.dateRealise = new Date();
      }
    }

    return this.repo.save(inspection);
  }

  // ── Supprimer une inspection ──────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const inspection = await this.findOne(id);
    await this.repo.delete(id);
    return {
      message: `✅ Inspection #${id} (${inspection.domaine} - ${inspection.site}) supprimée`,
    };
  }


  // // ── Modifier une inspection ───────────────────────────────────────────────
  async update(
    id: string,
    dto: UpdateInspectionDto,
    requesterId: string,
    requesterRole: string,
  ): Promise<Inspection> {
    const inspection = await this.findOne(id);
 
    if (requesterRole !== 'ADMIN_HSEE' && inspection.auditeurId !== requesterId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres inspections');
    }
 
    if (dto.domaine)    inspection.domaine    = dto.domaine;
    if (dto.site)       inspection.site       = dto.site.trim();
    if (dto.datePrevue) inspection.datePrevue = new Date(dto.datePrevue);
    if (dto.statut)     inspection.statut     = dto.statut;
 
    return this.repo.save(inspection);
  }
}