import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('clientes')
@Unique(['cpf'])
@Unique(['email'])
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  nome: string;

  @Column({ length: 11 })
  cpf: string;

  @Column({ length: 15, nullable: true })
  telefone?: string;

  @Column({ length: 120, nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  endereco?: string;
}
