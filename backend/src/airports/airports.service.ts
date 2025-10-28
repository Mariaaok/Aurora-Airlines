import { Injectable, NotFoundException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airports } from './airports.entity';
import { CreateAirportsDto } from './create-airports.dto';
import { UpdateAirportsDto } from './update-airports.dto'; 

@Injectable()
export class AirportsService {
  constructor(
    @InjectRepository(Airports)
    private airportsRepository: Repository<Airports>,
  ) {}

  findAll() {
    return this.airportsRepository.find(); 
  }

  create(CreateAirportsDto: CreateAirportsDto) {
    const airports = this.airportsRepository.create(CreateAirportsDto); 
    return this.airportsRepository.save(airports); 
  }
  
  // GET /employees/:id
  async findOne(id: number): Promise<Airports> {
    const airport = await this.airportsRepository.findOne({ where: { id } });
    if (!airport) {
      throw new NotFoundException(`Airport with ID ${id} not found.`);
    }
    return airport;
  }
  
  // PATCH /employees/:id
  async update(id: number, updateAirportsDto: UpdateAirportsDto) {
    const result = await this.airportsRepository.update(id, updateAirportsDto);
    
    // Verifica se a atualização afetou algum registro
    if (result.affected === 0) {
        throw new NotFoundException(`Airport with ID ${id} not found.`);
    }
    return this.airportsRepository.findOne({ where: { id } });
  }

  // DELETE /employees/:id
  async remove(id: number): Promise<void> {
    const result = await this.airportsRepository.delete(id);
    
    // Verifica se o delete afetou algum registro
    if (result.affected === 0) {
      throw new NotFoundException(`Airport with ID ${id} not found.`);
    }
  }
}