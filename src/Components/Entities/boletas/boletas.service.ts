import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleta } from '../boleta.entity';
import { DetalleBoleta } from '../detalle-boleta.entity';
import { Producto } from '../producto.entity';
import { Usuario } from '../usuario.entity';
import { CreateBoletaDto } from './dto/create-boleta.dto';

@Injectable()
export class BoletasService {
  constructor(
    @InjectRepository(Boleta)
    private boletaRepository: Repository<Boleta>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    // No necesitamos inyectar DetalleBoletaRepository explícitamente porque lo guardamos en cascada desde Boleta
  ) {}

  async create(createBoletaDto: CreateBoletaDto, usuario: Usuario) {
    // 1. Iniciamos la boleta vacía asociada al usuario
    const nuevaBoleta = new Boleta();
    nuevaBoleta.usuario = usuario;
    nuevaBoleta.detalles = [];
    let totalAcumulado = 0;

    // 2. Recorremos los productos que vienen del Frontend
    for (const item of createBoletaDto.detalles) {
      const producto = await this.productoRepository.findOneBy({ id: item.productoId });

      // Validaciones de Negocio
      if (!producto) {
        throw new NotFoundException(`El producto con ID ${item.productoId} no existe`);
      }
      if (producto.stock < item.cantidad) {
        throw new BadRequestException(`No hay suficiente stock para el producto: ${producto.nombre}`);
      }

      // 3. Crear el detalle (Línea de venta)
      const detalle = new DetalleBoleta();
      detalle.producto = producto;
      detalle.cantidad = item.cantidad;
      detalle.precioUnitario = producto.precio; // Usamos el precio de la BDD, no del front
      detalle.subtotal = producto.precio * item.cantidad;

      // 4. Agregamos el detalle a la boleta y sumamos al total
      nuevaBoleta.detalles.push(detalle);
      totalAcumulado += detalle.subtotal;

      // 5. Lógica de Inventario: Descontar stock
      producto.stock -= item.cantidad;
      await this.productoRepository.save(producto);
    }

    // 6. Asignamos el total final y guardamos todo
    // Gracias a { cascade: true } en la entidad Boleta, esto guarda la boleta Y los detalles
    nuevaBoleta.total = totalAcumulado;

    return this.boletaRepository.save(nuevaBoleta);
  }

  // Método para que el Vendedor y Admin vean las ventas
  async findAll() {
    return this.boletaRepository.find({
      relations: ['usuario', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' }
    });
  }

  // Método para ver el detalle de una venta específica
  async findOne(id: number) {
    const boleta = await this.boletaRepository.findOne({
      where: { id },
      relations: ['usuario', 'detalles', 'detalles.producto'],
    });
    if (!boleta) throw new NotFoundException('Boleta no encontrada');
    return boleta;
  }
}