import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateRemedioDto {
  @IsString()
  @Length(2, 120)
  @IsNotEmpty()
  nomeComercial: string;

  @IsString()
  @Length(2, 120)
  @IsNotEmpty()
  principioAtivo: string;

  @IsOptional()
  @IsString()
  @Length(2, 120)
  fabricante?: string;

  @IsNumber()
  @IsPositive()
  preco: number;

  @IsBoolean()
  receitaObrigatoria: boolean;

  @IsInt()
  @Min(0)
  estoque: number;
}
