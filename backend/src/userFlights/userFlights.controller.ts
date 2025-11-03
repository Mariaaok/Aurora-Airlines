import { Controller, Get, Request, UseGuards, Param } from '@nestjs/common';
import { UserFlightsService } from './userFlights.service';
import { UserFlightsResponseDto } from './userFlights-response.dto'; 
import { SessionAuthGuard } from 'src/auth/session-auth.guard';

@Controller('userFlights')
export class UserFlightsController {
  constructor(private userFlightsService: UserFlightsService) {}

  @UseGuards(SessionAuthGuard)
  @Get()
  async findMyFlights(@Request() req): Promise<UserFlightsResponseDto[]> {
    const userId: number = req.user.id;

    return this.userFlightsService.findFlightsForUserFrontend(userId);
  }
}