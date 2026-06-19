// src/users/dto/update-user.dto.ts
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { Role } from '../enums/role.enum';
import { AccountStatus } from '../user.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsEnum(AccountStatus)
  @IsOptional()
  status?: AccountStatus;
}
