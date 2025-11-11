// src/reports/reports.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Flights } from 'src/flights/flights.entity';
import { UserFlights } from 'src/userFlights/userFlights.entity';
import { AircraftTypes } from 'src/aircraftTypes/aircraft-types.entity';
import { CreateReportDto } from './create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Flights)
    private flightRepository: Repository<Flights>,
    @InjectRepository(UserFlights)
    private userFlightRepository: Repository<UserFlights>,
  ) {}

  /**
   * Ponto de entrada principal para gerar qualquer tipo de relatório.
   */
  async generate(dto: CreateReportDto) {
    switch (dto.category) {
      case 'tickets':
        return this.generateTicketsSoldReport(dto);
      case 'occupation':
        return this.generateOccupationReport(dto);
      case 'sales':
        return this.generateSalesReport(dto);
      default:
        throw new BadRequestException('Categoria de relatório inválida.');
    }
  }

  // --- MÉTODOS PRIVADOS DE GERAÇÃO ---

  /**
   * Gera o relatório de "Tickets Vendidos".
   * (Contagem de registros 'UserFlight' que batem com os filtros)
   */
  private async generateTicketsSoldReport(dto: CreateReportDto) {
    const query = this.userFlightRepository.createQueryBuilder('uf');
    
    // Adiciona o JOIN com 'Flight' (necessário para os filtros)
    query.leftJoin('uf.flight', 'f');

    // Aplica os filtros de data e os filtros opcionais
    this.applyFilters(query, dto);

    // Executa a contagem
    const ticketsSold = await query.getCount();
    
    return {
      category: 'Tickets Sold',
      period: `${dto.startDate} to ${dto.endDate}`,
      ticketsSold: ticketsSold,
      filter: dto.filter ? `${dto.filter.type}: ${dto.filter.value}` : 'All Flights',
    };
  }

  /**
   * Gera o relatório de "Ocupação de Assentos".
   * (Tickets Vendidos / Total de Assentos Ofertados)
   */
  private async generateOccupationReport(dto: CreateReportDto) {
    // --- Query 1: Achar Tickets Vendidos (igual ao método anterior) ---
    const ticketsQuery = this.userFlightRepository.createQueryBuilder('uf');
    ticketsQuery.leftJoin('uf.flight', 'f');
    this.applyFilters(ticketsQuery, dto);
    const ticketsSold = await ticketsQuery.getCount();

    // --- Query 2: Achar Total de Assentos Ofertados ---
    // (Soma dos assentos de TODAS as aeronaves que voaram no período)
    const seatsQuery = this.flightRepository.createQueryBuilder('f');
    seatsQuery.leftJoin('f.aircraftType', 'at'); // Join com AircraftType
    
    // Aplica os mesmos filtros, mas desta vez na tabela 'Flight'
    this.applyFilters(seatsQuery, dto); 
    
    // Seleciona a SOMA() da coluna 'seats'
    const { totalSeats } = await seatsQuery
      .select('SUM(at.seats)', 'totalSeats')
      .getRawOne(); // .getRawOne() é usado para agregar (SUM, COUNT, etc)

    const totalSeatsNum = parseInt(totalSeats) || 0;
    const rate = totalSeatsNum > 0 ? (ticketsSold / totalSeatsNum) * 100 : 0;
    
    return {
      category: 'Seats Occupation',
      period: `${dto.startDate} to ${dto.endDate}`,
      ticketsSold: ticketsSold,
      totalSeatsAvailable: totalSeatsNum,
      occupationRate: `${rate.toFixed(1)}%`,
    };
  }

  /**
   * Gera o relatório de "Soma de Vendas".
   * (Soma da coluna 'price' da tabela 'UserFlight')
   */
  private async generateSalesReport(dto: CreateReportDto) {
    // NOTA: Esta query assume que você tem uma coluna 'price'
    // na sua entidade 'UserFlight' (user_flights).
    // Se a coluna 'price' estiver na entidade 'Flight', mude a query.

    const query = this.userFlightRepository.createQueryBuilder('uf');
    query.leftJoin('uf.flight', 'f');
    this.applyFilters(query, dto);
    
    const { totalSales } = await query
      .select('SUM(uf.price)', 'totalSales') // <-- ASSUME 'uf.price'
      .getRawOne();
      
    return {
      category: 'Sum of Sales',
      period: `${dto.startDate} to ${dto.endDate}`,
      totalSales: parseFloat(totalSales) || 0,
    };
  }

  
  /**
   * Função auxiliar para aplicar os filtros de data e os filtros opcionais
   * ao QueryBuilder.
   */
  private applyFilters(
    query: SelectQueryBuilder<any>, 
    dto: CreateReportDto
  ): void {
    // 1. Filtro de Data (Obrigatório)
    // Usa 'f.departureDate' pois as datas são do Voo, não da reserva
    query.where('f.departureDate BETWEEN :startDate AND :endDate', {
      startDate: dto.startDate,
      endDate: dto.endDate,
    });

    // 2. Filtros Opcionais
    if (dto.filter) {
      if (dto.filter.type === 'number') {
        query.andWhere('f.flightNumber = :value', { 
          value: dto.filter.value 
        });
      }
      if (dto.filter.type === 'type') {
        // 'flightTypeId' é o nome da coluna de chave estrangeira
        query.andWhere('f.flightTypeId = :value', { 
          value: dto.filter.value 
        });
      }
    }
  }
}