import {
  IsEnum,
  IsInt,
  IsString,
  IsOptional,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Domaine } from '../../common/enums/domaine.enum';
import { Frequence } from '../../common/enums/Frequence.enum';

export class CreatePlanDto {
  @IsEnum(Domaine, { message: 'Domaine invalide' })
  domaine: Domaine;

  @IsEnum(Frequence, { message: 'Fréquence invalide' })
  frequence: Frequence;

  @IsString()
  site: string;

  @IsInt()
  @Min(2024)
  @Max(2100)
  annee: number;

  /** Semaine de début (1–52) */
  @IsInt()
  @Min(1)
  @Max(52)
  semaineDebut: number;

  @IsOptional()
  @IsUUID('4')
  responsableId?: string;

  @IsOptional()
  @IsString()
  commentaire?: string;
}