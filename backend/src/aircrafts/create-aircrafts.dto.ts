import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAircraftsDto {
  @IsString()
  @IsNotEmpty()
  id: string; // ID fornecido pelo Admin (ex: A001)

  @IsNumber()
  @IsNotEmpty()
  aircraftTypeId: number; // ID do AircraftType selecionado no DDL
}