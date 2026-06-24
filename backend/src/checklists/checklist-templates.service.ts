// src/checklists/checklist-templates.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ChecklistTemplate } from './checklist-template.entity';
import { ChecklistItem } from './checklist-item.entity';
import { Domaine } from '../common/enums/domaine.enum';
import { CreateChecklistTemplateDto } from './dto/create-checklist-template.dto';
import * as XLSX from 'xlsx';
@Injectable()
export class ChecklistTemplatesService {
  constructor(
    @InjectRepository(ChecklistTemplate)
    private templateRepo: Repository<ChecklistTemplate>,
    @InjectRepository(ChecklistItem)
    private itemRepo: Repository<ChecklistItem>,
    private dataSource: DataSource,
  ) {}

  // ── CREATE avec versioning ─────────────────────────
  async create(dto: CreateChecklistTemplateDto): Promise<ChecklistTemplate> {
    // Désactiver l'ancien template actif du même domaine
    const existing = await this.templateRepo.findOne({
      where: { domaine: dto.domaine, actif: true },
      order: { version: 'DESC' },
    });

    const newVersion = existing ? existing.version + 1 : 1;

    if (existing) {
      await this.templateRepo.update(existing.id, { actif: false });
    }

    const items = (dto.items || []).map((item, index) =>
      this.itemRepo.create({ ...item, ordre: index }),
    );

    const template = this.templateRepo.create({
      domaine: dto.domaine,
      titre: dto.titre,
      cotationType: dto.cotationType,
      version: newVersion,
      actif: true,
      items,
    });

    return this.templateRepo.save(template);
  }

  // ── GET tous ───────────────────────────────────────
  async findAll(): Promise<ChecklistTemplate[]> {
    return this.templateRepo.find({
      relations: {
        items: true,
      },
      order: { domaine: 'ASC', version: 'DESC' },
    });
  }

  // ── GET par ID ─────────────────────────────────────
  async findById(id: string): Promise<ChecklistTemplate> {
    const t = await this.templateRepo.findOne({
      where: { id },
      relations: {
        items: true,
      },
    });
    if (!t) throw new NotFoundException('Template introuvable');
    return t;
  }

  // ── GET actif par domaine (utilisé par Epic 2) ─────
  async findActiveByDomaine(domaine: Domaine): Promise<ChecklistTemplate> {
    const t = await this.templateRepo.findOne({
      where: { domaine, actif: true },
      relations: {
        items: true,
      },
      order: { version: 'DESC' },
    });
    if (!t)
      throw new NotFoundException(
        `Aucun template actif pour le domaine ${domaine}`,
      );
    return t;
  }

  // ── UPDATE ─────────────────────────────────────────
  async update(
    id: string,
    dto: Partial<CreateChecklistTemplateDto>,
  ): Promise<ChecklistTemplate> {
    const t = await this.findById(id);
    if (dto.titre) t.titre = dto.titre;
    if (dto.cotationType) t.cotationType = dto.cotationType;
    return this.templateRepo.save(t);
  }

