import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../Components/Entities/usuario.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtenemos los roles requeridos desde el decorador del controlador
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Si no hay roles definidos, es público
    }

    // Obtenemos el usuario desde la request (inyectado por JWT Strategy)
    const { user } = context.switchToHttp().getRequest();

    // Verificamos si el rol del usuario coincide con los requeridos
    return requiredRoles.some((role) => user.role === role);
  }
}