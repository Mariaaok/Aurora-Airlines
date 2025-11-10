import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class FlightSearchDto {
  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  departureDate: string;

  @IsString()
  @IsOptional()
  returnDate?: string;
}
