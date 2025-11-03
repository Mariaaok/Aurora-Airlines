// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/user.module'; // Importe seu módulo de usuário
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session.serializer';
import { SessionAuthGuard } from './session-auth.guard'; // O guard que criamos

@Module({
  imports: [
    UsersModule, // Precisa do UsersService para buscar usuários
    PassportModule.register({ session: true }), // <-- Habilita sessões no Passport
  ],
  providers: [
    AuthService,
    LocalStrategy,     // Valida usuário e senha
    SessionSerializer, // Salva/lê usuário da sessão
    SessionAuthGuard,  // Protege rotas
  ],
  controllers: [AuthController],
  exports: [SessionAuthGuard], // Exporta o Guard para outros módulos usarem
})
export class AuthModule {}