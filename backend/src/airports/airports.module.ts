import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportsService } from './airports.service';
import { AirportsController } from './airports.controller';
import { Airports } from './airports.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Airports])],
  controllers: [AirportsController],
  providers: [AirportsService],
})
export class AirportsModule {}