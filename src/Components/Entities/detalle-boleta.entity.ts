import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Boleta } from './boleta.entity';
import { Producto } from './producto.entity';

@Entity()
export class DetalleBoleta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  cantidad: number;

  // Guardamos el precio del momento de la compra
  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Boleta, (boleta) => boleta.detalles, { onDelete: 'CASCADE' })
  boleta: Boleta;

  @ManyToOne(() => Producto)
  producto: Producto;
}