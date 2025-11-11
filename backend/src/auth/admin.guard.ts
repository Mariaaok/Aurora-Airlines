// src/auth/admin.guard.ts
import { 
    Injectable, 
    CanActivate, 
    ExecutionContext, 
    ForbiddenException 
  } from '@nestjs/common';
  
  @Injectable()
  export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
  
      // 1. Verifica se está logado
      if (!request.isAuthenticated()) {
        return false; // Deixa o SessionAuthGuard (ou outro) lidar com o 401
      }
  
      // 2. Verifica se é admin
      if (request.user?.type === 'admin') {
        return true;
      }
  
      // 3. Se estiver logado, mas não for admin, joga um 403 Forbidden
      throw new ForbiddenException('Acesso restrito a administradores.');
    }
  }