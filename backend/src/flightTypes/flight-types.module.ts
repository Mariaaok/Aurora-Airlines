import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightTypesService } from './flight-types.services';
import { FlightTypesController } from './flight-types.controller';
import { FlightTypes } from './flight-types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FlightTypes])],
  controllers: [FlightTypesController],
  providers: [FlightTypesService],
  exports: [TypeOrmModule]
})
export class FlightTypesModule {}