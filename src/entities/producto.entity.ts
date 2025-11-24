import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn() id: number;
  @Column() nombre: string;
  @Column('decimal') precio: number;
  @Column('int') stock: number;
  // Puedes agregar relación con Categoria si lo deseas
}