// src/anomalies/anomalies.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anomaly } from './anomaly.entity';
import { AnomalyPhoto } from './anomaly-photo.entity';
import { ChecklistItem } from '../checklists/checklist-item.entity';
import { CreateAnomalyDto } from './dto/create-anomaly.dto';
import { AnomalyStatus } from './enums/anomaly-status.enum';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AnomaliesService {
  constructor(
    @InjectRepository(Anomaly)
    private anomalyRepo: Repository<Anomaly>,
    @InjectRepository(AnomalyPhoto)
    private photoRepo: Repository<AnomalyPhoto>,
    @InjectRepository(ChecklistItem)
    private itemRepo: Repository<ChecklistItem>,
  ) {}

  // ── Task 3 + 4 : Créer une anomalie liée à inspection + item ──
  async create(dto: CreateAnomalyDto, userId: string): Promise<Anomaly> {
    let checklistItem: ChecklistItem | null = null;

    // Auto-link vers l'item checklist si fourni
    if (dto.checklistItemId) {
      checklistItem = await this.itemRepo.findOne({
        where: { id: dto.checklistItemId },
        relations: { template: true },
      });
      if (!checklistItem) {
        throw new NotFoundException('Item checklist introuvable');
      }
    }

    const anomaly = this.anomalyRepo.create({
      inspectionId: dto.inspectionId,
      checklistItem,
      description: dto.description,
      criticite: dto.criticite,
      statut: AnomalyStatus.OUVERTE,
      createdById: userId,
      domaine: dto.domaine ?? checklistItem?.template?.domaine,
      site: dto.site,
      photos: [],
    });

    return this.anomalyRepo.save(anomaly);
  }

  async addPhoto(
    anomalyId: string,
    file: Express.Multer.File,
  ): Promise<AnomalyPhoto> {
    const anomaly = await this.anomalyRepo.findOne({
      where: { id: anomalyId },
    });
    if (!anomaly) throw new NotFoundException('Anomalie introuvable');

    const url = `/uploads/anomalies/${file.filename}`;
    const photo = this.photoRepo.create({
      anomaly,
      filename: file.filename,
      url,
      originalName: file.originalname,
    });

    return this.photoRepo.save(photo);
  }

  // ── GET toutes les anomalies (avec filtres) ────────────────────
  // Remplacer la méthode findAll dans anomalies.service.ts

  async findAll(filters: {
    inspectionId?: string;
    criticite?: string;
    statut?: string;
    domaine?: string;
    site?: string;
    dateFrom?: string;
    dateTo?: string;
    pilote?: string;
    createdById?: string; // ← ajouter
  }): Promise<Anomaly[]> {
    const qb = this.anomalyRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.checklistItem', 'item')
      .leftJoinAndSelect('a.createdBy', 'creator')
      .leftJoinAndSelect('a.photos', 'photos')
      .select([
        'a',
        'item.id',
        'item.libelle',
        'item.section',
        'creator.id',
        'creator.firstName',
        'creator.lastName',
        'photos',
      ])
      .orderBy('a.createdAt', 'DESC');

    if (filters.inspectionId) {
      qb.andWhere('a.inspectionId = :inspectionId', {
        inspectionId: filters.inspectionId,
      });
    }
    if (filters.criticite) {
      qb.andWhere('a.criticite = :criticite', { criticite: filters.criticite });
    }
    if (filters.statut) {
      qb.andWhere('a.statut = :statut', { statut: filters.statut });
    }
    if (filters.domaine) {
      qb.andWhere('a.domaine = :domaine', { domaine: filters.domaine });
    }
    if (filters.site) {
      qb.andWhere('a.site = :site', { site: filters.site });
    }
    if (filters.dateFrom) {
      qb.andWhere('a.createdAt >= :dateFrom', {
        dateFrom: new Date(filters.dateFrom),
      });
    }
    if (filters.dateTo) {
      qb.andWhere('a.createdAt <= :dateTo', {
        dateTo: new Date(filters.dateTo),
      });
    }
    if (filters.pilote) {
      qb.leftJoin('corrective_actions', 'ca', 'ca.anomalyId = a.id').andWhere(
        'ca.piloteId = :pilote',
        { pilote: filters.pilote },
      );
    }
    // ← Nouveau filtre par créateur
    if (filters.createdById) {
      qb.andWhere('a.createdById = :createdById', {
        createdById: filters.createdById,
      });
    }

    return qb.getMany();
  }
  // ── Stats pour les indicateurs de criticité ────────────────────────
  async getStats(filters: {
    domaine?: string;
    site?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    total: number;
    byCriticite: Record<string, number>;
    byStatut: Record<string, number>;
    byDomaine: { domaine: string; count: number }[];
  }> {
    const qb = this.anomalyRepo.createQueryBuilder('a');

    if (filters.domaine)
      qb.andWhere('a.domaine = :domaine', { domaine: filters.domaine });
    if (filters.site) qb.andWhere('a.site = :site', { site: filters.site });
    if (filters.dateFrom)
      qb.andWhere('a.createdAt >= :dateFrom', {
        dateFrom: new Date(filters.dateFrom),
      });
    if (filters.dateTo)
      qb.andWhere('a.createdAt <= :dateTo', {
        dateTo: new Date(filters.dateTo),
      });

    const anomalies = await qb.getMany();

    const byCriticite: Record<string, number> = {
      FAIBLE: 0,
      MODERE: 0,
      CRITIQUE: 0,
      BLOQUANT: 0,
    };
    const byStatut: Record<string, number> = {
      OUVERTE: 0,
      ACTION_CREEE: 0,
      EN_TRAITEMENT: 0,
      CLOTUREE: 0,
    };
    const domaineMap: Record<string, number> = {};

    for (const a of anomalies) {
      byCriticite[a.criticite] = (byCriticite[a.criticite] ?? 0) + 1;
      byStatut[a.statut] = (byStatut[a.statut] ?? 0) + 1;
      if (a.domaine) domaineMap[a.domaine] = (domaineMap[a.domaine] ?? 0) + 1;
    }

    const byDomaine = Object.entries(domaineMap)
      .map(([domaine, count]) => ({ domaine, count }))
      .sort((a, b) => b.count - a.count);

    return { total: anomalies.length, byCriticite, byStatut, byDomaine };
  }

  // ── GET une anomalie par ID ──────────────────────────────────────
  async findById(id: string): Promise<Anomaly> {
    const anomaly = await this.anomalyRepo.findOne({
      where: { id },
      relations: { checklistItem: true, createdBy: true, photos: true },
    });
    if (!anomaly) throw new NotFoundException('Anomalie introuvable');
    return anomaly;
  }

  // ── GET anomalies d'une inspection ───────────────────────────────
  async findByInspection(inspectionId: string): Promise<Anomaly[]> {
    return this.findAll({ inspectionId });
  }

  // ── Mettre à jour le statut ──────────────────────────────────────
  async updateStatus(id: string, statut: AnomalyStatus): Promise<Anomaly> {
    const anomaly = await this.findById(id);
    anomaly.statut = statut;
    return this.anomalyRepo.save(anomaly);
  }

  // ── Supprimer une photo ──────────────────────────────────────────
  async removePhoto(photoId: string): Promise<void> {
    const photo = await this.photoRepo.findOne({ where: { id: photoId } });
    if (!photo) throw new NotFoundException('Photo introuvable');

    const filePath = path.join(
      process.cwd(),
      'uploads/anomalies',
      photo.filename,
    );
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await this.photoRepo.delete(photoId);
  }
  async generatePdf(filters: {
    criticite?: string;
    statut?: string;
    domaine?: string;
    site?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Buffer> {
    const anomalies = await this.findAll(filters);
    const stats = await this.getStats(filters);

    const critColors: Record<string, string> = {
      FAIBLE: '#4CAF50',
      MODERE: '#FFC107',
      CRITIQUE: '#FF9800',
      BLOQUANT: '#F44336',
    };
    const critLabels: Record<string, string> = {
      FAIBLE: 'Faible',
      MODERE: 'Modéré',
      CRITIQUE: 'Critique',
      BLOQUANT: 'Bloquant',
    };
    const statusLabels: Record<string, string> = {
      OUVERTE: 'Ouverte',
      ACTION_CREEE: 'Action créée',
      EN_TRAITEMENT: 'En traitement',
      CLOTUREE: 'Clôturée',
    };

    const filterSummary =
      [
        filters.domaine && `Domaine : ${filters.domaine}`,
        filters.criticite && `Criticité : ${critLabels[filters.criticite]}`,
        filters.statut && `Statut : ${statusLabels[filters.statut]}`,
        filters.site && `Site : ${filters.site}`,
        filters.dateFrom &&
          `Du : ${new Date(filters.dateFrom).toLocaleDateString('fr-FR')}`,
        filters.dateTo &&
          `Au : ${new Date(filters.dateTo).toLocaleDateString('fr-FR')}`,
      ]
        .filter(Boolean)
        .join(' · ') || 'Aucun filtre appliqué';

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; font-size: 12px; color: #333; padding: 20px; }

.header { display: flex; justify-content: space-between; align-items: center;
          border-bottom: 3px solid #1F3864; padding-bottom: 16px; margin-bottom: 16px; }
.logo { font-size: 22px; font-weight: 700; color: #1F3864; }
.logo span { font-weight: 400; color: #666; }
.header-info { text-align: right; font-size: 11px; color: #666; }

.filters-box { background: #f5f7fa; border-radius: 6px; padding: 8px 12px;
               font-size: 11px; color: #555; margin-bottom: 16px; }

.stats-row { display: flex; gap: 10px; margin-bottom: 20px; }
.stat-card { flex: 1; border: 1px solid #eee; border-radius: 8px; padding: 10px; text-align: center; }
.stat-value { font-size: 22px; font-weight: 700; }
.stat-label { font-size: 10px; color: #666; margin-top: 2px; }

table { width: 100%; border-collapse: collapse; }
th { background: #f0f4f8; padding: 7px 8px; text-align: left; font-size: 10px;
     color: #666; border: 1px solid #e0e0e0; text-transform: uppercase; }
td { padding: 7px 8px; border: 1px solid #e0e0e0; font-size: 11px; vertical-align: top; }
tr:nth-child(even) td { background: #fafafa; }

.crit-badge { display: inline-block; padding: 2px 8px; border-radius: 10px;
              font-weight: 700; font-size: 10px; color: white; }
.status-badge { display: inline-block; padding: 2px 8px; border-radius: 10px;
                font-size: 10px; border: 1px solid #ccc; color: #555; }

.footer { margin-top: 24px; border-top: 1px solid #eee; padding-top: 10px;
          display: flex; justify-content: space-between; font-size: 10px; color: #999; }
</style>
</head>
<body>

<div class="header">
  <div>
    <div class="logo">HSEE <span>Platform</span></div>
    <div style="font-size:11px;color:#666;margin-top:4px;">LEONI · Rapport des anomalies</div>
  </div>
  <div class="header-info">
    <div><strong>Généré le</strong></div>
    <div>${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
  </div>
</div>

<div class="filters-box"><strong>Filtres appliqués :</strong> ${filterSummary}</div>

<div class="stats-row">
  <div class="stat-card"><div class="stat-value">${stats.total}</div><div class="stat-label">Total</div></div>
  ${Object.entries(critColors)
    .map(
      ([key, color]) => `
    <div class="stat-card">
      <div class="stat-value" style="color:${color}">${stats.byCriticite[key] ?? 0}</div>
      <div class="stat-label">${critLabels[key]}</div>
    </div>
  `,
    )
    .join('')}
</div>

<table>
  <thead>
    <tr>
      <th style="width:70px">Date</th>
      <th>Description</th>
      <th style="width:90px">Domaine</th>
      <th style="width:70px">Criticité</th>
      <th style="width:90px">Statut</th>
      <th style="width:100px">Créé par</th>
    </tr>
  </thead>
  <tbody>
    ${anomalies
      .map(
        (a) => `
      <tr>
        <td>${new Date(a.createdAt).toLocaleDateString('fr-FR')}</td>
        <td>${a.description}</td>
        <td>${a.domaine || '—'}</td>
        <td><span class="crit-badge" style="background:${critColors[a.criticite]}">${critLabels[a.criticite]}</span></td>
        <td><span class="status-badge">${statusLabels[a.statut]}</span></td>
        <td>${a.createdBy ? `${a.createdBy.firstName} ${a.createdBy.lastName}` : '—'}</td>
      </tr>
    `,
      )
      .join('')}
  </tbody>
</table>

<div class="footer">
  <span>LEONI Menzel Hayet · Département HSEE</span>
  <span>${anomalies.length} anomalie(s) listée(s)</span>
</div>

</body>
</html>`;

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'load' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' },
      });
      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}
