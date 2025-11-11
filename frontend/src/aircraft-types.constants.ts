import { API_BASE_URL as BASE_URL } from './config';

export const API_BASE_URL = `${BASE_URL}/aircraft-types`;

export interface AircraftType {
    id: number;
    type: string;
    seats: number;
    description: string;
    layoutData: string; 
}

export type CreateAircraftTypeDto = Omit<AircraftType, 'id'>;
export type UpdateAircraftTypeDto = Partial<CreateAircraftTypeDto>;