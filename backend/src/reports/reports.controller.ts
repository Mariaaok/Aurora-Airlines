// src/reports/reports.controller.ts
import { 
    Controller, 
    Post, 
    Body, 
    UseGuards, 
    Request, 
    HttpCode, 
    HttpStatus 
  } from '@nestjs/common';
  import { ReportsService } from './reports.service';
  import { CreateReportDto } from './create-report.dto';
  import { SessionAuthGuard } from 'src/auth/session-auth.guard';
  import { AdminGuard } from 'src/auth/admin.guard';
  
  @Controller('reports')
  @UseGuards(SessionAuthGuard, AdminGuard) // Protege TODAS as rotas
  export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}
  
    @Post()
    @HttpCode(HttpStatus.OK)
    async generateReport(@Body() createReportDto: CreateReportDto) {
      // 1. O @Body() usa o ValidationPipe (do main.ts) para validar o DTO
      // 2. Chama o service para fazer o trabalho pesado
      return this.reportsService.generate(createReportDto);
    }
  }