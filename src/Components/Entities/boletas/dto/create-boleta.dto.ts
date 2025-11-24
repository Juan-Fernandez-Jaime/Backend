import { IsArray, IsInt, IsNotEmpty, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DetalleDto {
  @ApiProperty({ example: 1, description: 'ID del producto a comprar' })
  @IsInt()
  @IsPositive()
  productoId: number;

  @ApiProperty({ example: 2, description: 'Cantidad de unidades' })
  @IsInt()
  @IsPositive()
  cantidad: number;
}

export class CreateBoletaDto {
  @ApiProperty({ type: [DetalleDto], description: 'Lista de productos y cantidades' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleDto)
  detalles: DetalleDto[];
}