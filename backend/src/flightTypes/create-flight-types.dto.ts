import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFlightTypesDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}