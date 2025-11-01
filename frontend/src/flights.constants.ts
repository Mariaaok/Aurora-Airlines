import { AircraftType } from "./aircraft-types.constants";
import { FlightType } from "./flight-types.constants";
import { Airport } from "./airports.constants";
import { Employee } from "./constants";

export const API_BASE_URL = 'http://localhost:5000/flights';

// Estrutura para escalas
export interface Transfer {
    airportId: number;
    departureTime: string;
    arrivalTime: string;
}

// Estrutura principal da Entidade Flights (incluindo objetos de relacionamento)
export interface Flight {
    id: number;
    flightNumber: string;
    
    flightTypeId: number;
    flightType: FlightType; // Objeto injetado do backend
    
    aircraftTypeId: number;
    aircraftType: AircraftType; // Objeto injetado do backend
    
    originAirportId: number;
    originAirport: Airport;
    
    destinationAirportId: number;
    destinationAirport: Airport;
    
    departureTime: string;
    arrivalTime: string;
    estimatedDuration: string;
    transfers: string; // JSON string
    
    // Lista de funcionários envolvidos no voo (EmployeeFlight)
    staff: { employee: Employee }[]; 
}

// DTO de Criação (sem o ID e objetos de relacionamento)
export interface CreateFlightDto extends Omit<Flight, 'id' | 'flightType' | 'aircraftType' | 'originAirport' | 'destinationAirport' | 'staff'> {
    staffIds: number[];
}

export type UpdateFlightDto = Partial<CreateFlightDto>;