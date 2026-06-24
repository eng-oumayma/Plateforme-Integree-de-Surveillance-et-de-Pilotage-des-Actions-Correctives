// src/checklists/dto/create-response.dto.ts
import { IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateResponseDto {
  @IsUUID()
  inspectionId!: string;

  @IsUUID()
  itemId!: string;

  @IsString()
  @IsOptional()
  cotation?: string; // valeur de cotation

  @IsString()
  @IsOptional()
  observation?: string;

  @IsString()
  @IsOptional()
  analyseCauses?: string;

  @IsString()
  @IsOptional()
  responsable?: string;

  @IsString()
  @IsOptional()
  delai?: string; // date ISO string

  @IsBoolean()
  @IsOptional()
  isDeviation?: boolean;
}

export class SubmitChecklistDto {
  @IsUUID()
  inspectionId!: string;

  @IsUUID()
  templateId!: string;
}
