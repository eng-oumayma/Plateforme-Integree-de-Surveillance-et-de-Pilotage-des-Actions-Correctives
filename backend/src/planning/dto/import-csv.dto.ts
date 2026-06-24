import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class ImportCsvDto {
  @IsOptional()
  @IsInt()
  @Min(2024)
  @Max(2100)
  annee?: number;
}