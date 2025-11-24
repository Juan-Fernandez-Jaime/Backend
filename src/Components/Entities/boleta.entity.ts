import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { DetalleBoleta } from './detalle-boleta.entity';

@Entity()
export class Boleta {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha: Date;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  // Relación con Usuario (Cliente) según Figura 1 [cite: 31]
  @ManyToOne(() => Usuario, (usuario) => usuario.boletas)
  usuario: Usuario;

  // Relación con Detalles
  @OneToMany(() => DetalleBoleta, (detalle) => detalle.boleta, { cascade: true })
  detalles: DetalleBoleta[];
}