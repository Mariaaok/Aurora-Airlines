// Este DTO define a estrutura da resposta do seu service:
// findFlightsForUserFrontend(userId: number): Promise<UserFlightResponseDto[]>

import { AircraftTypes } from "src/aircraftTypes/aircraft-types.entity";

export class UserFlightsResponseDto {
    // --- Dados da Reserva (UserFlight) ---
    userFlightId: string;
    seat: string;
    status: 'booked' | 'checked-in' | 'cancelled' | 'completed';
  
    // --- Dados do Voo (Flight) ---
    flightNumber: string;
    duration: string;
    departureTime: string; // Enviar como string ISO (ex: "2025-10-05T05:04:00.000Z")
    arrivalTime: string;   // O frontend pode formatar
    aircraftType: string;
  
    // --- Dados do Aeroporto de Origem (Airport) ---
    originCity: string;
    originCountry: string;
    originIATA: string;
  
    // --- Dados do Aeroporto de Destino (Airport) ---
    destinationCity: string;
    destinationCountry: string;
    destinationIATA: string;
  }