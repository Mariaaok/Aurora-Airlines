import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AircraftTypesService } from './aircraft-types.service';
import { AircraftTypesController } from './aircraft-types.controller';
import { AircraftTypes } from './aircraft-types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AircraftTypes])],
  controllers: [AircraftTypesController],
  providers: [AircraftTypesService],
})
export class AircraftTypesModule {}