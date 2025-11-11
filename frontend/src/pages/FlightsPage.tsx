import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios'; // NOVO: Importar AxiosResponse
import Navbar from '../components/layouts/navbar';
import PageContainer from '../components/layouts/pageContainer';
import SectionHeader from '../components/layouts/sectionHeader';
import DataCard from '../components/cards/DataCard';
import DangerButton from '../components/buttons/dangerButton';
import { AdminTabs } from '../components/layouts/adminTabs';
import FlightModal from '../components/flightModal'; 
// Importar todas as interfaces e APIs necessárias
import { API_BASE_URL as FLIGHTS_API, Flight, CreateFlightDto, UpdateFlightDto, Transfer } from '../flights.constants'; 
import { API_BASE_URL as FLIGHT_TYPES_API, FlightType } from '../flight-types.constants';
import { API_BASE_URL as AIRCRAFT_TYPES_API, AircraftType } from '../aircraft-types.constants';
import { API_BASE_URL as AIRPORTS_API, Airport } from '../airports.constants';
import { API_BASE_URL } from '../config';
import { Employee } from '../constants'; // Assumindo a interface Employee

// Interface auxiliar para formatar os dados para o DataCard
interface FlightDisplayData {
    flightNumber: string;
    flightType: string;
    aircraftType: string;
    departureDate: string;
    departureTime: string;
    arrivalDate: string;
    arrivalTime: string;
    estimatedDuration: string;
    originAirport: string;
    destinationAirport: string;
    transferCount: number;
    staffNames: string;
}

