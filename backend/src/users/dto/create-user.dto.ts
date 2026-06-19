import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Role } from '../enums/role.enum';
import { Department } from '../enums/department.enum';

export class CreateUserDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsEnum(Department, { message: 'Département invalide' })
  department!: Department;
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

}
