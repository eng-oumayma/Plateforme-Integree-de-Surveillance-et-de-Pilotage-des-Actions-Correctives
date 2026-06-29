import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Domaine } from '../../common/enums/domaine.enum';

export class CreateInspectionDto {
  @IsEnum(Domaine, { message: 'Domaine invalide' })
  domaine: Domaine;



   // auditeurId envoyé par le frontend (Admin choisit l'auditeur)
  @IsOptional()
  @IsUUID('4', { message: 'auditeurId doit être un UUID valide' })
  auditeurId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Le site est requis' })
  site: string;

  @IsDateString({}, { message: 'Format de date invalide' })
  datePrevue: string;

  /** Latitude fournie par le navigateur (optionnel) */
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  /** Longitude fournie par le navigateur (optionnel) */
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

   /**
   * planId : envoyé uniquement si l'inspection est créée depuis "Réaliser" (MesTaches)
   * null si inspection libre
   */
  @IsOptional()
  @IsUUID('4', { message: 'planId doit être un UUID valide' })
  planId?: string;
  
}