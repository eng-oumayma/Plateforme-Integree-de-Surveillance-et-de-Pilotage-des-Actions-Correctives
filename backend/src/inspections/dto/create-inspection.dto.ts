import { IsEnum, IsString, IsDateString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Domaine } from '../../common/enums/domaine.enum';

export class CreateInspectionDto {
  @IsEnum(Domaine, { message: 'Domaine invalide' })
  domaine: Domaine;

  @IsString()
  site: string;

  @IsDateString()
  datePrevue: string;

  /** Latitude fournie par navigator.geolocation côté client */
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  /** Longitude fournie par navigator.geolocation côté client */
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}
