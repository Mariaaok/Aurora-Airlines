import { API_BASE_URL as BASE_URL } from './config';

export const API_BASE_URL = `${BASE_URL}/flight-types`;

export interface FlightType {
    id: number;
    name: string;
}

export type CreateFlightTypeDto = Omit<FlightType, 'id'>;
export type UpdateFlightTypeDto = Partial<CreateFlightTypeDto>;