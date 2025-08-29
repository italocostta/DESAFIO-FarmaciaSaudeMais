import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(dto: CreateFuncionarioDto) {
    const entity = this.repo.create({
      ...dto,
      dataAdmissao: new Date(dto.dataAdmissao),
    });
    return this.repo.save(entity);
  }

  findAll(query: PaginateQuery): Promise<Paginated<Funcionario>> {
    return paginate(query, this.repo, {
      sortableColumns: ['id', 'nome', 'salario', 'dataAdmissao'],
      searchableColumns: ['nome', 'cpf', 'email'],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        cargo: [FilterOperator.EQ],
        salario: [FilterOperator.GTE, FilterOperator.LTE],
      },
    });
  }

  async findOne(id: number): Promise<Funcionario> {
    const funcionario = await this.repo.findOne({ where: { id } });
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }
    return funcionario;
  }

  async update(id: number, dto: UpdateFuncionarioDto) {
    const funcionario = await this.findOne(id);

    if (dto.dataAdmissao) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (funcionario as any).dataAdmissao = new Date(dto.dataAdmissao);
    }
    Object.assign(funcionario, dto);

    return this.repo.save(funcionario);
  }

  async remove(id: number) {
    const funcionario = await this.findOne(id);
    await this.repo.remove(funcionario);
    return { deleted: true };
  }
}
