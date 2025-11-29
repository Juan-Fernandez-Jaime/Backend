import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, UserRole } from '../entities/usuario.entity';
import { Producto } from '../entities/producto.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario) private readonly userRepo: Repository<Usuario>,
    @InjectRepository(Producto) private readonly productRepo: Repository<Producto>,
  ) {}

  async onModuleInit() {
    await this.insertarUsuarios();
    await this.insertarProductos();
    // ❌ Quitamos la llamada a insertarVentasDiarias()
  }

  private async insertarUsuarios() {
    const total = await this.userRepo.count();
    if (total > 0) return;

    console.log('🌱 Sembrando Usuarios...');
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('123', salt);

    const usuarios = [
      { nombre: 'Super Admin', email: 'admin@tienda.cl', password, role: UserRole.ADMIN },
      { nombre: 'Juan Vendedor', email: 'vendedor@tienda.cl', password, role: UserRole.VENDEDOR },
      { nombre: 'Cliente Pedro', email: 'cliente@tienda.cl', password, role: UserRole.CLIENTE },
    ];
    await this.userRepo.save(usuarios);
  }

  private async insertarProductos() {
    const total = await this.productRepo.count();
    if (total > 0) return;

    console.log('🌱 Sembrando Productos...');
    const productos = [
      { nombre: 'Nintendo Switch', precio: 300000, stock: 10 },
      { nombre: 'PlayStation 5', precio: 550000, stock: 5 },
      { nombre: 'Polera React', precio: 15000, stock: 50 },
      { nombre: 'Sillón Gamer', precio: 120000, stock: 7 },
      { nombre: 'Audífonos Sony', precio: 45000, stock: 20 },
    ];
    await this.productRepo.save(productos);
  }
}