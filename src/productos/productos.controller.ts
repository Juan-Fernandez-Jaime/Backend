import { Controller, Get, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/usuario.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // Todos (incluido Vendedor) pueden ver
  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  // SOLO ADMIN puede crear
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() body: any) {
    return this.productosService.create(body);
  }

  // SOLO ADMIN puede borrar
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}