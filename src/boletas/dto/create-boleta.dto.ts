import { IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DetalleDto {
  @ApiProperty() @IsInt() @IsPositive() productoId: number;
  @ApiProperty() @IsInt() @IsPositive() cantidad: number;
}

export class CreateBoletaDto {
  @ApiProperty({ type: [DetalleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleDto)
  detalles: DetalleDto[];
}