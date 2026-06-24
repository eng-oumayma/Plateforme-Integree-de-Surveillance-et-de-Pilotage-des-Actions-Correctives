import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PlanStatut } from '../../common/enums/Plan-statut.enum';

export class UpdatePlanDto {
  @IsOptional()
  @IsEnum(PlanStatut, { message: 'Statut invalide' })
  statut?: PlanStatut;

  @IsOptional()
  @IsUUID('4')
  responsableId?: string;

  @IsOptional()
  @IsString()
  commentaire?: string;

  @IsOptional()
  @IsUUID('4')
  inspectionId?: string;
}