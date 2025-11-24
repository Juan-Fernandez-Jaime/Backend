import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { BoletasService } from './boletas.service';
import { CreateBoletaDto } from './dto/create-boleta.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Ventas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt')) // Todo protegido
@Controller('boletas')
export class BoletasController {
  constructor(private readonly boletasService: BoletasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar Venta (Resta stock)' })
  create(@Body() dto: CreateBoletaDto, @Request() req) {
    return this.boletasService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Ver historial de ventas' })
  findAll() {
    return this.boletasService.findAll();
  }
}