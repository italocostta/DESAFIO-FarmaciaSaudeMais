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
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto/update-funcionario.dto';
import * as nestjsPaginate from 'nestjs-paginate';
import { Funcionario } from './funcionario.entity/funcionario.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('funcionarios')
@UseGuards(RolesGuard)
export class FuncionarioController {
  constructor(private readonly service: FuncionarioService) {}

  // somente GERENTE cria/edita/exclui funcionários
  @Post()
  @Roles('GERENTE')
  create(@Body() dto: CreateFuncionarioDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @nestjsPaginate.Paginate() query: nestjsPaginate.PaginateQuery,
  ): Promise<nestjsPaginate.Paginated<Funcionario>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles('GERENTE')
  update(@Param('id') id: string, @Body() dto: UpdateFuncionarioDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('GERENTE')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
