import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateAircraftTypesDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  seats?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  layoutData?: string; // O JSON do mapa de assentos
}