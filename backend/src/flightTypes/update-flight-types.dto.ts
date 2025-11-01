import { IsString, IsOptional } from 'class-validator';

export class UpdateFlightTypesDto {
  @IsString()
  @IsOptional()
  name?: string;
}