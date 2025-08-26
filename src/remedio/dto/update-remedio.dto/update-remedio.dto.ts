import { PartialType } from '@nestjs/swagger';
import { CreateRemedioDto } from '../create-remedio.dto/create-remedio.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UpdateRemedioDto extends PartialType(CreateRemedioDto) {
  @ApiPropertyOptional({ example: 'Dipirona 1g' })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  nomeComercial?: string;

  @ApiPropertyOptional({ example: 13.9, minimum: 0.01 })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  preco?: number;

  @ApiPropertyOptional({ example: 180, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estoque?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  receitaObrigatoria?: boolean;
}
