import {
  IsString,
  IsArray,
  IsUUID,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1, { message: 'Le commentaire ne peut pas être vide' })
  message!: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  mentions?: string[];
}
