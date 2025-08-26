/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // Bootstrap opcional do primeiro gerente
  @Post('seed-admin')
  async seedAdmin() {
    return this.auth.seedAdmin();
  }

  // Login com passport-local → devolve JWT
  @UseGuards(AuthGuard('local'))
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Req() req: any, @Body() _dto: LoginDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.auth.login(req.user);
  }

  // Criação de usuários (precisa estar logado como GERENTE)
  @UseGuards(AuthGuard('jwt'))
  @Post('users')
  async createUser(@Req() req: any, @Body() dto: CreateUserDto) {
    // req.user.role vem do JWT
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.auth.createUser({ role: req.user.role } as any, dto);
  }
}
