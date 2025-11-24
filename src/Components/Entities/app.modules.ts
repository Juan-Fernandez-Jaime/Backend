import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { Producto } from './producto.entity';
import { Categoria } from './categoria.entity';
// ... importar las otras entidades

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',      // Tu usuario de MySQL
      password: '',          // Tu contraseña de MySQL
      database: 'evaluacion_db',
      entities: [Usuario, Producto, Categoria], // Añade todas tus entidades aquí
      synchronize: true,     // Crea las tablas automáticamente (solo para desarrollo)
    }),
    // Aquí irán tus módulos de Auth, Productos, etc.
  ],
})
export class AppModule {}