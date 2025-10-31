export const API_BASE_URL = 'http://localhost:5000/airports';

// Interface da Entidade Completa (baseada em airports.entity.ts)
export interface Airport {
    id: number;
    name: string;
    city: string;
    country: string;
    state: string;
    IATA: string;
}

// Tipo para Criação (DTO - Omitindo 'id')
// Baseado em airports/create-airports.dto.ts
export type CreateAirportDto = Omit<Airport, 'id'>;

// Tipo para Atualização (DTO - Tornando todos os campos opcionais)
// Baseado em airports/update-airports.dto.ts
export type UpdateAirportDto = Partial<CreateAirportDto>;