import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto/update-cliente.dto';
import * as nestjsPaginate from 'nestjs-paginate';
import { Cliente } from './cliente.entity/cliente.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('clientes')
@UseGuards(RolesGuard)
export class ClienteController {
  constructor(private readonly service: ClienteService) {}

  // cadastro de clientes pode ser feito por atendente/gerente
  @Post()
  @Roles('ATENDENTE', 'GERENTE')
  create(@Body() dto: CreateClienteDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @nestjsPaginate.Paginate() query: nestjsPaginate.PaginateQuery,
  ): Promise<nestjsPaginate.Paginated<Cliente>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles('ATENDENTE', 'GERENTE')
  update(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('GERENTE')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
