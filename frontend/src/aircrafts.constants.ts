import { AircraftType } from "./aircraft-types.constants";

export const API_BASE_URL = 'http://localhost:5000/aircrafts';

export interface Aircraft {
    id: string; // ID único da aeronave (ex: A001)
    aircraftTypeId: number;
    // O backend injeta o objeto completo do tipo de aeronave
    aircraftType: AircraftType; 
}

export type CreateAircraftDto = Omit<Aircraft, 'aircraftType'>;
export type UpdateAircraftDto = Partial<Omit<Aircraft, 'id' | 'aircraftType'>>;