// src/reports/dto/filter.dto.ts
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

// DTO para o objeto 'filter' aninhado
export class FilterDto {
  @IsIn(['type', 'number'])
  @IsNotEmpty()
  type: 'type' | 'number';

  @IsString()
  @IsNotEmpty()
  value: string;
}

