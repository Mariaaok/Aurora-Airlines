// src/auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
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
    return user;
  }
}