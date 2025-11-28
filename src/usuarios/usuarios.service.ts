import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll() {
    // Buscamos todos los usuarios (sin devolver la contraseña por seguridad)
    return await this.usuarioRepository.find({
      select: ['id', 'nombre', 'email', 'role']
    });
  }
}