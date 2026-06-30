// src/anomalies/dto/create-anomaly.dto.ts
import {
  IsUUID,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Criticality } from '../enums/criticality.enum';

export class CreateAnomalyDto {
  @IsUUID()
  inspectionId!: string;

  @IsUUID()
  @IsOptional()
  checklistItemId?: string; // optionnel — anomalie peut être libre

  @IsString()
  @MinLength(5, { message: 'La description doit faire au moins 5 caractères' })
  description!: string;

  @IsEnum(Criticality, { message: 'Criticité invalide' })
  criticite!: Criticality;

  @IsString()
  @IsOptional()
  domaine?: string;

  @IsString()
  @IsOptional()
  site?: string;
}
