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
import { RemedioService } from './remedio.service';
import { CreateRemedioDto } from './dto/create-remedio.dto/create-remedio.dto';
import { UpdateRemedioDto } from './dto/update-remedio.dto/update-remedio.dto';
import { Remedio } from './remedio.entity/remedio.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import * as nestjsPaginate from 'nestjs-paginate';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Remédios')
@ApiBearerAuth('JWT-auth')
@Controller('remedios')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RemedioController {
  constructor(private readonly service: RemedioService) {}

  @Post()
  @Roles('FARMACEUTICO')
  @ApiOperation({ summary: 'Criar remédio (exclusivo do FARMACÊUTICO)' })
  @ApiCreatedResponse({ description: 'Remédio criado com sucesso' })
  create(@Body() dto: CreateRemedioDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar remédios (paginação, busca e filtros)',
    description:
      'Parâmetros: page, limit, search, filter.campo (ex.: filter.preco=$gte:10), sortBy=campo:ASC|DESC',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @nestjsPaginate.Paginate() query: nestjsPaginate.PaginateQuery,
  ): Promise<nestjsPaginate.Paginated<Remedio>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter remédio por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Remédio encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles('FARMACEUTICO')
  @ApiOperation({ summary: 'Atualizar remédio (exclusivo do FARMACÊUTICO)' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id') id: string, @Body() dto: UpdateRemedioDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('FARMACEUTICO')
  @ApiOperation({ summary: 'Deletar remédio (exclusivo do FARMACÊUTICO)' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
