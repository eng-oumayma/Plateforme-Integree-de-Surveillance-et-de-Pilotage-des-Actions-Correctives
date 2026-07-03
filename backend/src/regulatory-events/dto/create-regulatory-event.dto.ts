import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { RegulatoryEventType } from '../enums/regulatory-type.enum';

export class CreateRegulatoryEventDto {
  @IsEnum(RegulatoryEventType)
  @IsNotEmpty()
  type: RegulatoryEventType;

  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  datePrevue: string;

  @IsString()
  @IsOptional()
  recurrence?: string;

  @IsString()
  @IsNotEmpty()
  responsableId: string;
}