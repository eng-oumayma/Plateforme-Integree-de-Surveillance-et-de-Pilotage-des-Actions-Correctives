import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
    private readonly dataSource: DataSource,
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
    latitude:   dto.latitude ?? undefined,   // 👈 Remplacé null par undefined
    longitude:  dto.longitude ?? undefined,
    timestamp:  new Date(),
    auditeurId,
    statut:     InspectionStatus.EN_COURS,
    planId:     dto.planId ?? undefined, // Stockage du lien côté inspection
  });

  const saved = await this.repo.save(inspection) as Inspection;
 
  
    // ── Lier automatiquement au plan si planId fourni ────────────────────
  if (dto.planId) {
    try {
      await this.planningService.update(dto.planId, {
        inspectionId: saved.id,
        statut: PlanStatut.EN_COURS, // Le planning passe en cours car l'inspection est démarrée
      });
  
      } catch (e) {
            console.warn(`[create] Échec liaison plan ${dto.planId}:`, e.message);
          }
      }

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


   /**
   * ── Vérifier que la checklist est complète avant clôture (US7 tâche 4) ──
   * Cette méthode interroge directement les tables SQL de l'Epic Checklist
   * de votre binôme, sans dépendance TypeScript directe (évite les imports
   * circulaires entre modules développés sur des branches différentes).
   *
   * Elle s'adapte automatiquement : si les tables n'existent pas encore
   * (votre binôme n'a pas fini), elle laisse passer avec un avertissement
   * plutôt que de bloquer tout le système.
   */
  private async checkChecklistComplete(inspection: Inspection): Promise<{
    complete: boolean;
    answered: number;
    total: number;
    anomaliesCount: number;
  }> {
    try {
      // 1. Trouver le template de checklist pour ce domaine
      const templateRows = await this.dataSource.query(
        `SELECT id FROM checklist_templates WHERE domaine = $1 LIMIT 1`,
        [inspection.domaine],
      );
 
      if (!templateRows || templateRows.length === 0) {
        // Pas de template pour ce domaine → on ne bloque pas (config manquante)
        console.warn(`[checkChecklistComplete] Aucun template trouvé pour domaine=${inspection.domaine}`);
        return { complete: true, answered: 0, total: 0, anomaliesCount: 0 };
      }
      const template_id = templateRows[0].id;
 
      // 2. Compter le nombre total d'items dans ce template
      const totalRows = await this.dataSource.query(
        `SELECT COUNT(*) as count FROM checklist_items WHERE "template_id" = $1`,
        [template_id],
      );
      const total = parseInt(totalRows[0]?.count ?? '0', 10);
 
      if (total === 0) {
        return { complete: true, answered: 0, total: 0, anomaliesCount: 0 };
      }
 
      // 3. Compter les réponses enregistrées pour cette inspection
      const answeredRows = await this.dataSource.query(
        `SELECT COUNT(*) as count FROM checklist_responses WHERE "inspectionId" = $1`,
        [inspection.id],
      );
      const answered = parseInt(answeredRows[0]?.count ?? '0', 10);
 
      // 4. Compter les anomalies détectées (réponses marquées NON/KO)
      const anomaliesRows = await this.dataSource.query(
        
          `SELECT COUNT(cr.id) as count
          FROM checklist_responses cr
          INNER JOIN checklist_items ci ON ci.id = cr.item_id
          WHERE cr. "inspectionId" = $1

          AND ci.template_id = $2
          AND cr. "isDeviation" = true`,

          [inspection.id, template_id],

          );
    
      const anomaliesCount = parseInt(anomaliesRows[0]?.count ?? '0', 10);
 
      return { complete: answered >= total, answered, total, anomaliesCount };
 
    } catch (err) {
      // Les tables checklist_* n'existent pas encore (binôme pas terminé)
      // → on ne bloque pas la clôture, juste un avertissement console
      console.warn(
        '[checkChecklistComplete] Tables checklist non trouvées — vérification ignorée. ' +
        'Erreur :', err.message,
      );
      return { complete: true, answered: 0, total: 0, anomaliesCount: 0 };
    }
  }



  /**
   * ── Clôturer une inspection (US7) ──────────────────────────────────────
   * Conditions :
   *  - Seul l'auditeur propriétaire (ou Admin) peut clôturer
   *  - L'inspection doit être EN_COURS
   *  - La checklist doit être complète (sinon 400)
   */
  async close(
    id: string,
    dto: CloseInspectionDto,
    requesterId: string,
    requesterRole: string,
  ): Promise<Inspection> {
    const inspection = await this.findOne(id);
 
    if (requesterRole !== 'ADMIN_HSEE' && inspection.auditeurId !== requesterId) {
      throw new ForbiddenException("Seul l'auditeur responsable peut clôturer cette inspection");
    }
 
    if (inspection.statut !== InspectionStatus.EN_COURS) {
      throw new BadRequestException(
        `Impossible de clôturer une inspection avec le statut "${inspection.statut}"`,
      );
    }
 
    // ── Vérification checklist complète (US7 tâche 4 — bloque si incomplet) ──
    const checklistCheck = await this.checkChecklistComplete(inspection);
    if (!checklistCheck.complete) {
      throw new BadRequestException(
        `Checklist incomplète : ${checklistCheck.answered}/${checklistCheck.total} questions répondues. ` +
        `Veuillez compléter la checklist avant de clôturer.`,
      );
    }
 
    const now = new Date();
    const durationMinutes = Math.round((now.getTime() - inspection.timestamp.getTime()) / 60000);
 
    inspection.statut = InspectionStatus.REALISE;
    inspection.closedById = requesterId;
    inspection.closedAt = now;
    inspection.dateRealise = now;
    inspection.durationMinutes = durationMinutes;
 
    const closed = await this.repo.save(inspection);
 
    if (inspection.planId) {
      try {
        await this.planningService.update(inspection.planId, {
          statut: PlanStatut.REALISE,
          inspectionId: closed.id,
        });
      } catch (e) {
        console.warn(`[close] plan ${inspection.planId}:`, e.message);
      }
    }
 
    return this.findOne(closed.id);
  }
 
  /**
   * GET helper pour le frontend : renvoie le statut de complétion checklist
   * sans clôturer — utilisé par CloseInspectionModal pour afficher le résumé
   */
  async getChecklistStatus(id: string) {
    const inspection = await this.findOne(id);
    return this.checkChecklistComplete(inspection);
  }
 
 

}