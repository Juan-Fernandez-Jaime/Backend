import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletasService } from './boletas.service';
import { BoletasController } from './boletas.controller';
import { Boleta } from '../entities/boleta.entity';
import { DetalleBoleta } from '../entities/detalle-boleta.entity';
import { Producto } from '../entities/producto.entity';

@Module({
  // AQUÍ registras las entidades que usas en el Service
  imports: [
    TypeOrmModule.forFeature([Boleta, DetalleBoleta, Producto])
  ],
  controllers: [BoletasController],
  providers: [BoletasService],
})
export class BoletasModule {}