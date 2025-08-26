import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateClienteDto } from '../create-cliente.dto/create-cliente.dto';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @ApiPropertyOptional({ example: '83911112222', minLength: 8, maxLength: 20 })
  @IsOptional()
  @IsString()
  @Length(8, 20)
  telefone?: string;

  @ApiPropertyOptional({ example: 'joao.novo@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Rua B, 456 - Centro' })
  @IsOptional()
  @IsString()
  @Length(2, 200)
  endereco?: string;
}
