import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

export enum Cargo {
  GERENTE = 'GERENTE',
  FARMACEUTICO = 'FARMACEUTICO',
  ATENDENTE = 'ATENDENTE',
}

export class CreateFuncionarioDto {
  @ApiProperty({ example: 'Ana Gerente', minLength: 2, maxLength: 120 })
  @IsString()
  @Length(2, 120)
  nome: string;

  @ApiProperty({ example: '12345678901', description: 'CPF com 11 dígitos' })
  @IsString()
  @Length(11, 11)
  cpf: string;

  @ApiProperty({ example: 5800, minimum: 0 })
  @IsNumber()
  @Min(0)
  salario: number;

  @ApiProperty({ example: '2025-01-15', description: 'ISO date (YYYY-MM-DD)' })
  @IsDateString()
  dataAdmissao: string;

  @ApiProperty({
    example: 'ana.gerente@saudemais.com',
    minLength: 5,
    maxLength: 120,
  })
  @IsEmail()
  @Length(5, 120)
  email: string;
}
