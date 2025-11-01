import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Flights } from './flights.entity';
import { EmployeeFlight } from './employee-flight.entity';
import { Employees } from '../employees/employees.entity'; // Assume que esta entidade existe
import { CreateFlightsDto } from './create-flights.dto';
import { UpdateFlightsDto } from './update-flights.dto';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flights)
    private flightsRepository: Repository<Flights>,
    @InjectRepository(EmployeeFlight)
    private employeeFlightRepository: Repository<EmployeeFlight>,
    @InjectRepository(Employees)
    private employeesRepository: Repository<Employees>, // Para validar funcionários
  ) {}

  // Função auxiliar para buscar todas as relações
  private getFlightRelations() {
    return ['flightType', 'aircraftType', 'originAirport', 'destinationAirport', 'staff', 'staff.employee'];
  }

  findAll() {
    // Retorna todos os voos com todas as relações (JOINs)
    return this.flightsRepository.find({ relations: this.getFlightRelations() }); 
  }
  
  async findOne(id: number): Promise<Flights> {
    const flight = await this.flightsRepository.findOne({ where: { id }, relations: this.getFlightRelations() });
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found.`);
    }
    return flight;
  }
  
  // Função auxiliar para salvar o staff (relação N:M)
  private async saveStaff(flightId: number, staffIds: number[]) {
    // 1. Deleta relações antigas
    await this.employeeFlightRepository.delete({ flightId });

    if (staffIds.length === 0) return;
    
    // 2. Valida se os funcionários existem
    const existingEmployees = await this.employeesRepository.find({
        where: { id: In(staffIds) },
        select: ['id']
    });

    if (existingEmployees.length !== staffIds.length) {
        throw new BadRequestException('One or more employee IDs are invalid.');
    }
    
    // 3. Cria novas relações
    const newRelations = staffIds.map(employeeId => 
      this.employeeFlightRepository.create({ flightId, employeeId })
    );

    return this.employeeFlightRepository.save(newRelations);
  }

  async create(createFlightsDto: CreateFlightsDto) {
    const { staffIds, ...flightData } = createFlightsDto;
    
    const flight = this.flightsRepository.create(flightData); 
    const savedFlight = await this.flightsRepository.save(flight); 

    await this.saveStaff(savedFlight.id, staffIds);
    
    return this.findOne(savedFlight.id); // Retorna o voo completo com relações
  }
  
  async update(id: number, updateFlightsDto: UpdateFlightsDto) {
    const { staffIds, ...flightData } = updateFlightsDto;
    
    // 1. Atualiza os dados principais do voo
    const result = await this.flightsRepository.update(id, flightData);
    if (result.affected === 0) {
        throw new NotFoundException(`Flight with ID ${id} not found.`);
    }

    // 2. Atualiza os dados do staff, se staffIds foi fornecido
    if (staffIds !== undefined) {
        await this.saveStaff(id, staffIds);
    }
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.flightsRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Flight with ID ${id} not found.`);
    }
  }
}