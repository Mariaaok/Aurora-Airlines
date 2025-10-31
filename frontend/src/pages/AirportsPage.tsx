import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AirportCard from '../components/airportCard';
import AirportModal from '../components/airportModal';
import { API_BASE_URL, Airport } from '../airports.constants';
import Navbar from "../components/layouts/navbar"; 
import PageContainer from "../components/layouts/pageContainer"; 
import SectionHeader from "../components/layouts/sectionHeader";
import { AdminTabs } from "../components/layouts/adminTabs"; 

const AirportsPage: React.FC = () => {
    const [airports, setAirports] = useState<Airport[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [airportToEdit, setAirportToEdit] = useState<Airport | null>(null);

    const fetchAirports = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<Airport[]>(API_BASE_URL); 
            setAirports(response.data);
        } catch (error) {
            console.error('Erro ao buscar aeroportos:', error);
            alert('Erro ao carregar a lista de aeroportos.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAirports();
    }, []);

    const handleAdd = () => {
        setAirportToEdit(null); 
        setIsModalOpen(true);
    };

    const handleEdit = (airport: Airport) => {
        setAirportToEdit(airport);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Tem certeza que deseja deletar o aeroporto ${name}?`)) {
            return;
        }
        try {
            await axios.delete(`${API_BASE_URL}/${id}`); 
            alert(`Aeroporto ${name} deletado com sucesso!`);
            fetchAirports(); 
        } catch (error) {
            console.error('Erro ao deletar aeroporto:', error);
            alert('Erro ao deletar aeroporto. Verifique o console.');
        }
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAirportToEdit(null);
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div style={pageStyles.loading}>Carregando aeroportos...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <AdminTabs /> 
            <PageContainer> 
                
                <SectionHeader
                    title="Airports"
                    buttonText="Add new airport"
                    onButtonClick={handleAdd}
                />
                <div style={listContainerStyles}>
                    {airports.length === 0 ? (
                        <p>Nenhum aeroporto cadastrado.</p>
                    ) : (
                        airports.map(airport => (
                            <AirportCard
                                key={airport.id}
                                airport={airport}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>

                <AirportModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onAirportSaved={fetchAirports}
                    airportToEdit={airportToEdit}
                />
            </PageContainer>
        </div>
    );
};

export default AirportsPage;

const listContainerStyles: React.CSSProperties = {
    display: 'flex', 
    flexDirection: 'column', 
    gap: '10px',
};

const pageStyles: any = {
    loading: {
        textAlign: 'center', paddingTop: '50px', fontSize: '18px',
        color: '#555',
    }
};