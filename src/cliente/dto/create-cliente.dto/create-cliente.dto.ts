import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ example: 'João da Silva', minLength: 2, maxLength: 120 })
  @IsString()
  @Length(2, 120)
  nome: string;

  @ApiProperty({ example: '98765432100', description: 'CPF com 11 dígitos' })
  @IsString()
  @Length(11, 11)
  cpf: string;

  @ApiPropertyOptional({ example: '83999990000', minLength: 8, maxLength: 20 })
  @IsOptional()
  @IsString()
  @Length(8, 20)
  telefone?: string;

  @ApiPropertyOptional({ example: 'joao@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Rua A, 123 - Centro' })
  @IsOptional()
  @IsString()
  @Length(2, 200)
  endereco?: string;
}
