import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { Funcionario } from './funcionario/funcionario.entity/funcionario.entity';
import { Cliente } from './cliente/cliente.entity/cliente.entity';
import { Remedio } from './remedio/remedio.entity/remedio.entity';
import { FuncionarioModule } from './funcionario/funcionario.module';
import { ClienteModule } from './cliente/cliente.module';
import { RemedioModule } from './remedio/remedio.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DB_HOST'),
        port: +cfg.getOrThrow<number>('DB_PORT'),
        username: cfg.get<string>('DB_USER'),
        password: cfg.get<string>('DB_PASS'),
        database: cfg.get<string>('DB_NAME'),
        entities: [Funcionario, Cliente, Remedio],
        autoLoadEntities: true,
        synchronize: true, // deixe true só em DEV
      }),
    }),
    AuthModule,
    FuncionarioModule,
    ClienteModule,
    RemedioModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
