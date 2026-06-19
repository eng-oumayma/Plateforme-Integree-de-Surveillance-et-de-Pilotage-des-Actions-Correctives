// src/auth/dto/set-password.dto.ts
import { IsString, MinLength } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class SetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  password!: string;

  @IsString()
  @Match('password', { message: 'Les mots de passe ne correspondent pas' })
  confirm!: string;
}
