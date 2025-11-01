export const API_BASE_URL = 'http://localhost:5000/aircraft-types';

export interface AircraftType {
    id: number;
    type: string;
    seats: number;
    description: string;
    layoutData: string; 
}

export type CreateAircraftTypeDto = Omit<AircraftType, 'id'>;
export type UpdateAircraftTypeDto = Partial<CreateAircraftTypeDto>;