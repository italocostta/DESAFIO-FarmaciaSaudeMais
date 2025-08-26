import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto/update-funcionario.dto';
import { Funcionario } from './funcionario.entity/funcionario.entity';
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
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Funcionários')
@ApiBearerAuth('JWT-auth')
@Controller('funcionarios')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FuncionarioController {
  constructor(private readonly service: FuncionarioService) {}

  // Exclusivo GERENTE
  @Post()
  @Roles('GERENTE')
  @ApiOperation({ summary: 'Criar funcionário (exclusivo do GERENTE)' })
  @ApiCreatedResponse({ description: 'Funcionário criado com sucesso' })
  create(@Body() dto: CreateFuncionarioDto) {
    return this.service.create(dto);
  }

  // Leitura liberada (autenticado)
  @Get()
  @ApiOperation({
    summary: 'Listar funcionários (paginação, busca e filtros)',
    description:
      'Parâmetros: page, limit, search, filter.campo (ex.: filter.cargo=$eq:FARMACEUTICO), sortBy=campo:ASC|DESC',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @nestjsPaginate.Paginate() query: nestjsPaginate.PaginateQuery,
  ): Promise<nestjsPaginate.Paginated<Funcionario>> {
    return this.service.findAll(query);
  }

  // Leitura por id
  @Get(':id')
  @ApiOperation({ summary: 'Obter funcionário por ID' })
  @ApiParam({
    name: 'id',
    required: true,
    schema: { type: 'integer', example: 1 },
  })
  @ApiOkResponse({ description: 'Funcionário encontrado' })
  @ApiNotFoundResponse({ description: 'Funcionário não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('GERENTE')
  @ApiOperation({ summary: 'Atualizar funcionário (exclusivo do GERENTE)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse({ description: 'Funcionário não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFuncionarioDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('GERENTE')
  @ApiOperation({ summary: 'Deletar funcionário (exclusivo do GERENTE)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse({ description: 'Funcionário não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