  // ── SOFT DELETE ────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id);
    await this.templateRepo.update(id, { actif: false });
    return { message: 'Template désactivé' };
  }

  // ── IMPORT depuis fichier Excel ────────────────────

  async importFromExcel(
    domaine: Domaine,
    titre: string,
    cotationType: string,
    fileBuffer: Buffer,
  ): Promise<ChecklistTemplate> {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: null,
      raw: false,
    });

    const items = this.parseRowsByDomaine(domaine, rows);

    if (items.length === 0) {
      throw new BadRequestException(
        `Aucun item trouvé pour le domaine ${domaine}. Vérifiez le format du fichier.`,
      );
    }

    return this.create({
      domaine,
      titre,
      cotationType: cotationType as any,
      items,
    });
  }

  private parseRowsByDomaine(domaine: Domaine, rows: any[][]): any[] {
    switch (domaine) {
      case Domaine.CANTINE:
        return this.parseCantineFormat(rows);

      case Domaine.INFIRMERIE:
      case Domaine.TRANSPORT: // même format 0/1/2
        return this.parseInfirmerieFormat(rows);

      case Domaine.PLANT:
      case Domaine.DECHETS:
        return this.parsePlantFormat(rows); // target variable

      case Domaine.SANITAIRES:
        return this.parseSanitairesFormat(rows); // 0/4/6/8/10

      case Domaine.CHIMIQUE:
      case Domaine.LOCAUX_TECHNIQUES:
      case Domaine.RECYCLEURS:
      case Domaine.INCENDIE:
        return this.parseLocauxRisquesFormat(rows); // 0/1

      default:
        return this.parsePlantFormat(rows);
    }
  }

  private parseCantineFormat(rows: any[][]): any[] {
    let section = 'Général';
    const items: any[] = [];
    for (const row of rows) {
      const v0 = row[0] != null ? String(row[0]).trim() : '';
      const v1 = row[1] != null ? String(row[1]).trim() : '';
      if (v0 && v0.includes('/') && v0.length > 5) {
        const beforeSlash = v0.split('/')[0].trim();
        if (isNaN(Number(beforeSlash)) || beforeSlash === '') {
          section = v0;
          continue;
        }
      }
      const num = Number(v0);
      if (!isNaN(num) && Number.isInteger(num) && num > 0 && v1.length > 5) {
        items.push({ section, libelle: v1, target: '' });
      }
    }
    return items;
  }

  private parseInfirmerieFormat(rows: any[][]): any[] {
    let section = 'Général';
    const items: any[] = [];
    for (const row of rows) {
      const v0 = row[0] != null ? String(row[0]).trim() : '';
      const v1 = row[1] != null ? String(row[1]).trim() : '';
      if (!v0 || v0 === 'nan') continue;
      const asNum = Number(v0);
      if (isNaN(asNum) && v0.length > 5 && /[a-zA-ZÀ-ÿ]/.test(v0)) {
        section = v0.replace(/:$/, '').trim();
        continue;
      }
      if (!isNaN(asNum) && Number.isInteger(asNum) && asNum > 0) {
        if (v1.length > 5 && !v1.toLowerCase().includes('cotation')) {
          items.push({ section, libelle: v1, target: '' });
        }
      }
    }
    return items;
  }

  private parsePlantFormat(rows: any[][]): any[] {
    let section = 'Général';
    const items: any[] = [];
    let dataStarted = false;
    for (const row of rows) {
      const v0 = row[0] != null ? String(row[0]).trim() : '';
      const v1 = row[1] != null ? String(row[1]).trim() : '';
      const v2 = row[2] != null ? String(row[2]).trim() : '';
      if (!v0 || v0 === 'nan') continue;
      if (v2 === 'Target' || v2 === 'Objectif' || v2 === 'Note') {
        dataStarted = true;
        continue;
      }
      if (!dataStarted) continue;
      if (v1 === '0' && v0.length > 3) {
        section = v0;
        continue;
      }
      const targetNum = Number(v2);
      if (v0.length > 5 && !isNaN(targetNum) && targetNum > 0) {
        items.push({ section, libelle: v0, target: v2 });
      }
    }
    return items;
  }

  private parseSanitairesFormat(rows: any[][]): any[] {
    let section = 'Général';
    const items: any[] = [];
    for (const row of rows) {
      const v0 = row[0] != null ? String(row[0]).trim() : '';
      const v1 = row[1] != null ? String(row[1]).trim() : '';
      if (!v0 || v0 === 'nan') continue;
      if (/^[A-Z]-\d+$/.test(v0) && v1.length > 5) {
        items.push({ section, libelle: v1, target: '' });
        continue;
      }
      if (
        v0.length > 10 &&
        !/^[A-Z]-\d+$/.test(v0) &&
        /[a-zA-ZÀ-ÿ]{5,}/.test(v0)
      ) {
        section = v0;
      }
    }
    return items;
  }

  private parseTransportFormat(rows: any[][]): any[] {
    const headerRow = rows[9] || [];
    const items: any[] = [];
    for (let col = 6; col < headerRow.length; col++) {
      const val = headerRow[col] != null ? String(headerRow[col]).trim() : '';
      if (val && val.length > 3 && val !== 'nan') {
        items.push({ section: 'Contrôle du bus', libelle: val, target: '' });
      }
    }
    [
      'Papier Conducteur (permis, visite médicale)',
      'Respect du code de la route',
      'Comportement au volant',
    ].forEach((lib) =>
      items.push({ section: 'Conducteur', libelle: lib, target: '' }),
    );
    return items;
  }
  // Ajouter dans checklist-templates.service.ts

  private parseLocauxRisquesFormat(rows: any[][]): any[] {
    let section = 'Général';
    const items: any[] = [];
    let dataStarted = false;

    for (const row of rows) {
      const v0 = row[0] != null ? String(row[0]).trim() : '';
      const v1 = row[1] != null ? String(row[1]).trim() : '';
      const v2 = row[2] != null ? String(row[2]).trim() : '';

      // Détecter le début des données
      if (v2 === 'Critère audité') {
        dataStarted = true;
        continue;
      }
      if (!dataStarted) continue;

      // Détecter section : col0 contient "A - Poste Transformateur" etc.
      if (v0 && v0.length > 3 && v1 === 'N°') {
        section = v0;
        continue;
      }
      if (v0 && v0.length > 3 && v1 === '1' && v2 && v2.length > 3) {
        section = v0;
      }

      // Détecter item : col1 = numéro, col2 = libelle
      const num = Number(v1);
      if (
        !isNaN(num) &&
        num > 0 &&
        v2 &&
        v2.length > 3 &&
        v2 !== 'Critère audité'
      ) {
        items.push({ section, libelle: v2, target: '1' }); // max = 1 (OUI/NON)
      }
    }
    return items;
  }
}
