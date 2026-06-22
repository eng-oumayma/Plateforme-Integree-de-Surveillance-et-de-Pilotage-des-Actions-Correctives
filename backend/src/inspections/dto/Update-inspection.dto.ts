import { IsEnum, IsOptional } from 'class-validator';
import { InspectionStatus } from '../../common/enums/Inspection-status.enum';

export class UpdateInspectionDto {
  @IsOptional()
  @IsEnum(InspectionStatus, { message: 'Statut invalide' })
  statut?: InspectionStatus;
}
