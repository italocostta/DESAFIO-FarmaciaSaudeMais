import { Module } from '@nestjs/common';
import { RemedioController } from './remedio.controller';
import { RemedioService } from './remedio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Remedio } from './remedio.entity/remedio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Remedio])],
  controllers: [RemedioController],
  providers: [RemedioService],
  exports: [RemedioService],
})
export class RemedioModule {}
