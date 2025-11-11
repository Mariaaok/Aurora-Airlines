// src/reports/reports.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { AuthModule } from 'src/auth/auth.module';
import { Flights } from 'src/flights/flights.entity';
import { UserFlights } from 'src/userFlights/userFlights.entity';

@Module({
  imports: [
    AuthModule, // Para usar o SessionAuthGuard e o AdminGuard
    TypeOrmModule.forFeature([
      Flights,     // Necessário para os JOINs e filtros
      UserFlights, // Necessário para 'tickets' e 'sales'
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}