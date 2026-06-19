// src/auth/dto/reset-password.dto.ts
import { IsString, MinLength } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  newPassword!: string;

  @IsString()
  @Match('newPassword', { message: 'Les mots de passe ne correspondent pas' })
  confirm!: string;
}
