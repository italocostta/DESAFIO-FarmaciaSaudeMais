import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User, Role } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Funcionario } from '../funcionario/funcionario.entity/funcionario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Funcionario)
    private readonly funcionarios: Repository<Funcionario>,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');
    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, role: user.role, email: user.email };
    return { access_token: await this.jwt.signAsync(payload) };
  }

  // Somente GERENTE pode criar usuários
  async createUser(requester: User, dto: CreateUserDto) {
    if (requester.role !== Role.GERENTE) {
      throw new ForbiddenException('Apenas GERENTE pode criar usuários');
    }

    const exists = await this.users.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email já em uso');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    let funcionario: Funcionario | undefined;

    if (dto.funcionarioId) {
      const found = await this.funcionarios.findOne({
        where: { id: dto.funcionarioId },
      });
      if (!found) throw new BadRequestException('funcionarioId inválido');
      funcionario = found;
    }

    const user = this.users.create({
      email: dto.email,
      passwordHash,
      role: dto.role,
      funcionario,
    });

    return this.users.save(user);
  }

  async seedAdmin() {
    const email = 'admin@saudemais.com';
    const exists = await this.users.findOne({ where: { email } });
    if (exists) return { seeded: false, message: 'Admin já existe' };

    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = this.users.create({
      email,
      passwordHash,
      role: Role.GERENTE,
    });
    await this.users.save(admin);
    return { seeded: true, email, password: 'admin123' };
  }
}
