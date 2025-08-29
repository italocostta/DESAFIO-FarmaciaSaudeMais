import { Funcionario } from 'src/funcionario/funcionario.entity/funcionario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToOne,
  JoinColumn,
} from 'typeorm';

export enum Role {
  GERENTE = 'GERENTE',
  FARMACEUTICO = 'FARMACEUTICO',
  ATENDENTE = 'ATENDENTE',
}

@Entity('users')
@Unique(['email'])
export class UpdateUserDto {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 120 }) email: string;
  @Column() passwordHash: string;
  @Column({ type: 'enum', enum: Role }) role: Role;

  @OneToOne(() => Funcionario, { nullable: true })
  @JoinColumn()
  funcionario?: Funcionario;
  password: any;
}
