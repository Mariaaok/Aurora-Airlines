export const API_BASE_URL = 'http://localhost:3001/flight-types';

export interface FlightType {
    id: number;
    name: string;
}

export type CreateFlightTypeDto = Omit<FlightType, 'id'>;
export type UpdateFlightTypeDto = Partial<CreateFlightTypeDto>;