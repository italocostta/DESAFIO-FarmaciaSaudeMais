import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

export enum Cargo {
  FARMACEUTICO = 'FARMACEUTICO',
  ATENDENTE = 'ATENDENTE',
  GERENTE = 'GERENTE',
}

export class CreateFuncionarioDto {
  @IsString()
  @Length(2, 120)
  nome: string;

  @IsString()
  @Length(11, 11, { message: 'CPF deve ter exatamente 11 dígitos' })
  cpf: string;

  @IsEnum(Cargo, {
    message: 'Cargo deve ser FARMACEUTICO, ATENDENTE ou GERENTE',
  })
  cargo: Cargo;

  @IsNumber()
  @Min(0)
  salario: number;

  @IsDateString(
    {},
    { message: 'Data de admissão deve estar em formato ISO (yyyy-mm-dd)' },
  )
  dataAdmissao: string;

  @IsEmail()
  @Length(5, 120)
  email: string;
}
