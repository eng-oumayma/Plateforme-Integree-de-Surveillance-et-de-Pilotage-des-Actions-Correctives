import { IsOptional, IsString } from 'class-validator';

export class CloseInspectionDto {
  @IsOptional()
  @IsString()
  commentaire?: string;
}