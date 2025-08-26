import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Funcionario } from '../funcionario/funcionario.entity/funcionario.entity';

export enum Role {
  GERENTE = 'GERENTE',
  FARMACEUTICO = 'FARMACEUTICO',
  ATENDENTE = 'ATENDENTE',
}

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 120 }) email: string;
  @Column() passwordHash: string;
  @Column({ type: 'enum', enum: Role }) role: Role;

  @OneToOne(() => Funcionario, { nullable: true })
  @JoinColumn()
  funcionario?: Funcionario;
}
