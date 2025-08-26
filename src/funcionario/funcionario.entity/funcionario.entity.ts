import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('funcionarios')
@Unique(['cpf'])
@Unique(['email'])
export class Funcionario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  nome: string;

  @Column({ length: 11 })
  cpf: string;

  @Column({ length: 20 })
  cargo: 'FARMACEUTICO' | 'ATENDENTE' | 'GERENTE';

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  salario: number;

  @Column({ type: 'date' })
  dataAdmissao: Date;

  @Column({ length: 120 })
  email: string;
}
