import { Module } from '@nestjs/common';
import { FuncionarioController } from './funcionario.controller';
import { FuncionarioService } from './funcionario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcionario } from './funcionario.entity/funcionario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Funcionario])],
  controllers: [FuncionarioController],
  providers: [FuncionarioService],
  exports: [FuncionarioService],
})
export class FuncionarioModule {}
