import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CloseInspectionDto {
  /** Commentaire de clôture optionnel */
  @IsOptional()
  @IsString()
  commentaire?: string;
}