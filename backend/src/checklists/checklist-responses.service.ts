// src/checklists/checklist-responses.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklistResponse } from './checklist-response.entity';
import { ChecklistResponsePhoto } from './checklist-response-photo.entity';
import { ChecklistItem } from './checklist-item.entity';
import { ChecklistTemplate } from './checklist-template.entity';
import {
  CreateResponseDto,
  SubmitChecklistDto,
} from './dto/create-response.dto';
import * as puppeteer from 'puppeteer';

import { CotationType } from './enums/cotation-type.enum';
import {
  calculateScore,
  getScoreStatus,
  getCotationValues,
} from './utils/score-calculator';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ChecklistResponsesService {
  constructor(
    @InjectRepository(ChecklistResponse)
    private responseRepo: Repository<ChecklistResponse>,
    @InjectRepository(ChecklistResponsePhoto)
    private photoRepo: Repository<ChecklistResponsePhoto>,
    @InjectRepository(ChecklistItem)
    private itemRepo: Repository<ChecklistItem>,
    @InjectRepository(ChecklistTemplate)
    private templateRepo: Repository<ChecklistTemplate>,
  ) {}

  // ── Task 2 : Sauvegarder une réponse (item par item) ──
  async saveResponse(dto: CreateResponseDto): Promise<ChecklistResponse> {
    const item = await this.itemRepo.findOne({
      where: { id: dto.itemId },
      relations: {
        template: true,
      },
    });
    if (!item) throw new NotFoundException('Item introuvable');

    // Chercher réponse existante (si déjà répondu à cet item)
    let response = await this.responseRepo.findOne({
      where: {
        inspectionId: dto.inspectionId,
        item: { id: dto.itemId },
      },
      relations: {
        item: true,
        photos: true,
      },
    });

    if (response) {
      // Mettre à jour la réponse existante
      response.cotation = dto.cotation ?? response.cotation;
      response.observation = dto.observation ?? response.observation;
      response.analyseCauses = dto.analyseCauses ?? response.analyseCauses;
      response.responsable = dto.responsable ?? response.responsable;
      response.isDeviation = dto.isDeviation ?? response.isDeviation;
      if (dto.delai) response.delai = new Date(dto.delai);
    } else {
      // Créer nouvelle réponse
      response = this.responseRepo.create({
        inspectionId: dto.inspectionId,
        item,
        cotation: dto.cotation,
        observation: dto.observation,
        analyseCauses: dto.analyseCauses,
        responsable: dto.responsable,
        isDeviation: dto.isDeviation ?? false,
        delai: dto.delai ? new Date(dto.delai) : undefined,
        photos: [],
      });
    }

    return this.responseRepo.save(response);
  }

  // ── Task 5 : Upload photo pour un item ───────────────
  async addPhoto(
    inspectionId: string,
    itemId: string,
    file: Express.Multer.File,
  ): Promise<ChecklistResponsePhoto> {
    // Trouver ou créer la réponse
    let response = await this.responseRepo.findOne({
      where: {
        inspectionId,
        item: { id: itemId },
      },
      relations: {
        item: true,
        photos: true,
      },
    });

    if (!response) {
      const item = await this.itemRepo.findOne({ where: { id: itemId } });
      if (!item) throw new NotFoundException('Item introuvable');
      response = this.responseRepo.create({
        inspectionId,
        item,
        photos: [],
        isDeviation: false,
      });
      response = await this.responseRepo.save(response);
    }

    // Créer l'URL de la photo
    const url = `/uploads/checklists/${file.filename}`;

    const photo = this.photoRepo.create({
      response,
      filename: file.filename,
      url,
      originalName: file.originalname,
    });

    return this.photoRepo.save(photo);
  }

  // ── Récupérer toutes les réponses d'une inspection ───
  async getByInspection(inspectionId: string): Promise<ChecklistResponse[]> {
    return this.responseRepo.find({
      where: { inspectionId },
      relations: {
        item: {
          template: true,
        },
        photos: true,
      },
      order: { createdAt: 'ASC' },
    });
  }

  // ── Task 3 + 4 : Calculer le score final ─────────────
  async calculateInspectionScore(
    inspectionId: string,
    templateId: string,
  ): Promise<{
    score: number;
    status: 'VERT' | 'JAUNE' | 'ROUGE';
    totalItems: number;
    answeredItems: number;
    deviations: number;
    details: any[];
  }> {
    // Récupérer le template avec ses items
    const template = await this.templateRepo.findOne({
      where: { id: templateId },
      relations: {
        items: true,
      },
    });
    if (!template) throw new NotFoundException('Template introuvable');

    // Récupérer toutes les réponses de cette inspection
    const responses = await this.responseRepo.find({
      where: { inspectionId },
      relations: {
        item: true,
        photos: true,
      },
    });

    const totalItems = template.items.filter((i) => i.actif).length;
    const answeredItems = responses.filter((r) => r.cotation != null).length;
    const deviations = responses.filter((r) => r.isDeviation).length;

    // Préparer les données pour le calcul
    const reponsesForScore = responses
      .filter((r) => r.cotation != null)
      .map((r) => ({
        valeur: r.cotation === 'NA' ? 'NA' : Number(r.cotation),
        itemTarget: r.item?.target,
      }));

    const score = calculateScore(template.cotationType, reponsesForScore);
    const status = getScoreStatus(score);

    // Détail par item
    const details = template.items.map((item) => {
      const response = responses.find((r) => r.item?.id === item.id);
      return {
        itemId: item.id,
        section: item.section,
        libelle: item.libelle,
        target: item.target,
        cotation: response?.cotation ?? null,
        observation: response?.observation ?? null,
        isDeviation: response?.isDeviation ?? false,
        photos: response?.photos ?? [],
        answered: !!response?.cotation,
      };
    });

    return {
      score,
      status,
      totalItems,
      answeredItems,
      deviations,
      details,
    };
  }

  // ── Vérifier si la checklist est complète ────────────
  async isComplete(
    inspectionId: string,
    templateId: string,
  ): Promise<{ complete: boolean; missing: number }> {
    const template = await this.templateRepo.findOne({
      where: { id: templateId },
      relations: {
        items: true,
      },
    });
    if (!template) throw new NotFoundException('Template introuvable');

    const responses = await this.responseRepo.find({
      where: { inspectionId },
      relations: {
        item: true,
      },
    });

    const activeItems = template.items.filter((i) => i.actif);
    const answeredIds = responses
      .filter((r) => r.cotation != null)
      .map((r) => r.item?.id);

    const missing = activeItems.filter(
      (i) => !answeredIds.includes(i.id),
    ).length;

    return {
      complete: missing === 0,
      missing,
    };
  }

  // ── Supprimer une photo ───────────────────────────────
  async removePhoto(photoId: string): Promise<void> {
    const photo = await this.photoRepo.findOne({ where: { id: photoId } });
    if (!photo) throw new NotFoundException('Photo introuvable');

    // Supprimer le fichier physique
    const filePath = path.join(
      process.cwd(),
      'uploads/checklists',
      photo.filename,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.photoRepo.delete(photoId);
  }
  // Ajouter cette méthode dans ChecklistResponsesService

  async getFullResult(
    inspectionId: string,
    templateId: string,
  ): Promise<{
    inspectionId: string;
    template: {
      id: string;
      domaine: string;
      titre: string;
      cotationType: string;
      version: number;
    };
    score: number;
    status: 'VERT' | 'JAUNE' | 'ROUGE';
    totalItems: number;
    answeredItems: number;
    deviations: number;
    completionRate: number;
    sections: {
      name: string;
      items: {
        id: string;
        ordre: number;
        libelle: string;
        target: string;
        cotation: string | null;
        observation: string | null;
        analyseCauses: string | null;
        responsable: string | null;
        delai: Date | null;
        isDeviation: boolean;
        answered: boolean;
        photos: { id: string; url: string; originalName: string }[];
      }[];
      sectionScore: number;
      sectionAnswered: number;
      sectionTotal: number;
    }[];
  }> {
    // Récupérer le template avec items
    const template = await this.templateRepo.findOne({
      where: { id: templateId },
      relations: {
        items: true,
      },
      order: { items: { ordre: 'ASC' } },
    });
    if (!template) throw new NotFoundException('Template introuvable');

    // Récupérer toutes les réponses
    const responses = await this.responseRepo.find({
      where: { inspectionId },
      relations: {
        item: true,
        photos: true,
      },
    });

    const activeItems = template.items.filter((i) => i.actif);
    const totalItems = activeItems.length;
    const answeredItems = responses.filter((r) => r.cotation != null).length;
    const deviations = responses.filter((r) => r.isDeviation).length;
    const completionRate =
      totalItems > 0 ? Math.round((answeredItems / totalItems) * 100) : 0;

    // Calculer le score
    const reponsesForScore = responses
      .filter((r) => r.cotation != null)
      .map((r) => ({
        valeur: r.cotation === 'NA' ? 'NA' : Number(r.cotation),
        itemTarget: r.item?.target,
      }));

    const score = calculateScore(template.cotationType, reponsesForScore);
    const status = getScoreStatus(score);

    // Grouper par section
    const sectionNames = Array.from(
      new Set(activeItems.map((i) => i.section || 'Général')),
    );

    const sections = sectionNames.map((sectionName) => {
      const sectionItems = activeItems
        .filter((i) => (i.section || 'Général') === sectionName)
        .sort((a, b) => a.ordre - b.ordre);

      const sectionTotal = sectionItems.length;
      const sectionAnswered = sectionItems.filter((i) =>
        responses.find((r) => r.item?.id === i.id && r.cotation != null),
      ).length;

      // Score de la section
      const sectionResponses = sectionItems
        .map((i) => responses.find((r) => r.item?.id === i.id))
        .filter((r) => r?.cotation != null)
        .map((r) => ({
          valeur: r!.cotation === 'NA' ? 'NA' : Number(r!.cotation),
          itemTarget: r!.item?.target,
        }));

      const sectionScore = calculateScore(
        template.cotationType,
        sectionResponses,
      );

      const items = sectionItems.map((item) => {
        const response = responses.find((r) => r.item?.id === item.id);
        return {
          id: item.id,
          ordre: item.ordre,
          libelle: item.libelle,
          target: item.target ?? '',
          cotation: response?.cotation ?? null,
          observation: response?.observation ?? null,
          analyseCauses: response?.analyseCauses ?? null,
          responsable: response?.responsable ?? null,
          delai: response?.delai ?? null,
          isDeviation: response?.isDeviation ?? false,
          answered: !!response?.cotation,
          photos: (response?.photos ?? []).map((p) => ({
            id: p.id,
            url: p.url,
            originalName: p.originalName,
          })),
        };
      });

      return {
        name: sectionName,
        items,
        sectionScore,
        sectionAnswered,
        sectionTotal,
      };
    });

    return {
      inspectionId,
      template: {
        id: template.id,
        domaine: template.domaine,
        titre: template.titre,
        cotationType: template.cotationType,
        version: template.version,
      },
      score,
      status,
      totalItems,
      answeredItems,
      deviations,
      completionRate,
      sections,
    };
  }

  // Ajouter cette méthode dans ChecklistResponsesService
  async generatePdf(inspectionId: string, templateId: string): Promise<Buffer> {
    // Récupérer toutes les données
    const result = await this.getFullResult(inspectionId, templateId);

    // Couleur selon le statut
    const statusColor = {
      VERT: '#4CAF50',
      JAUNE: '#FFC107',
      ROUGE: '#F44336',
    }[result.status];

    // Construire le HTML du rapport
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #333; padding: 20px; }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: center;
              border-bottom: 3px solid #1F3864; padding-bottom: 16px; margin-bottom: 20px; }
    .logo { font-size: 22px; font-weight: 700; color: #1F3864; }
    .logo span { font-weight: 400; color: #666; }
    .header-info { text-align: right; font-size: 11px; color: #666; }

    /* Score box */
    .score-box { display: flex; gap: 16px; margin-bottom: 20px; }
    .score-card { flex: 1; border: 1px solid #eee; border-radius: 8px; padding: 12px; text-align: center; }
    .score-main { font-size: 36px; font-weight: 700; color: ${statusColor}; }
    .score-label { font-size: 11px; color: #666; margin-top: 4px; }
    .score-badge { display: inline-block; background: ${statusColor}; color: white;
                   padding: 4px 12px; border-radius: 12px; font-weight: 700; font-size: 13px; }
    .stat-value { font-size: 22px; font-weight: 700; color: #1F3864; }

    /* Info table */
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .info-table td { padding: 6px 10px; border: 1px solid #eee; font-size: 11px; }
    .info-table td:first-child { font-weight: 600; background: #f5f5f5; width: 160px; }

    /* Section */
    .section-header { background: #1F3864; color: white; padding: 8px 12px;
                      font-weight: 600; margin: 16px 0 8px; border-radius: 4px;
                      display: flex; justify-content: space-between; align-items: center; }
    .section-score { font-size: 11px; opacity: 0.85; }

    /* Items table */
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    .items-table th { background: #f0f4f8; padding: 7px 8px; text-align: left;
                      font-size: 10px; color: #666; border: 1px solid #e0e0e0;
                      text-transform: uppercase; letter-spacing: 0.04em; }
    .items-table td { padding: 7px 8px; border: 1px solid #e0e0e0; font-size: 11px;
                      vertical-align: top; }
    .items-table tr:nth-child(even) td { background: #fafafa; }

    /* Cotation badges */
    .cot-badge { display: inline-block; padding: 2px 8px; border-radius: 10px;
                 font-weight: 700; font-size: 12px; text-align: center; min-width: 30px; }
    .cot-ok   { background: #E8F5E9; color: #2E7D32; }
    .cot-warn { background: #FFF8E1; color: #F57F17; }
    .cot-bad  { background: #FFEBEE; color: #C62828; }
    .cot-na   { background: #F5F5F5; color: #757575; }
    .cot-empty { color: #ccc; font-style: italic; }

    /* Déviation */
    .deviation-row td { background: #FFF3E0 !important; }
    .deviation-tag { display: inline-block; background: #FF9800; color: white;
                     padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; }

    /* Deviations summary */
    .dev-summary { border: 1px solid #FFCC80; border-radius: 8px;
                   padding: 12px; margin-bottom: 20px; }
    .dev-summary h3 { color: #E65100; margin-bottom: 8px; font-size: 13px; }
    .dev-item { border-left: 3px solid #FF9800; padding: 6px 10px;
                margin-bottom: 6px; background: #FFF8E1; border-radius: 0 4px 4px 0; }
    .dev-item-title { font-weight: 600; font-size: 11px; color: #333; margin-bottom: 4px; }
    .dev-item-detail { font-size: 10px; color: #666; margin-top: 2px; }

    /* Footer */
    .footer { margin-top: 30px; border-top: 1px solid #eee; padding-top: 12px;
              display: flex; justify-content: space-between; font-size: 10px; color: #999; }

    /* Page break */
    .page-break { page-break-before: always; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div>
      <div class="logo">HSEE <span>Platform</span></div>
      <div style="font-size:11px; color:#666; margin-top:4px;">
        LEONI · Menzel Hayet · Rapport d'audit
      </div>
    </div>
    <div class="header-info">
      <div><strong>Rapport généré le</strong></div>
      <div>${new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}</div>
      <div style="margin-top:4px; color:#1F3864;">
        Inspection : ${inspectionId.slice(0, 8).toUpperCase()}
      </div>
    </div>
  </div>

  <!-- INFOS TEMPLATE -->
  <table class="info-table">
    <tr><td>Domaine</td><td>${result.template.domaine}</td></tr>
    <tr><td>Checklist</td><td>${result.template.titre}</td></tr>
    <tr><td>Type de cotation</td><td>${result.template.cotationType}</td></tr>
    <tr><td>Version</td><td>v${result.template.version}</td></tr>
    <tr><td>Date du rapport</td><td>${new Date().toLocaleDateString('fr-FR')}</td></tr>
  </table>

  <!-- SCORE CARDS -->
  <div class="score-box">
    <div class="score-card">
      <div class="score-main">${result.score}%</div>
      <div style="margin-top:6px;"><span class="score-badge">${result.status}</span></div>
      <div class="score-label">Score de conformité</div>
    </div>
    <div class="score-card">
      <div class="stat-value">${result.answeredItems}/${result.totalItems}</div>
      <div class="score-label" style="margin-top:4px;">Items répondus</div>
      <div style="margin-top:6px; font-size:13px; color:#666;">${result.completionRate}% complété</div>
    </div>
    <div class="score-card">
      <div class="stat-value" style="color:${result.deviations > 0 ? '#F44336' : '#4CAF50'}">
        ${result.deviations}
      </div>
      <div class="score-label" style="margin-top:4px;">Déviations</div>
      <div style="margin-top:6px; font-size:11px; color:#666;">
        ${result.deviations > 0 ? 'Actions requises' : 'Aucune déviation'}
      </div>
    </div>
  </div>

  <!-- RÉSUMÉ DÉVIATIONS -->
  ${
    result.deviations > 0
      ? `
  <div class="dev-summary">
    <h3>⚠️ Récapitulatif des déviations (${result.deviations})</h3>
    ${result.sections
      .flatMap((s) => s.items)
      .filter((i) => i.isDeviation)
      .map(
        (i) => `
      <div class="dev-item">
        <div class="dev-item-title">${i.libelle}</div>
        ${i.observation ? `<div class="dev-item-detail"><strong>Observation :</strong> ${i.observation}</div>` : ''}
        ${i.analyseCauses ? `<div class="dev-item-detail"><strong>Causes :</strong> ${i.analyseCauses}</div>` : ''}
        ${i.responsable ? `<div class="dev-item-detail"><strong>Responsable :</strong> ${i.responsable}</div>` : ''}
        ${i.delai ? `<div class="dev-item-detail"><strong>Délai :</strong> ${new Date(i.delai).toLocaleDateString('fr-FR')}</div>` : ''}
      </div>
    `,
      )
      .join('')}
  </div>
  `
      : ''
  }

  <!-- DÉTAIL PAR SECTION -->
  ${result.sections
    .map(
      (section, sIdx) => `
    ${sIdx > 0 && sIdx % 3 === 0 ? '<div class="page-break"></div>' : ''}

    <div class="section-header">
      <span>${section.name}</span>
      <span class="section-score">
        Score : ${section.sectionScore}% · ${section.sectionAnswered}/${section.sectionTotal} répondus
      </span>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th style="width:30px">#</th>
          <th>Libellé</th>
          <th style="width:60px; text-align:center">Cotation</th>
          <th style="width:60px; text-align:center">Cible</th>
          <th style="width:200px">Observation</th>
          <th style="width:80px; text-align:center">Statut</th>
        </tr>
      </thead>
      <tbody>
        ${section.items
          .map((item, idx) => {
            const cotClass = !item.cotation
              ? 'cot-empty'
              : item.cotation === 'NA'
                ? 'cot-na'
                : Number(item.cotation) === 0
                  ? 'cot-bad'
                  : Number(item.cotation) <= 1
                    ? 'cot-warn'
                    : 'cot-ok';

            return `
          <tr class="${item.isDeviation ? 'deviation-row' : ''}">
            <td style="color:#999; text-align:center">${idx + 1}</td>
            <td>${item.libelle}</td>
            <td style="text-align:center">
              ${
                item.cotation
                  ? `<span class="cot-badge ${cotClass}">${item.cotation}</span>`
                  : `<span style="color:#ccc;font-size:10px">—</span>`
              }
            </td>
            <td style="text-align:center; color:#666">${item.target || '—'}</td>
            <td style="font-size:10px; color:#555">${item.observation || ''}</td>
            <td style="text-align:center">
              ${
                item.isDeviation
                  ? `<span class="deviation-tag">Déviation</span>`
                  : item.answered
                    ? `<span style="color:#4CAF50; font-size:10px">✓ OK</span>`
                    : `<span style="color:#ccc; font-size:10px">—</span>`
              }
            </td>
          </tr>`;
          })
          .join('')}
      </tbody>
    </table>
  `,
    )
    .join('')}

  <!-- FOOTER -->
  <div class="footer">
    <span>LEONI Menzel Hayet · Département HSEE</span>
    <span>Rapport généré par HSEE Platform · ${new Date().getFullYear()}</span>
    <span>Réf. ${inspectionId.slice(0, 8).toUpperCase()}</span>
  </div>

</body>
</html>`;

    // Lancer Puppeteer et générer le PDF
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
      await page.setContent(html, {
        waitUntil: 'load',
      });
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
  // Dans checklist-responses.service.ts — ajouter cette méthode

  async getScoreHistory(domaine: string): Promise<{
    domaine: string;
    history: {
      date: string;
      score: number;
      status: string;
      inspectionId: string;
    }[];
  }> {
    // Récupérer tous les templates du domaine
    const templates = await this.templateRepo.find({
      where: { domaine: domaine as any },
      relations: { items: true },
    });
    if (!templates.length) return { domaine, history: [] };

    const templateIds = templates.map((t) => t.id);

    // Récupérer toutes les réponses groupées par inspection
    const responses = await this.responseRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.item', 'item')
      .leftJoinAndSelect('item.template', 'template')
      .where('template.id IN (:...templateIds)', { templateIds })
      .orderBy('r.createdAt', 'ASC')
      .getMany();

    // Grouper par inspectionId
    const byInspection: Record<string, typeof responses> = {};
    for (const r of responses) {
      if (!byInspection[r.inspectionId]) byInspection[r.inspectionId] = [];
      byInspection[r.inspectionId].push(r);
    }

    const history: {
      date: string;
      score: number;
      status: string;
      inspectionId: string;
    }[] = [];
    for (const [inspectionId, resps] of Object.entries(byInspection)) {
      // Prendre le template de la première réponse
      const template = resps[0]?.item?.template;
      if (!template) continue;

      const reponsesForScore = resps
        .filter((r) => r.cotation != null)
        .map((r) => ({
          valeur: r.cotation === 'NA' ? 'NA' : Number(r.cotation),
          itemTarget: r.item?.target,
        }));

      if (reponsesForScore.length === 0) continue;

      const score = calculateScore(template.cotationType, reponsesForScore);
      const status = getScoreStatus(score);
      const date = resps[resps.length - 1].createdAt;

      history.push({
        date: date.toISOString(),
        score,
        status,
        inspectionId,
      });
    }

    return { domaine, history };
  }
}
