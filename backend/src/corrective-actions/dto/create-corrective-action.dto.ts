// src/corrective-actions/dto/create-corrective-action.dto.ts
import {
  IsUUID,
  IsString,
  IsEnum,
  IsDateString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Criticality } from '../../anomalies/enums/criticality.enum';

export class CreateCorrectiveActionDto {
  @IsUUID()
  anomalyId!: string;

  @IsString()
  @MinLength(5, { message: 'La description doit faire au moins 5 caractères' })
  description!: string;

  @IsEnum(Criticality, { message: 'Criticité invalide' })
  criticite!: Criticality;

  @IsUUID('4', { message: 'piloteId doit être un UUID valide' })
  piloteId!: string;

  @IsDateString({}, { message: 'Format de date invalide' })
  deadline!: string;

  @IsString()
  @IsOptional()
  criteresValidation?: string;
}
