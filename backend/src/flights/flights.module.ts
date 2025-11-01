import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { Flights } from './flights.entity';
import { Employees } from '../employees/employees.entity'; // Assumindo o caminho
import { EmployeeFlight } from './employee-flight.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Flights, EmployeeFlight, Employees]),
  ],
  controllers: [FlightsController],
  providers: [FlightsService],
  exports: [TypeOrmModule]
})
export class FlightsModule {}