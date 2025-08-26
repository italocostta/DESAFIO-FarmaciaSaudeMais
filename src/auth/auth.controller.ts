/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('seed-admin')
  @ApiOperation({
    summary: 'Bootstrap: cria o primeiro GERENTE (admin) se não existir',
  })
  async seedAdmin() {
    return this.auth.seedAdmin();
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login (retorna JWT)' })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciais de acesso',
    examples: {
      admin: {
        summary: 'Admin',
        value: { email: 'admin@saudemais.com', password: 'admin123' },
      },
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Req() req: any, @Body() _dto: LoginDto) {
    return this.auth.login(req.user);
  }

  // Criação de usuários (precisa estar logado como GERENTE)
  @Post('users')
  @ApiOperation({ summary: 'Criar usuário de acesso (somente GERENTE)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  async createUser(@Req() req: any, @Body() dto: CreateUserDto) {
    return this.auth.createUser(req.user, dto);
  }
}
