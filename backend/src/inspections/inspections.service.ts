import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspection } from './inspection.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/Update-inspection.dto';
import { InspectionStatus } from '../common/enums/Inspection-status.enum';
import { Domaine } from '../common/enums/domaine.enum';

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(Inspection)
    private readonly repo: Repository<Inspection>,
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
  return this.findOne(saved.id);
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
      if (dto.statut === InspectionStatus.TERMINEE) {
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
}