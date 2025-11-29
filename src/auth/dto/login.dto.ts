import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'vendedor@tienda.cl' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123' })
  @IsString()
  password: string;
}