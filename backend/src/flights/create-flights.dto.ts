import { IsString, IsNumber, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class CreateFlightsDto {
  @IsString()
  @IsNotEmpty()
  flightNumber: string;

  @IsNumber()
  @IsNotEmpty()
  flightTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  aircraftTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  originAirportId: number;

  @IsNumber()
  @IsNotEmpty()
  destinationAirportId: number;

  @IsString()
  @IsNotEmpty()
  departureTime: string;

  @IsString()
  @IsNotEmpty()
  arrivalTime: string;

  @IsString()
  @IsNotEmpty()
  estimatedDuration: string;
  
  @IsString() // Espera-se que seja um JSON string do frontend
  @IsNotEmpty()
  transfers: string; 

  @IsArray()
  @IsNumber({}, { each: true })
  staffIds: number[]; 
}