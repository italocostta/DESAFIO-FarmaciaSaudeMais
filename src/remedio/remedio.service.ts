import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Remedio } from './remedio.entity/remedio.entity';
import {
  paginate,
  Paginated,
  PaginateQuery,
  FilterOperator,
} from 'nestjs-paginate';
import { CreateRemedioDto } from './dto/create-remedio.dto/create-remedio.dto';
import { UpdateRemedioDto } from './dto/update-remedio.dto/update-remedio.dto';

@Injectable()
export class RemedioService {
  constructor(
    @InjectRepository(Remedio)
    private readonly repo: Repository<Remedio>,
  ) {}

  create(dto: CreateRemedioDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll(query: PaginateQuery): Promise<Paginated<Remedio>> {
    return paginate(query, this.repo, {
      sortableColumns: ['id', 'nomeComercial', 'preco', 'estoque'],
      searchableColumns: ['nomeComercial', 'principioAtivo', 'fabricante'],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        receitaObrigatoria: [FilterOperator.EQ],
        preco: [FilterOperator.GTE, FilterOperator.LTE],
        estoque: [FilterOperator.GTE, FilterOperator.LTE],
      },
    });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateRemedioDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
