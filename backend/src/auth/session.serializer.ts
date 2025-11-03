// src/auth/session.serializer.ts
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from 'src/users/user.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  /**
   * Salva o ID do usuário na sessão (cookie)
   */
  serializeUser(user: User, done: (err: Error, userId: number) => void) {
    done(null, user.id);
  }

  /**
   * Usa o ID da sessão para buscar o usuário no banco
   * e anexá-lo ao 'req.user' em CADA requisição autenticada.
   */
  async deserializeUser(userId: number, done: (err: Error, user: User) => void) {
    // Busca o usuário no banco com o ID salvo
    const user = await this.usersService.findOneById(userId); 
    // (Assumindo que você tem 'findOneById' no seu UsersService)
    
    done(null, user);
  }
}