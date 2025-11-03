import { 
  CanActivate, 
  ExecutionContext, 
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  
  /**
   * Este método é chamado automaticamente pelo Nest.js
   * sempre que o Guard é usado em uma rota.
   */
  canActivate(context: ExecutionContext): boolean {
    
    // 1. Obtém o objeto 'request' da requisição
    const request = context.switchToHttp().getRequest();

    // 2. A "Mágica" do Passport.js
    //    Se o 'passport.session()' (do main.ts) e o 
    //    'SessionSerializer' (deserializeUser) funcionaram,
    //    o Passport anexa a função 'isAuthenticated()' ao request.
    const isAuthenticated = request.isAuthenticated();

    // 3. Verificação
    if (isAuthenticated) {
      // Se a sessão for válida, permite o acesso.
      return true;
    } else {
      // Se não houver sessão válida (sem cookie ou cookie expirado),
      // lança uma exceção, que o Nest.js converte em uma
      // resposta HTTP 401 Unauthorized.
      throw new UnauthorizedException('Acesso não autorizado. Por favor, faça o login.');
    }
  }
}