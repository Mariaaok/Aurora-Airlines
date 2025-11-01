import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { FlightTypes } from '../flightTypes/flight-types.entity'; // Chave Estrangeira
import { AircraftTypes } from '../aircraftTypes/aircraft-types.entity'; // Chave Estrangeira
import { Airports } from '../airports/airports.entity'; // Chave Estrangeira
import { EmployeeFlight } from './employee-flight.entity'; // Relação N:M

@Entity()
export class Flights {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  flightNumber: string;

  // --- Relações N:1 (Chaves Estrangeiras) ---

  @Column()
  flightTypeId: number;
  @ManyToOne(() => FlightTypes)
  @JoinColumn({ name: 'flightTypeId' })
  flightType: FlightTypes;

  @Column()
  aircraftTypeId: number;
  @ManyToOne(() => AircraftTypes)
  @JoinColumn({ name: 'aircraftTypeId' })
  aircraftType: AircraftTypes;

  @Column()
  originAirportId: number;
  @ManyToOne(() => Airports)
  @JoinColumn({ name: 'originAirportId' })
  originAirport: Airports;

  @Column()
  destinationAirportId: number;
  @ManyToOne(() => Airports)
  @JoinColumn({ name: 'destinationAirportId' })
  destinationAirport: Airports;

  // --- Campos de Tempo e Rota ---
  @Column()
  departureTime: string;

  @Column()
  arrivalTime: string;
  
  @Column()
  estimatedDuration: string;

  @Column({ type: 'text' }) // Armazena o JSON das escalas
  transfers: string; 

  // --- Relação N:M (Muitos para Muitos) com Funcionários ---
  @OneToMany(() => EmployeeFlight, employeeFlight => employeeFlight.flight, { cascade: true })
  staff: EmployeeFlight[];
}