import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsInt,
} from 'class-validator';
import { Role } from '../user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsInt()
  funcionarioId?: number; // 👈 novo campo opcional para vincular User a Funcionario
}
