// src/auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // Diz ao Passport para usar o campo 'email' como 'username'
    super({ usernameField: 'email' });
  }

  /**
   * Esta função é chamada automaticamente pelo Passport
   * quando @UseGuards(LocalAuthGuard) é usado.
   */
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      // Se o serviço retornar null/false, o guardião joga o 401
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('USUARIO VALIDADO NO LOCALSTRATEGY')
    return user;
  }
}