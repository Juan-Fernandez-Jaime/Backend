import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/usuario.entity';

@ApiTags('Usuarios') // Nombre en Swagger
@ApiBearerAuth() // Pide Token
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protege la ruta
@Controller('usuarios') // <--- ESTA ES LA RUTA BASE
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles(UserRole.ADMIN) // Solo Admin puede ver esto
  @ApiOperation({ summary: 'Listar todos los usuarios (Solo Admin)' })
  findAll() {
    return this.usuariosService.findAll();
  }
}