import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos (Solo los que estás usando)
import { AuthModule } from './auth/auth.module';
import { BoletasModule } from './boletas/boletas.module';
import { ProductosModule } from './productos/productos.module';
import { UsuariosModule } from './usuarios/usuarios.module';

// Entidades (Solo las que tienen datos)
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
      username: 'root', // Tu usuario
      password: '1234', // Tu contraseña
      database: 'evaluacion_db',

      // QUITAMOS Categoria de aquí
      entities: [Usuario, Producto, Boleta, DetalleBoleta],

      synchronize: true,
      dropSchema: false,
    }),

    AuthModule,
    BoletasModule,
    ProductosModule,
    UsuariosModule,
  ],
})
export class AppModule {}