import { Injectable, NotFoundException } from '@nestjs/common'; // Adicionado NotFoundException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employees } from './employees.entity';
import { CreateEmployeesDto } from './create-employees.dto';
import { UpdateEmployeesDto } from './update-employees.dto'; // Importa o novo DTO

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employees)
    private employeesRepository: Repository<Employees>,
  ) {}

  findAll() {
    return this.employeesRepository.find(); // Já existente
  }

  create(CreateEmployeesDto: CreateEmployeesDto) {
    const employees = this.employeesRepository.create(CreateEmployeesDto); // Já existente
    return this.employeesRepository.save(employees); // Já existente
  }
  
  // Novo: Buscar funcionário por ID (GET /employees/:id)
  async findOne(id: number): Promise<Employees> {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) {
      // Lança uma exceção se não encontrar o recurso
      throw new NotFoundException(`Employee with ID ${id} not found.`);
    }
    return employee;
  }
  
  // Novo: Atualizar funcionário (PATCH /employees/:id)
  async update(id: number, updateEmployeesDto: UpdateEmployeesDto) {
    const result = await this.employeesRepository.update(id, updateEmployeesDto);
    
    // Verifica se a atualização afetou algum registro
    if (result.affected === 0) {
        throw new NotFoundException(`Employee with ID ${id} not found.`);
    }
    // Retorna o funcionário atualizado
    return this.employeesRepository.findOne({ where: { id } });
  }

  // Novo: Deletar funcionário (DELETE /employees/:id)
  async remove(id: number): Promise<void> {
    const result = await this.employeesRepository.delete(id);
    
    // Verifica se o delete afetou algum registro
    if (result.affected === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found.`);
    }
  }
}