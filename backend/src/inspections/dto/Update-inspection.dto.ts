import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { InspectionStatus } from '../../common/enums/Inspection-status.enum';
import { Domaine } from 'src/common/enums/domaine.enum';

export class UpdateInspectionDto {
  @IsOptional()
  @IsEnum(InspectionStatus, { message: 'Statut invalide' })
  statut?: InspectionStatus;
  @IsOptional()
  @IsEnum(Domaine)
  domaine?: Domaine;

  @IsOptional()
  @IsString()
  site?: string;

  @IsOptional()
  @IsDateString() // Valide le format de date reçu (ex: "2026-06-30")
  datePrevue?: string;
}
