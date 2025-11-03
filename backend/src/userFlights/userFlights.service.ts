import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFlights } from './userFlights.entity';
import { UserFlightsResponseDto } from './userFlights-response.dto';

@Injectable()
export class UserFlightsService {
    constructor(
        @InjectRepository(UserFlights)
        private userFlightsRepository: Repository<UserFlights>,
    ){}

    async findFlightsForUserFrontend(userId: number): Promise<UserFlightsResponseDto[]> {
    
        // 1. Buscamos os dados com o QueryBuilder (agora incluindo o aircraftType)
        const userFlights = await this.userFlightsRepository.createQueryBuilder('uf')
            .leftJoinAndSelect('uf.flight', 'f')
            .leftJoinAndSelect('f.originAirport', 'origin')
            .leftJoinAndSelect('f.destinationAirport', 'dest')
            .leftJoinAndSelect('f.aircraftType', 'aircraft') // <-- ADICIONADO
            .leftJoinAndSelect('f.flightType', 'ft')
            .where('uf.userId = :userId', { userId: userId })
            .getMany();

        // 2. Mapeamos para o DTO corrigido
        const mappedFlights = userFlights.map(uf => {

            // Proteção para caso o voo ou relações sejam nulos
            if (!uf.flight || !uf.flight.originAirport || !uf.flight.destinationAirport || !uf.flight.aircraftType) {
                return null; 
            }

            return {
                userFlightId: uf.id,
                seat: uf.seatNumber,
                            status: uf.status,
                            flightNumber: uf.flight.flightNumber,
                            duration: uf.flight.estimatedDuration,
                            departureTime: uf.flight.departureTime,
                            arrivalTime: uf.flight.arrivalTime,
                            aircraftType: uf.flight.aircraftType.type,
                            flightType: uf.flight.flightType.name,
                            originCity: uf.flight.originAirport.city,
                            originCountry: uf.flight.originAirport.country,
                            originIATA: uf.flight.originAirport.IATA,
                            destinationCity: uf.flight.destinationAirport.city,
                            destinationCountry: uf.flight.destinationAirport.country,
                            destinationIATA: uf.flight.destinationAirport.IATA,
            };
        });

        return mappedFlights.filter(flight => flight !== null);
    }
}