import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateRemedioDto {
  @ApiProperty({ example: 'Dipirona 500mg', minLength: 2, maxLength: 120 })
  @IsString()
  @Length(2, 120)
  nomeComercial: string;

  @ApiProperty({ example: 'Dipirona', minLength: 2, maxLength: 120 })
  @IsString()
  @Length(2, 120)
  principioAtivo: string;

  @ApiProperty({ example: 'Genérico', minLength: 2, maxLength: 120 })
  @IsString()
  @Length(2, 120)
  fabricante: string;

  @ApiProperty({ example: 12.5, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  preco: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  receitaObrigatoria: boolean;

  @ApiProperty({ example: 100, minimum: 0 })
  @IsNumber()
  @Min(0)
  estoque: number;
}
