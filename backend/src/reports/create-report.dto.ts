// src/reports/dto/create-report.dto.ts
import { 
    IsDateString, 
    IsIn, 
    IsOptional, 
    ValidateNested,
    IsNotEmpty 
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { FilterDto } from './filter.dto';
  
  export class CreateReportDto {
    @IsIn(['sales', 'tickets', 'occupation'])
    @IsNotEmpty()
    category: 'sales' | 'tickets' | 'occupation';
  
    @IsDateString()
    @IsNotEmpty()
    startDate: string; // Já vem como 'yyyy-mm-dd'
  
    @IsDateString()
    @IsNotEmpty()
    endDate: string;
  
    @IsOptional()
    @ValidateNested()
    @Type(() => FilterDto)
    filter?: FilterDto;
  }