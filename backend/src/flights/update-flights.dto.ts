import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class UpdateFlightsDto {
  @IsString()
  @IsOptional()
  flightNumber?: string;

  @IsNumber()
  @IsOptional()
  flightTypeId?: number;

  @IsNumber()
  @IsOptional()
  aircraftTypeId?: number;

  @IsNumber()
  @IsOptional()
  originAirportId?: number;

  @IsNumber()
  @IsOptional()
  destinationAirportId?: number;

  @IsString()
  @IsOptional()
  departureTime?: string;

  @IsString()
  @IsOptional()
  departureDate?: string;

  @IsString()
  @IsOptional()
  arrivalTime?: string;

  @IsString()
  @IsOptional()
  arrivalDate?: string;

  @IsString()
  @IsOptional()
  estimatedDuration?: string;
  
  @IsString()
  @IsOptional()
  transfers?: string; 

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  staffIds?: number[];
}