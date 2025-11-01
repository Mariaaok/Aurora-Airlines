import { Injectable, NotFoundException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightTypes } from './flight-types.entity';
import { CreateFlightTypesDto } from './create-flight-types.dto';
import { UpdateFlightTypesDto } from './update-flight-types.dto'; 

@Injectable()
export class FlightTypesService {
  constructor(
    @InjectRepository(FlightTypes)
    private flightTypesRepository: Repository<FlightTypes>,
  ) {}

  findAll() {
    return this.flightTypesRepository.find(); 
  }

  create(createFlightTypesDto: CreateFlightTypesDto) {
    const flightType = this.flightTypesRepository.create(createFlightTypesDto); 
    return this.flightTypesRepository.save(flightType); 
  }
  
  async findOne(id: number): Promise<FlightTypes> {
    const flightType = await this.flightTypesRepository.findOne({ where: { id } });
    if (!flightType) {
      throw new NotFoundException(`Flight Type with ID ${id} not found.`);
    }
    return flightType;
  }
  
  async update(id: number, updateFlightTypesDto: UpdateFlightTypesDto) {
    const result = await this.flightTypesRepository.update(id, updateFlightTypesDto);
    
    if (result.affected === 0) {
        throw new NotFoundException(`Flight Type with ID ${id} not found.`);
    }
    return this.flightTypesRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    const result = await this.flightTypesRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Flight Type with ID ${id} not found.`);
    }
  }
}