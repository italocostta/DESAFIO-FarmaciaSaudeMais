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
import { RemedioService } from './remedio.service';
import { CreateRemedioDto } from './dto/create-remedio.dto/create-remedio.dto';
import { UpdateRemedioDto } from './dto/update-remedio.dto/update-remedio.dto';
import * as nestjsPaginate from 'nestjs-paginate';
import { Remedio } from './remedio.entity/remedio.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('remedios')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RemedioController {
  constructor(private readonly service: RemedioService) {}

  @Post()
  @Roles('FARMACEUTICO')
  create(@Body() dto: CreateRemedioDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @nestjsPaginate.Paginate() query: nestjsPaginate.PaginateQuery,
  ): Promise<nestjsPaginate.Paginated<Remedio>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles('FARMACEUTICO', 'GERENTE')
  update(@Param('id') id: string, @Body() dto: UpdateRemedioDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('GERENTE')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
