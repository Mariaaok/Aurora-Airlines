import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateAircraftTypesDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  seats: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  layoutData: string; 
}