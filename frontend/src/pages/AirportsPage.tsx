import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AirportCard from '../components/airportCard';
import AirportModal from '../components/airportModal';
import { API_BASE_URL, Airport } from '../airports.constants';

const AirportsPage: React.FC = () => {
    const [airports, setAirports] = useState<Airport[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [airportToEdit, setAirportToEdit] = useState<Airport | null>(null);

    // Função para buscar a lista de aeroportos (GET /airports)
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

    // Lida com a abertura do modal de adição
    const handleAdd = () => {
        setAirportToEdit(null); // Garante que é modo de adição
        setIsModalOpen(true);
    };

    // Lida com a abertura do modal de edição
    const handleEdit = (airport: Airport) => {
        setAirportToEdit(airport);
        setIsModalOpen(true);
    };

    // Lida com a exclusão (DELETE /airports/:id)
    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Tem certeza que deseja deletar o aeroporto ${name}?`)) {
            return;
        }
        try {
            await axios.delete(`${API_BASE_URL}/${id}`); // Endpoint DELETE
            alert(`Aeroporto ${name} deletado com sucesso!`);
            fetchAirports(); // Recarrega a lista
        } catch (error) {
            console.error('Erro ao deletar aeroporto:', error);
            alert('Erro ao deletar aeroporto. Verifique o console.');
        }
    };
    
    // Função para fechar o modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAirportToEdit(null);
    };


    if (isLoading) {
        return <div style={pageStyles.loading}>Carregando aeroportos...</div>;
    }

    return (
        <div style={pageStyles.container}>
            
            <div style={pageStyles.header}>
                <h1 style={pageStyles.title}>Airports</h1>
                <button
                    onClick={handleAdd}
                    style={pageStyles.addButton}
                >
                    Add new airport
                </button>
            </div>

            {/* Listagem de Aeroportos */}
            <div style={pageStyles.listContainer}>
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

            {/* Modal de Adição/Atualização */}
            <AirportModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAirportSaved={fetchAirports}
                airportToEdit={airportToEdit}
            />
        </div>
    );
};

export default AirportsPage;

// Estilos básicos
const pageStyles: any = {
    container: {
        padding: '20px', maxWidth: '1000px', margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderBottom: '2px solid #eee',
        paddingBottom: '15px', marginBottom: '20px',
    },
    title: {
        color: '#003366', fontSize: '28px', margin: 0,
    },
    addButton: {
        backgroundColor: '#003366', color: 'white', padding: '10px 15px',
        border: 'none', borderRadius: '5px', cursor: 'pointer',
        fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    listContainer: {
        display: 'flex', flexDirection: 'column', gap: '10px',
    },
    loading: {
        textAlign: 'center', paddingTop: '50px', fontSize: '18px',
        color: '#555',
    }
};