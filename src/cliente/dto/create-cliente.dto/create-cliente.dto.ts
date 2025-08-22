import { IsOptional, IsString, Length, IsEmail } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @Length(2, 120)
  nome: string;

  @IsString()
  @Length(11, 11, { message: 'CPF deve ter exatamente 11 dígitos' })
  cpf: string;

  @IsOptional()
  @IsString()
  @Length(8, 15, { message: 'Telefone deve ter entre 8 e 15 dígitos' })
  telefone?: string;

  @IsOptional()
  @IsEmail()
  @Length(5, 120)
  email?: string;

  @IsOptional()
  @IsString()
  endereco?: string;
}
