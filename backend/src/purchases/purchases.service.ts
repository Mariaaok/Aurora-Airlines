import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchases } from './purchases.entity';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchases)
    private purchasesRepository: Repository<Purchases>,
  ) {}

  async create(purchaseData: Partial<Purchases>): Promise<Purchases> {
    const purchase = this.purchasesRepository.create(purchaseData);
    return await this.purchasesRepository.save(purchase);
  }

  async findAll(): Promise<Purchases[]> {
    return await this.purchasesRepository.find({
      relations: ['user', 'departureFlight', 'returnFlight', 'departureFlight.originAirport', 'departureFlight.destinationAirport', 'returnFlight.originAirport', 'returnFlight.destinationAirport'],
    });
  }

  async findOne(id: number): Promise<Purchases | null> {
    return await this.purchasesRepository.findOne({
      where: { id },
      relations: ['user', 'departureFlight', 'returnFlight', 'departureFlight.originAirport', 'departureFlight.destinationAirport', 'returnFlight.originAirport', 'returnFlight.destinationAirport'],
    });
  }

  async findByUser(userId: number): Promise<Purchases[]> {
    return await this.purchasesRepository.find({
      where: { userId },
      relations: ['departureFlight', 'returnFlight', 'departureFlight.originAirport', 'departureFlight.destinationAirport', 'returnFlight.originAirport', 'returnFlight.destinationAirport'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateData: Partial<Purchases>): Promise<Purchases | null> {
    await this.purchasesRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.purchasesRepository.delete(id);
  }
}
