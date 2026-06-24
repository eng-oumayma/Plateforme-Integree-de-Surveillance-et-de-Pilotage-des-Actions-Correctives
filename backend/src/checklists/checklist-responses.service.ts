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
}
