import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcionario } from './funcionario.entity/funcionario.entity';
import {
  paginate,
  Paginated,
  PaginateQuery,
  FilterOperator,
} from 'nestjs-paginate';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto/update-funcionario.dto';

@Injectable()
export class FuncionarioService {
  constructor(
    @InjectRepository(Funcionario)
    private readonly repo: Repository<Funcionario>,
  ) {}

  create(dto: CreateFuncionarioDto) {
    const entity = this.repo.create({
      ...dto,
      // se dataAdmissao for string ISO, TypeORM converte para date
      dataAdmissao: new Date(dto.dataAdmissao),
    });
    return this.repo.save(entity);
  }

  findAll(query: PaginateQuery): Promise<Paginated<Funcionario>> {
    return paginate(query, this.repo, {
      sortableColumns: ['id', 'nome', 'cargo', 'salario', 'dataAdmissao'],
      searchableColumns: ['nome', 'cpf', 'email', 'cargo'],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        cargo: [FilterOperator.EQ],
        salario: [FilterOperator.GTE, FilterOperator.LTE],
      },
    });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateFuncionarioDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const patch = { ...dto } as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (dto.dataAdmissao) patch.dataAdmissao = new Date(dto.dataAdmissao);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.repo.update(id, patch);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
