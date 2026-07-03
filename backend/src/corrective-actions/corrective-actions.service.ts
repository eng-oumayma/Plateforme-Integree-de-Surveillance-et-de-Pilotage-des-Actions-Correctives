import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorrectiveAction } from './corrective-action.entity';
import { Anomaly } from '../anomalies/anomaly.entity';
import { AnomalyStatus } from '../anomalies/enums/anomaly-status.enum';
import { User } from '../users/user.entity';
import { MailService } from '../mail/mail.service';
import { CreateCorrectiveActionDto } from './dto/create-corrective-action.dto';
import { ActionStatus } from './enums/action-status.enum';

@Injectable()
export class CorrectiveActionsService {
  constructor(
    @InjectRepository(CorrectiveAction)
    private actionRepo: Repository<CorrectiveAction>,
    @InjectRepository(Anomaly)
    private anomalyRepo: Repository<Anomaly>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private mailService: MailService,
  ) {}

  // ── US14 : Créer une action corrective ────────────────────────
  async create(
    dto: CreateCorrectiveActionDto,
    createdById: string,
  ): Promise<CorrectiveAction> {
    // Vérifier que l'anomalie existe
    const anomaly = await this.anomalyRepo.findOne({
      where: { id: dto.anomalyId },
      relations: { createdBy: true },
    });
    if (!anomaly) throw new NotFoundException('Anomalie introuvable');

    // Vérifier qu'une action n'existe pas déjà pour cette anomalie
    const existing = await this.actionRepo.findOne({
      where: { anomalyId: dto.anomalyId },
    });
    if (existing) {
      throw new BadRequestException(
        'Une action corrective existe déjà pour cette anomalie',
      );
    }

    // Vérifier que le pilote existe et est bien PILOTE_ACTION
    const pilote = await this.userRepo.findOne({ where: { id: dto.piloteId } });
    if (!pilote) throw new NotFoundException('Pilote introuvable');
    if (pilote.role !== 'PILOTE_ACTION') {
      throw new BadRequestException(
        "L'utilisateur sélectionné n'est pas un Pilote d'Action",
      );
    }

    // Créer l'action
    const action = this.actionRepo.create({
      anomalyId: dto.anomalyId,
      anomaly,
      description: dto.description,
      criticite: dto.criticite,
      piloteId: dto.piloteId,
      pilote,
      deadline: new Date(dto.deadline),
      criteresValidation: dto.criteresValidation,
      statut: ActionStatus.A_FAIRE,
      createdById,
      domaine: anomaly.domaine,
      site: anomaly.site,
      progression: 0,
    });

    const saved = await this.actionRepo.save(action);

    // Mettre à jour le statut de l'anomalie → ACTION_CREEE
    await this.anomalyRepo.update(dto.anomalyId, {
      statut: AnomalyStatus.ACTION_CREEE,
    });

    // Envoyer email au pilote
    try {
      const creator = await this.userRepo.findOne({
        where: { id: createdById },
      });
      if (!creator) {
        throw new NotFoundException('Utilisateur créateur introuvable');
      }
      await this.mailService.sendActionAssignedEmail(
        pilote.email,
        pilote.firstName,
        {
          id: saved.id,
          description: dto.description,
          criticite: dto.criticite,
          deadline: new Date(dto.deadline),
          anomalyDescription: anomaly.description,
          createdByName: `${creator.firstName} ${creator.lastName}`,
        },
      );
    } catch (e) {
      // L'email échoue silencieusement — l'action est créée quand même
      console.warn(
        'Email notification failed:',
        e instanceof Error ? e.message : String(e),
      );
    }

    return this.findById(saved.id);
  }

  // ── GET par ID ─────────────────────────────────────────────────
  async findById(id: string): Promise<CorrectiveAction> {
    const action = await this.actionRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.anomaly', 'anomaly')
      .leftJoinAndSelect('a.pilote', 'pilote')
      .leftJoinAndSelect('a.createdBy', 'createdBy')
      .leftJoinAndSelect('a.closedBy', 'closedBy')
      .select([
        'a',
        'anomaly.id',
        'anomaly.description',
        'anomaly.criticite',
        'anomaly.domaine',
        'pilote.id',
        'pilote.firstName',
        'pilote.lastName',
        'pilote.email',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
        'closedBy.id',
        'closedBy.firstName',
        'closedBy.lastName',
      ])
      .where('a.id = :id', { id })
      .getOne();

    if (!action) throw new NotFoundException('Action corrective introuvable');
    return action;
  }

  // ── GET toutes les actions ─────────────────────────────────────
  async findAll(filters: {
    piloteId?: string;
    statut?: string;
    criticite?: string;
    domaine?: string;
    createdById?: string;
  }): Promise<CorrectiveAction[]> {
    const qb = this.actionRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.anomaly', 'anomaly')
      .leftJoinAndSelect('a.pilote', 'pilote')
      .leftJoinAndSelect('a.createdBy', 'createdBy')
      .select([
        'a',
        'anomaly.id',
        'anomaly.description',
        'anomaly.criticite',
        'pilote.id',
        'pilote.firstName',
        'pilote.lastName',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
      ])
      .orderBy('a.createdAt', 'DESC');

    if (filters.piloteId)
      qb.andWhere('a.piloteId = :piloteId', { piloteId: filters.piloteId });
    if (filters.statut)
      qb.andWhere('a.statut = :statut', { statut: filters.statut });
    if (filters.criticite)
      qb.andWhere('a.criticite = :criticite', { criticite: filters.criticite });
    if (filters.domaine)
      qb.andWhere('a.domaine = :domaine', { domaine: filters.domaine });
    if (filters.createdById)
      qb.andWhere('a.createdById = :createdById', {
        createdById: filters.createdById,
      });

    return qb.getMany();
  }

  // ── GET actions du pilote connecté ─────────────────────────────
  async findMyActions(piloteId: string): Promise<CorrectiveAction[]> {
    return this.findAll({ piloteId });
  }
}
