import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity/cliente.entity';
import {
  paginate,
  Paginated,
  PaginateQuery,
  FilterOperator,
} from 'nestjs-paginate';
import { CreateClienteDto } from './dto/create-cliente.dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente) private readonly repo: Repository<Cliente>,
  ) {}

  create(dto: CreateClienteDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll(query: PaginateQuery): Promise<Paginated<Cliente>> {
    return paginate(query, this.repo, {
      sortableColumns: ['id', 'nome', 'cpf', 'email'],
      searchableColumns: ['nome', 'cpf', 'email', 'telefone', 'endereco'],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        cpf: [FilterOperator.EQ],
        email: [FilterOperator.EQ],
      },
    });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateClienteDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
