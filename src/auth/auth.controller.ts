import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
// Importamos los DTOs que acabamos de crear
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  // Cambiamos 'body: any' por 'dto: LoginDto'
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('register')
  // Cambiamos 'body: any' por 'dto: RegisterDto'
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}