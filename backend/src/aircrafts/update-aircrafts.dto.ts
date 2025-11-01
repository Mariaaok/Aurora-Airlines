import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UpdateAircraftsDto {
  // O ID (PrimaryColumn) não é atualizável, mas os outros campos são opcionais
  
  @IsNumber()
  @IsOptional()
  aircraftTypeId?: number;
}