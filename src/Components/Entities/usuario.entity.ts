import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Boleta } from './boleta.entity';

// Definimos los roles que pide la evaluación
export enum UserRole {
  ADMIN = 'admin',      // Acceso total [cite: 36]
  VENDEDOR = 'vendedor',// Ver productos y órdenes [cite: 37]
  CLIENTE = 'cliente',  // Solo comprar [cite: 41]
}

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Se guardará encriptada

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENTE,
  })
  role: UserRole;

  @OneToMany(() => Boleta, (boleta) => boleta.usuario)
  boletas: Boleta[];
}