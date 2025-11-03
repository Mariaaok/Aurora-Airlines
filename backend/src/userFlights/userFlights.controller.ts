import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserFlightsService } from './userFlights.service';
import { UserFlightsResponseDto } from './userFlights-response.dto'; 

@Controller('userFlights')
export class UserFlightsController {
  constructor(private userFlightsService: UserFlightsService) {}

  @Get('my-flights')
  async findMyFlights(@Request() req): Promise<UserFlightsResponseDto[]> {
    
    // 6. Graças ao Passport e ao SessionAuthGuard,
    // o 'req.user' é preenchido com os dados do usuário da sessão.
    const userId: number = req.user.id;

    // 7. Chama o service com o ID e retorna o resultado.
    // O Nest.js irá converter o array de DTOs em JSON automaticamente.
    return this.userFlightsService.findFlightsForUserFrontend(userId);
  }
}