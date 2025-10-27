import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common'; // Adicionados Param, Patch, Delete
import { EmployeesService } from './employees.service';
import { CreateEmployeesDto } from './create-employees.dto'; 
import { UpdateEmployeesDto } from './update-employees.dto'; // Importa o novo DTO

@Controller('employees')
export class EmployeesController {
  constructor(private EmployeesService: EmployeesService) {} // Já existente

  // Endpoint: Buscar todos os funcionários (GET /employees)
  @Get() 
  findAll() {
    return this.EmployeesService.findAll(); // Já existente
  }

  // Endpoint: Adicionar novo funcionário (POST /employees)
  @Post()
  create(@Body() CreateEmployeesDto: CreateEmployeesDto) { 
    return this.EmployeesService.create(CreateEmployeesDto); // Já existente
  }
  
  // Novo Endpoint: Buscar funcionário por ID (GET /employees/:id)
  @Get(':id')
  findOne(@Param('id') id: string) {
    // O '+' converte a string do parâmetro para número
    return this.EmployeesService.findOne(+id); 
  }

  // Novo Endpoint: Modificar/Atualizar funcionário (PATCH /employees/:id)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeesDto: UpdateEmployeesDto) {
    // O método PATCH é usado para atualizações parciais
    return this.EmployeesService.update(+id, updateEmployeesDto);
  }

  // Novo Endpoint: Deletar funcionário (DELETE /employees/:id)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.EmployeesService.remove(+id);
  }
}