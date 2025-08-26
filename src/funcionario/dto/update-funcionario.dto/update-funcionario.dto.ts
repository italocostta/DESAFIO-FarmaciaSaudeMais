import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateFuncionarioDto,
  Cargo,
} from '../create-funcionario.dto/create-funcionario.dto';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UpdateFuncionarioDto extends PartialType(CreateFuncionarioDto) {
  @ApiPropertyOptional({ example: 'Ana Paula' })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  nome?: string;

  @ApiPropertyOptional({ enum: Cargo, enumName: 'Cargo' })
  @IsOptional()
  @IsEnum(Cargo)
  cargo?: Cargo;

  @ApiPropertyOptional({ example: 6200, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salario?: number;

  @ApiPropertyOptional({ example: '2025-03-01' })
  @IsOptional()
  @IsDateString()
  dataAdmissao?: string;

  @ApiPropertyOptional({ example: 'ana.novo@saudemais.com' })
  @IsOptional()
  @IsEmail()
  @Length(5, 120)
  email?: string;
}
