// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/user.service';
import bcrypt =  require('bcrypt');
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  /**
   * Valida o usuário e senha.
   * Chamado pelo LocalStrategy.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    // 1. Encontre o usuário pelo email
    // (Assumindo que você tem 'findOneByEmail' no seu UsersService)
    const user = await this.usersService.findOneByEmail(email);
    console.log('AUTHSERVICE: USUARIO ENCONTRADO')

    if (user) {
      // 2. Compare a senha enviada com o hash salvo no banco
      const isMatch = await bcrypt.compare(pass, user.password);
      
      if (isMatch) {
        // 3. Se bater, retorne o usuário (sem a senha)
        const { password, ...result } = user;
        return result;
      } else {
        console.log("AUTHSERVICE: PASS DONT MATCH")
      }
    }
    
    // 4. Se não encontrar ou a senha não bater, lance um erro
    throw new UnauthorizedException('Invalid e-mail or password');
  }
}