import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AircraftsService } from './aircrafts.service';
import { AircraftsController } from './aircrafts.controller';
import { Aircrafts } from './aircrafts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aircrafts])],
  controllers: [AircraftsController],
  providers: [AircraftsService],
  exports: [TypeOrmModule]
})
export class AircraftsModule {}