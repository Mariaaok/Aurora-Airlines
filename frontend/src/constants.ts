import { API_BASE_URL as BASE_URL } from './config';

export const API_BASE_URL = `${BASE_URL}/employees`;

export const CATEGORY_OPTIONS: string[] = [
    'International Pilot (Commander)',
    'International Pilot (Co-pilot)',
    'Domestic Pilot (Commander)',
    'Domestic Pilot (Co-pilot)',
    'Flight Attendant',
];

export interface Employee {
    id: number;
    name: string;
    phoneNumber: string;
    email: string;
    birthday: string;
    category: string;
}

export type CreateEmployeeDto = Omit<Employee, 'id'>;
export type UpdateEmployeeDto = Partial<CreateEmployeeDto>;