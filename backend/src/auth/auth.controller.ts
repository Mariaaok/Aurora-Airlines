// src/auth/auth.controller.ts
import { Controller, Post, UseGuards, Request, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard'; // Criaremos este guardinha
import { SessionAuthGuard } from './session-auth.guard';
import { LoginDto } from './login.dto'; // Crie um DTO simples

@Controller('auth')
export class AuthController {

  /**
   * Rota de Login: POST /auth/login
   * Usa o LocalAuthGuard para ativar a LocalStrategy.
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body() loginDto: LoginDto): Promise<any> {
    // Se o 'LocalAuthGuard' passar, o 'req.user' já foi
    // preenchido pelo 'validate' da LocalStrategy.
    // O Passport cria a sessão automaticamente aqui.
    return req.user;
  }

  /**
   * Rota de Logout: POST /auth/logout
   */
  @UseGuards(SessionAuthGuard) // Só pode deslogar se estiver logado
  @Post('logout')
  logout(@Request() req) {
    req.session.destroy(); // Destrói a sessão no servidor
    return { msg: 'Usuário deslogado' };
  }

  /**
   * Rota de Status: GET /auth/status
   * Verifica se o usuário tem uma sessão ativa (cookie).
   */
  @UseGuards(SessionAuthGuard)
  @Get('status')
  status(@Request() req) {
    // Se o 'SessionAuthGuard' passar, o 'req.user' foi
    // preenchido pelo 'deserializeUser'.
    return req.user;
  }
}