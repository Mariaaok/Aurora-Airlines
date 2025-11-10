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
  @Post('logout') // ✅ No guard - anyone can log out
  logout(@Request() req) {
    return new Promise((resolve, reject) => {
      if (req.session) { // ✅ Check if session exists
        req.session.destroy((err) => { // ✅ Properly handle async
          if (err) {
            reject(err);
          } else {
            resolve({ msg: 'Usuário deslogado' });
          }
        });
      } else {
        resolve({ msg: 'Sessão já encerrada' });
      }
    });
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