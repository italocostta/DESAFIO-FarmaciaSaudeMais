import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('remedios')
export class Remedio {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 120 })
  nomeComercial: string;

  @Index()
  @Column({ length: 120 })
  principioAtivo: string;

  @Column({ length: 120, nullable: true })
  fabricante?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;

  @Column({ default: false })
  receitaObrigatoria: boolean;

  @Column({ type: 'int', default: 0 })
  estoque: number;
}
