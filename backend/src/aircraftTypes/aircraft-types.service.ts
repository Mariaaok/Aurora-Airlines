import { Injectable, NotFoundException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AircraftTypes } from './aircraft-types.entity';
import { CreateAircraftTypesDto } from './create-aircraft-types.dto';
import { UpdateAircraftTypesDto } from './update-aircraft-types.dto'; 

@Injectable()
export class AircraftTypesService {
  constructor(
    @InjectRepository(AircraftTypes)
    private aircraftTypesRepository: Repository<AircraftTypes>,
  ) {}

  findAll() {
    return this.aircraftTypesRepository.find(); 
  }

  create(createAircraftTypesDto: CreateAircraftTypesDto) {
    const aircraftType = this.aircraftTypesRepository.create(createAircraftTypesDto); 
    return this.aircraftTypesRepository.save(aircraftType); 
  }
  
  async findOne(id: number): Promise<AircraftTypes> {
    const aircraftType = await this.aircraftTypesRepository.findOne({ where: { id } });
    if (!aircraftType) {
      throw new NotFoundException(`Aircraft Type with ID ${id} not found.`);
    }
    return aircraftType;
  }
  
  async update(id: number, updateAircraftTypesDto: UpdateAircraftTypesDto) {
    const result = await this.aircraftTypesRepository.update(id, updateAircraftTypesDto);
    
    if (result.affected === 0) {
        throw new NotFoundException(`Aircraft Type with ID ${id} not found.`);
    }
    return this.aircraftTypesRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    const result = await this.aircraftTypesRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Aircraft Type with ID ${id} not found.`);
    }
  }
}