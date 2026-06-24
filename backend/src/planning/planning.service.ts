import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { PlanSurveillance } from './Plan-surveillance.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Frequence } from '../common/enums/Frequence.enum';
import { PlanStatut } from '../common/enums/Plan-statut.enum';
import { Domaine } from '../common/enums/domaine.enum';

@Injectable()
export class PlanningService {
  constructor(
    @InjectRepository(PlanSurveillance)
    private readonly repo: Repository<PlanSurveillance>,
  ) {}

  // ── Helper : date du lundi d'une semaine ISO ──────────────────────────────
  private getMondayOfWeek(annee: number, semaine: number): Date {
    const jan4 = new Date(annee, 0, 4);
    const dayOfWeek = jan4.getDay() || 7;
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - (dayOfWeek - 1) + (semaine - 1) * 7);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  private getSundayOfWeek(annee: number, semaine: number): Date {
    const monday = this.getMondayOfWeek(annee, semaine);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return sunday;
  }

  // ── Helper : semaines à générer selon la fréquence ───────────────────────
  private getSemainesForFrequence(
    semaineDebut: number,
    frequence: Frequence,
  ): number[] {
    const semaines: number[] = [];
    let step: number;

    switch (frequence) {
      case Frequence.HEBDOMADAIRE:  step = 1;  break;
      case Frequence.MENSUEL:       step = 4;  break;
      case Frequence.TRIMESTRIEL:   step = 13; break;
      case Frequence.ANNUEL:        step = 52; break;
      default:                      step = 1;
    }

    for (let s = semaineDebut; s <= 52; s += step) {
      semaines.push(s);
    }
    return semaines;
  }

  // ── Créer un plan avec génération des occurrences ─────────────────────────
  async create(dto: CreatePlanDto): Promise<PlanSurveillance[]> {
    const semaines = this.getSemainesForFrequence(dto.semaineDebut, dto.frequence);
    const created: PlanSurveillance[] = [];

    for (const semaine of semaines) {
      // Vérifier unicité
      const exists = await this.repo.findOne({
        where: { annee: dto.annee, semaine, domaine: dto.domaine },
      });
      if (exists) continue; // Skip si déjà planifié

      const plan = this.repo.create({
        semaine,
        annee:        dto.annee,
        domaine:      dto.domaine,
        frequence:    dto.frequence,
        site:         dto.site,
        responsableId: dto.responsableId ?? null,
        commentaire:  dto.commentaire ?? null,
        statut:       PlanStatut.PLANIFIE,
        dateDebut:    this.getMondayOfWeek(dto.annee, semaine),
        dateFin:      this.getSundayOfWeek(dto.annee, semaine),
        autoGenere:   false,
      });
      created.push(await this.repo.save(plan));
    }

    return created;
  }

  // ── Lister le plan annuel (52 semaines) ──────────────────────────────────
  async findAll(options: {
    annee: number;
    domaine?: Domaine;
    statut?: PlanStatut;
    site?: string;
  }): Promise<PlanSurveillance[]> {
    const where: any = { annee: options.annee };
    if (options.domaine) where.domaine = options.domaine;
    if (options.statut)  where.statut  = options.statut;
    if (options.site)    where.site    = options.site;

    return this.repo.find({
      where,
      relations: { responsable: true },
      order: { semaine: 'ASC', domaine: 'ASC' },
    });
  }

  // ── Récupérer un plan par ID ──────────────────────────────────────────────
  async findOne(id: string): Promise<PlanSurveillance> {
    const plan = await this.repo.findOne({
      where: { id },
      relations: { responsable: true },
    });
    if (!plan) throw new NotFoundException(`Plan #${id} introuvable`);
    return plan;
  }

  // ── Mettre à jour un plan ─────────────────────────────────────────────────
  async update(id: string, dto: UpdatePlanDto): Promise<PlanSurveillance> {
    const plan = await this.findOne(id);
    if (dto.statut)       plan.statut       = dto.statut;
    if (dto.responsableId !== undefined) plan.responsableId = dto.responsableId;
    if (dto.commentaire   !== undefined) plan.commentaire   = dto.commentaire;
    if (dto.inspectionId  !== undefined) plan.inspectionId  = dto.inspectionId;
    return this.repo.save(plan);
  }

