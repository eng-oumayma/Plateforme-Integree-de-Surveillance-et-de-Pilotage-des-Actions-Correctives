// src/checklists/dto/create-checklist-template.dto.ts
import {
  IsEnum,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Domaine } from '../../common/enums/domaine.enum';
import { CotationType } from '../enums/cotation-type.enum';

export class CreateChecklistItemDto {
  @IsString()
  section!: string;

  @IsString()
  libelle!: string;

  @IsString()
  @IsOptional()
  target?: string;

  @IsBoolean()
  @IsOptional()
  actif?: boolean;
}

export class CreateChecklistTemplateDto {
  @IsEnum(Domaine, { message: 'Domaine invalide' })
  domaine!: Domaine;

  @IsString()
  titre!: string;

  @IsEnum(CotationType, { message: 'Type de cotation invalide' })
  cotationType!: CotationType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChecklistItemDto)
  @IsOptional()
  items?: CreateChecklistItemDto[];
}