const AdminFlightsPage: React.FC = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [flightToEdit, setFlightToEdit] = useState<Flight | null>(null);

    // Estados para os dados de DDL (Chaves Estrangeiras)
    const [allFlightTypes, setAllFlightTypes] = useState<FlightType[]>([]);
    const [allAircraftTypes, setAllAircraftTypes] = useState<AircraftType[]>([]);
    const [allAirports, setAllAirports] = useState<Airport[]>([]);
    const [allEmployees, setAllEmployees] = useState<Employee[]>([]);


    // --- Funções de API ---
    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            // 1. DEFINIÇÃO DA TUPLA DE RESPOSTA (Força a ordem correta para o compilador)
            type FlightDataTuple = [
                AxiosResponse<Flight[]>,
                AxiosResponse<FlightType[]>,
                AxiosResponse<AircraftType[]>,
                AxiosResponse<Airport[]>,
                AxiosResponse<Employee[]>,
            ];

            const responses = await Promise.all([
            axios.get<Flight[]>(FLIGHTS_API),
            axios.get<FlightType[]>(FLIGHT_TYPES_API),
            axios.get<AircraftType[]>(AIRCRAFT_TYPES_API),
            axios.get<Airport[]>(AIRPORTS_API),
            axios.get<Employee[]>(`${API_BASE_URL}/employees`),
            ]);

            const [
            flightsResponse,
            flightTypesResponse,
            aircraftTypesResponse,
            airportsResponse,
            employeesResponse,
            ] = responses;
            // As atribuições de estado são corretas:
            setFlights(flightsResponse.data);
            setAllFlightTypes(flightTypesResponse.data);
            setAllAircraftTypes(aircraftTypesResponse.data);
            setAllAirports(airportsResponse.data);
            setAllEmployees(employeesResponse.data);

        } catch (error) {
            console.error('Error fetching flight data:', error);
            alert('Error loading flight data. Check the console and ensure backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // 2. Função de Salvar/Atualizar
    const handleSaveFlight = async (data: CreateFlightDto | UpdateFlightDto) => {
        try {
            if (flightToEdit) {
                await axios.patch(`${FLIGHTS_API}/${flightToEdit.id}`, data as UpdateFlightDto);
                alert(`Flight ${flightToEdit.flightNumber} updated successfully!`); 
            } else {
                await axios.post(FLIGHTS_API, data as CreateFlightDto);
                alert('Flight added successfully!');
            }
            
            fetchAllData(); 
            setIsModalOpen(false);
        } catch (error) {
            console.error(`Error saving flight:`, error);
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : `Error saving flight. Check the console.`;
            alert(errorMessage);
        }
    };

    // 3. Função de Exclusão
    const handleDeleteFlight = async (id: number, flightNumber: string) => {
        if (!window.confirm(`Are you sure you want to delete flight number ${flightNumber}?`)) {
            return;
        }
        try {
            await axios.delete(`${FLIGHTS_API}/${id}`);
            alert(`Flight ${flightNumber} deleted successfully.`);
            fetchAllData();
        } catch (error) {
            console.error('Error deleting flight:', error);
            alert('Error deleting flight. Check the console.');
        }
    };

    // --- Funções de Modal ---
    const handleAdd = () => {
        setFlightToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (flight: Flight) => {
        setFlightToEdit(flight);
        setIsModalOpen(true);
    };

    // --- Auxiliar de Formatação para o Card ---
    const formatFlightData = (flight: Flight): FlightDisplayData => {
        const staffNames = flight.staff
            .map(s => s.employee.name)
            .join(' | ');
        
        const transfers: Transfer[] = flight.transfers ? JSON.parse(flight.transfers) : [];

        return {
            flightNumber: flight.flightNumber,
            flightType: flight.flightType.name,
            aircraftType: flight.aircraftType.type,
            departureDate: flight.departureDate,
            departureTime: flight.departureTime,
            arrivalDate: flight.arrivalDate,
            arrivalTime: flight.arrivalTime,
            estimatedDuration: flight.estimatedDuration,
            originAirport: `${flight.originAirport.name} (${flight.originAirport.IATA})`,
            destinationAirport: `${flight.destinationAirport.name} (${flight.destinationAirport.IATA})`,
            transferCount: transfers.length,
            staffNames: staffNames || 'No staff assigned',
        };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <AdminTabs />
                <div style={loadingStyles}>Loading flight data...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <AdminTabs />
            <PageContainer>
                <SectionHeader 
                    title="Flights" 
                    buttonText="Add new flight" 
                    onButtonClick={handleAdd} 
                />
                
                {flights.length === 0 && <p className="text-gray-500">No flights scheduled.</p>}

                <div className="space-y-4">
                    {flights.map((flight) => {
                        const data = formatFlightData(flight);
                        return (
                            <DataCard
                                key={flight.id}
                                actions={
                                    <>
                                        <button 
                                            onClick={() => handleEdit(flight)} 
                                            className="text-blue-800 hover:text-blue-900 p-1 rounded transition"
                                            title="Edit Flight"
                                        >
                                            ✏️
                                        </button>
                                        <DangerButton onClick={() => handleDeleteFlight(flight.id, flight.flightNumber)}>🗑️</DangerButton>
                                    </>
                                }
                            >
                                <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
                                    {/* COLUNA 1 */}
                                    <div className="flex flex-col space-y-1">
                                        <p><strong>Flight number:</strong> {data.flightNumber}</p>
                                        <p><strong>Aircraft type:</strong> {data.aircraftType}</p>
                                        <p><strong>Departure date:</strong> {data.departureDate}</p>
                                        <p><strong>Departure time:</strong> {data.departureTime}</p>
                                        <p><strong>Transfer count:</strong> {data.transferCount}</p>
                                        <p><strong>Arrival date:</strong> {data.arrivalDate}</p>
                                        <p><strong>Arrival time:</strong> {data.arrivalTime}</p>
                                        <p className="mt-2"><strong>Staff:</strong> {data.staffNames}</p>
                                    </div>
                                    
                                    {/* COLUNA 2 */}
                                    <div className="flex flex-col space-y-1">
                                        <p><strong>Type:</strong> {data.flightType}</p>
                                        <p><strong>Flight duration:</strong> {data.estimatedDuration}</p>
                                        <p><strong>From:</strong> {data.originAirport}</p>
                                        <p><strong>To:</strong> {data.destinationAirport}</p>
                                    </div>
                                </div>
                            </DataCard>
                        );
                    })}
                </div>
            </PageContainer>

            {/* Modal de Adição/Edição de Voos */}
            <FlightModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onFlightSaved={fetchAllData}
                flightToEdit={flightToEdit}
                allFlightTypes={allFlightTypes}
                allAircraftTypes={allAircraftTypes}
                allAirports={allAirports}
                allEmployees={allEmployees}
            />
        </div>
    );
};

export default AdminFlightsPage;

const loadingStyles: React.CSSProperties = {
    textAlign: 'center', paddingTop: '50px', fontSize: '18px',
    color: '#555',
};