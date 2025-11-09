import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/user.module';
import { EmployeesModule } from './employees/employees.module';
import { AirportsModule } from './airports/airports.module';
import { AircraftTypesModule } from './aircraftTypes/aircraft-types.module';
import { AircraftsModule } from './aircrafts/aircrafts.module';
import { FlightTypesModule } from './flightTypes/flight-types.module';
import { FlightsModule } from './flights/flights.module';
import { AuthModule } from './auth/auth.module';
import { UserFlightsModule } from './userFlights/userFlights.module';
import { PurchasesModule } from './purchases/purchases.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }),
    UsersModule,
    EmployeesModule,
    AirportsModule,
    AircraftTypesModule,
    AircraftsModule,
    FlightTypesModule,
    FlightsModule,
    AuthModule,
    UserFlightsModule,
    PurchasesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

