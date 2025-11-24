import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BoletasModule } from './boletas/boletas.module';
import { ProductosModule } from './productos/productos.module';
// Importa tus entidades
import { Usuario } from './entities/usuario.entity';
import { Producto } from './entities/producto.entity';
import { Boleta } from './entities/boleta.entity';
import { DetalleBoleta } from './entities/detalle-boleta.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // CAMBIA ESTO
      password: '1234', // CAMBIA ESTO
      database: 'evaluacion_db',
      entities: [Usuario, Producto, Boleta, DetalleBoleta],
      synchronize: true, // ¡Solo en desarrollo! Crea tablas automática
    }),
    AuthModule,
    BoletasModule,
    ProductosModule,
  ],
})
export class AppModule {}
