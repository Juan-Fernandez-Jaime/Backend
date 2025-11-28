import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleta } from '../entities/boleta.entity';
import { Producto } from '../entities/producto.entity';
import { DetalleBoleta } from '../entities/detalle-boleta.entity';
import { CreateBoletaDto } from './dto/create-boleta.dto';

@Injectable()
export class BoletasService {
  constructor(
    @InjectRepository(Boleta) private boletaRepo: Repository<Boleta>,
    @InjectRepository(Producto) private prodRepo: Repository<Producto>,
  ) {}

  async create(dto: CreateBoletaDto, usuario: any) {
    const nuevaBoleta = new Boleta();
    nuevaBoleta.usuario = usuario; // Asociar al usuario del Token
    nuevaBoleta.detalles = [];
    let total = 0;

    for (const item of dto.detalles) {
      const producto = await this.prodRepo.findOneBy({ id: item.productoId });
      if (!producto)
        throw new NotFoundException(`Producto ${item.productoId} no existe`);
      if (producto.stock < item.cantidad)
        throw new BadRequestException(`Sin stock para ${producto.nombre}`);

      const detalle = new DetalleBoleta();
      detalle.producto = producto;
      detalle.cantidad = item.cantidad;
      detalle.subtotal = producto.precio * item.cantidad;

      nuevaBoleta.detalles.push(detalle);
      total += detalle.subtotal;

      // Descontar Stock
      producto.stock -= item.cantidad;
      await this.prodRepo.save(producto);
    }

    nuevaBoleta.total = total;
    return this.boletaRepo.save(nuevaBoleta);
  }

  findAll() {
    return this.boletaRepo.find({
      relations: ['usuario', 'detalles', 'detalles.producto'],
    });
  }
}