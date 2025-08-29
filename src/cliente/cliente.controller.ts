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
import { AuthGuard } from '@nestjs/passport';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto/update-cliente.dto';
import { Cliente } from './cliente.entity/cliente.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import * as nestjsPaginate from 'nestjs-paginate';

// Swagger
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Role } from 'src/auth/user.entity';

@ApiTags('Clientes')
@ApiBearerAuth('JWT-auth')
@Controller('clientes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ClienteController {
  constructor(private readonly service: ClienteService) {}

  // Exclusivo ATENDENTE
  @Post()
  @Roles('ATENDENTE')
  @ApiOperation({ summary: 'Criar cliente (exclusivo do ATENDENTE)' })
  @ApiCreatedResponse({ description: 'Cliente criado com sucesso' })
  create(@Body() dto: CreateClienteDto) {
    return this.service.create(dto);
  }

  // Leitura liberada (autenticado)
  @Get()
  @ApiOperation({
    summary: 'Listar clientes (paginação, busca e filtros)',
    description:
      'Parâmetros: page, limit, search, filter.campo (ex.: filter.cpf=$eq:123...), sortBy=campo:ASC|DESC',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @nestjsPaginate.Paginate() query: nestjsPaginate.PaginateQuery,
  ): Promise<nestjsPaginate.Paginated<Cliente>> {
    return this.service.findAll(query);
  }

  // Leitura por id
  @Get(':id')
  @ApiOperation({ summary: 'Obter cliente por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Cliente encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  // Exclusivo ATENDENTE
  @Patch(':id')
  @Roles(Role.ATENDENTE, Role.GERENTE)
  @ApiOperation({ summary: 'Atualizar cliente (exclusivo do ATENDENTE)' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
    return this.service.update(+id, dto);
  }

  // Exclusivo GERENTE
  @Delete(':id')
  @Roles('GERENTE')
  @ApiOperation({ summary: 'Deletar cliente (exclusivo do GERENTE)' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
