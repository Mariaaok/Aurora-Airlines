import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aircrafts } from './aircrafts.entity';
import { CreateAircraftsDto } from './create-aircrafts.dto';
import { UpdateAircraftsDto } from './update-aircrafts.dto';

@Injectable()
export class AircraftsService {
  constructor(
    @InjectRepository(Aircrafts)
    private aircraftsRepository: Repository<Aircrafts>,
  ) {}

  // Busca todas as aeronaves e inclui o tipo de aeronave (JOIN)
  findAll() {
    return this.aircraftsRepository.find({ relations: ['aircraftType'] });
  }

  // Cria uma nova aeronave. O ID é fornecido no DTO.
  create(createAircraftsDto: CreateAircraftsDto) {
    const aircraft = this.aircraftsRepository.create(createAircraftsDto);
    return this.aircraftsRepository.save(aircraft);
  }

  async findOne(id: string): Promise<Aircrafts> {
    const aircraft = await this.aircraftsRepository.findOne({ where: { id }, relations: ['aircraftType'] });
    if (!aircraft) {
      throw new NotFoundException(`Aircraft with ID ${id} not found.`);
    }
    return aircraft;
  }

  async update(id: string, updateAircraftsDto: UpdateAircraftsDto) {
    // Usamos update para garantir que apenas o campo modificado seja atualizado
    const result = await this.aircraftsRepository.update(id, updateAircraftsDto);

    if (result.affected === 0) {
        throw new NotFoundException(`Aircraft with ID ${id} not found.`);
    }
    // Retorna a entidade completa atualizada
    return this.aircraftsRepository.findOne({ where: { id }, relations: ['aircraftType'] });
  }

  async remove(id: string): Promise<void> {
    const result = await this.aircraftsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Aircraft with ID ${id} not found.`);
    }
  }
}