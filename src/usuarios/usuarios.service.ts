import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import * as bcrypt from 'bcrypt'; // Necesario para encriptar si editan la clave

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll() {
    return await this.usuarioRepository.find({
      select: ['id', 'nombre', 'email', 'role']
    });
  }

  // --- NUEVO: EDITAR USUARIO ---
  async update(id: number, data: any) {
    const user = await this.usuarioRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Si viene password, lo encriptamos antes de guardar
    if (data.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    }

    // Actualizamos los campos
    this.usuarioRepository.merge(user, data);
    return await this.usuarioRepository.save(user);
  }

  // --- NUEVO: ELIMINAR USUARIO ---
  async remove(id: number) {
    const result = await this.usuarioRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return { message: 'Usuario eliminado correctamente' };
  }
}