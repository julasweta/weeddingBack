import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // ТУТ має бути твоя логіка авторизації
    // Наприклад, розпарсити JWT і додати user у request
    request.user = {
      id: 1,
      email: 'admin@example.com',
      role: 'ADMIN',
      first_name: 'Admin',
      last_name: 'User',
      isConfirmed: true,
    };
    return true;
  }
}
