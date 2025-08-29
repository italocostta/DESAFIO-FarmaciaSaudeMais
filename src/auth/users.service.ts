/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findAll(opts: { page?: number; limit?: number; search?: string }) {
    const page = Math.max(1, Number(opts.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(opts.limit) || 20));
    const where = opts.search ? { email: ILike(`%${opts.search}%`) } : {};

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['funcionario'],
    });

    // não exponha passwordHash
    const safe = data.map(({ passwordHash, ...rest }) => rest);

    return {
      data: safe,
      meta: {
        totalItems: total,
        itemCount: data.length,
        perPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['funcionario'],
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (dto.email !== undefined) user.email = dto.email;
    if (dto.role !== undefined) user.role = dto.role;

    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(dto.password, salt);
    }

    if (dto.funcionario !== undefined) {
      // OneToOne via @JoinColumn cria a FK funcionarioId automaticamente
      // para desvincular: passe null
      (user as any).funcionario = dto.funcionario
        ? ({ id: dto.funcionario } as any)
        : null;
      (user as any).funcionarioId = dto.funcionario ?? null;
    }

    const saved = await this.repo.save(user);
    const { passwordHash, ...rest } = saved;
    return rest;
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException('Usuário não encontrado');
    return { success: true };
  }
}