  // ── Supprimer un plan (et ses occurrences) ────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const plan = await this.findOne(id);
    await this.repo.delete(id);
    return { message: `✅ Plan semaine ${plan.semaine}/${plan.annee} supprimé` };
  }

  // ── CRON : marquer En Retard les planifiés dépassés ──────────────────────
  async markOverdue(): Promise<number> {
    const now = new Date();
    const result = await this.repo
      .createQueryBuilder()
      .update(PlanSurveillance)
      .set({ statut: PlanStatut.EN_RETARD })
      .where('statut = :statut', { statut: PlanStatut.PLANIFIE })
      .andWhere('dateFin < :now', { now })
      .execute();
    return result.affected ?? 0;
  }

  // ── CRON : générer automatiquement les plans de la semaine suivante ───────
  async autoGenerateNextWeek(): Promise<number> {
    const now    = new Date();
    const annee  = now.getFullYear();
    // Calculer la semaine ISO courante
    const startOfYear = new Date(annee, 0, 1);
    const dayOfYear   = Math.ceil(
      (now.getTime() - startOfYear.getTime()) / 86400000,
    );
    const currentWeek = Math.ceil(dayOfYear / 7);
    const nextWeek    = currentWeek + 1;
    if (nextWeek > 52) return 0;

    // Trouver tous les plans HEBDOMADAIRE actifs et créer pour la semaine suivante
    const hebdo = await this.repo.find({
      where: { frequence: Frequence.HEBDOMADAIRE, annee },
    });

    let count = 0;
    for (const plan of hebdo) {
      const exists = await this.repo.findOne({
        where: { annee, semaine: nextWeek, domaine: plan.domaine },
      });
      if (exists) continue;

      const next = this.repo.create({
        semaine:      nextWeek,
        annee,
        domaine:      plan.domaine,
        frequence:    plan.frequence,
        site:         plan.site,
        responsableId: plan.responsableId,
        statut:       PlanStatut.PLANIFIE,
        dateDebut:    this.getMondayOfWeek(annee, nextWeek),
        dateFin:      this.getSundayOfWeek(annee, nextWeek),
        autoGenere:   true,
      });
      await this.repo.save(next);
      count++;
    }
    return count;
  }

  // ── Import CSV ─────────────────────────────────────────────────────────────
  // Format CSV attendu : domaine;site;semaine;annee;frequence;responsableId
  async importFromCsv(csvContent: string, annee: number): Promise<{ imported: number; skipped: number }> {
    const lines   = csvContent.split('\n').filter((l) => l.trim());
    const headers = lines[0].split(';').map((h) => h.trim().toLowerCase());
    let imported  = 0;
    let skipped   = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(';').map((v) => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => (row[h] = values[idx] || ''));

      const semaine  = parseInt(row['semaine']  || row['week'] || '0', 10);
      const domaine  = row['domaine']  as Domaine;
      const site     = row['site']     || '';
      const frequence = (row['frequence'] || 'HEBDOMADAIRE').toUpperCase() as Frequence;
      const rowAnnee = parseInt(row['annee'] || row['year'] || String(annee), 10);

      if (!semaine || semaine < 1 || semaine > 52 || !domaine || !site) {
        skipped++;
        continue;
      }

      const exists = await this.repo.findOne({
        where: { annee: rowAnnee, semaine, domaine },
      });
      if (exists) { skipped++; continue; }

      const plan = this.repo.create({
        semaine,
        annee:      rowAnnee,
        domaine,
        frequence,
        site,
        statut:     PlanStatut.PLANIFIE,
        dateDebut:  this.getMondayOfWeek(rowAnnee, semaine),
        dateFin:    this.getSundayOfWeek(rowAnnee, semaine),
        autoGenere: false,
      });
      await this.repo.save(plan);
      imported++;
    }

    return { imported, skipped };
  }

  // ── Export CSV ─────────────────────────────────────────────────────────────
  async exportCsv(annee: number): Promise<string> {
    const plans = await this.findAll({ annee });
    const header = ['ID', 'Semaine', 'Annee', 'Domaine', 'Site', 'Frequence', 'Statut', 'Date Debut', 'Date Fin', 'Responsable'].join(';');
    const rows = plans.map((p) => [
      p.id,
      p.semaine,
      p.annee,
      p.domaine,
      p.site,
      p.frequence,
      p.statut,
      p.dateDebut ? new Date(p.dateDebut).toLocaleDateString('fr-FR') : '',
      p.dateFin   ? new Date(p.dateFin).toLocaleDateString('fr-FR')   : '',
      p.responsable ? `${p.responsable.firstName} ${p.responsable.lastName}` : '',
    ].join(';'));
    return [header, ...rows].join('\n');
  }
}