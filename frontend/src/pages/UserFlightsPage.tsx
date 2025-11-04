import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layouts/navbar';

// 1. CONSTANTES E INTERFACES (Seguindo seu padrão)
// Assumindo que a API de voos está neste endpoint
const API_URL = 'http://localhost:5000/userFlights'; 

// Interface para definir a estrutura de um voo, baseada na imagem
interface Flight {
  userFlightId: number; // Usado para a 'key' da lista
  seat: string;
  status: 'booked' | 'checked-in' | 'cancelled' | 'completed';
  flightNumber: string;
  duration: string;
  flightType: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  aircraftType: string;
  originCity: string;
  originIATA: string;
  destinationCity: string;
  destinationIATA: string;
}

interface FlightDetailModalProps {
    flight: Flight;
    onClose: () => void; // Função para fechar o modal
}

const FlightDetailModal: React.FC<FlightDetailModalProps> = ({ flight, onClose }) => {
    
    const dateParts = flight.departureDate.split('-'); // ex: ["05", "10", "2025"]
    const timeParts = flight.departureTime.split(':'); // ex: ["19", "35"]
    
    // new Date(ano, mêsIndexadoEmZero, dia, hora, minuto)
    const departureDateTime = new Date(
        parseInt(dateParts[0]),         // Ano: 2025
        parseInt(dateParts[1]) - 1,   // Mês: 10 precisa virar 9 (Outubro)
        parseInt(dateParts[2]),         // Dia: 05
        parseInt(timeParts[0]),         // Hora: 19
        parseInt(timeParts[1])          // Minuto: 35
    );

    // 2. Pegar a data e hora atuais
    const now = new Date();

    // 3. Calcular a diferença em milissegundos e depois em horas
    const diffMs = departureDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60); // (ms * seg * min)

    // 4. A condição final: O voo é cancelável se a diferença for maior que 24h
    const isCancellable = diffHours > 24;

    // Impede que o clique no conteúdo do modal feche o modal
    const handleModalContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    // Ação do botão (por enquanto, apenas fecha o modal)
    const handleCancelFlight = () => {
        alert(`Ação de cancelar o voo ${flight.flightNumber} ainda não implementada.`);
        // Aqui você poderia adicionar a lógica de API para cancelar
        onClose(); 
    };
    
    return (
        // O Overlay (fundo escuro) que fecha ao clicar
        <div style={styles.modalOverlay} onClick={onClose}>
            
            {/* O conteúdo do modal */}
            <div style={styles.modalContent} onClick={handleModalContentClick}>
                
                {/* Cabeçalho do Modal */}
                <div style={styles.modalHeader}>
                    <span style={styles.modalHeaderText}>
                        {flight.originCity} ({flight.departureDate})
                    </span>
                    <span style={styles.modalHeaderArrow}>→</span>
                    <span style={styles.modalHeaderText}>
                        {flight.destinationCity} ({flight.arrivalDate})
                    </span>
                </div>

                {/* Corpo do Modal (dividido em 2 colunas) */}
                <div style={styles.modalBody}>
                    {/* Coluna Esquerda */}
                    <div style={styles.modalColumn}>
                        <div style={styles.modalRow}>
                            <span style={styles.modalLabel}>Departure:</span>
                            <span style={styles.modalValue}>{flight.departureTime} {flight.originIATA}</span>
                        </div>
                        <div style={styles.modalRow}>
                            <span style={styles.modalLabel}>Flight duration:</span>
                            <span style={styles.modalValue}>{flight.duration}</span>
                        </div>
                        <div style={styles.modalRow}>
                            <span style={styles.modalLabel}>Aircraft:</span>
                            <span style={styles.modalValue}>{flight.aircraftType}</span>
                        </div>
                        <div style={styles.modalRow}>
                            <span style={styles.modalLabel}>Flight number:</span>
                            <span style={styles.modalValue}>{flight.flightNumber}</span>
                        </div>
                    </div>
                    
                    {/* Coluna Direita */}
                    <div style={styles.modalColumn}>
                        <div style={styles.modalRow}>
                            <span style={styles.modalLabel}>Estimated arrival:</span>
                            <span style={styles.modalValue}>{flight.arrivalTime} {flight.destinationIATA}</span>
                        </div>
                        <div style={styles.modalRow}>
                            <span style={styles.modalLabel}>Seats:</span>
                            <span style={styles.modalValue}>{flight.seat}</span>
                        </div>
                        <div style={styles.modalRow}>
                            <span style={styles.modalLabel}>Status:</span>
                            <span style={styles.modalValueStatus}>{flight.status}</span>
                        </div>
                    </div>
                </div>

                {/* Rodapé do Modal */}
                <div style={styles.modalFooter}>
                    {isCancellable ? (
                        <button style={styles.cancelButton} onClick={handleCancelFlight}>
                            Cancel flight
                        </button>
                    ) : (
                        <span style={styles.modalLabel}>
                            Cancellation is only available up to 24 hours before departure.
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

interface FlightCardProps {
    flight: Flight;
    onClick: (flight: Flight) => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, onClick }) => {

    return (
        <div style={styles.flightCardButton} onClick={() => onClick(flight)}>
            <div style={styles.flightRow}>
                {/* Seção de Partida */}
                <div style={styles.flightEndpoint}>
                    <span style={styles.flightCity}>{flight.originCity} ({flight.departureDate})</span>
                    <span style={styles.flightTime}>{flight.departureTime}</span>
                </div>

                <span style={styles.flightArrow}>→</span>

                {/* Seção de Chegada */}
                <div style={styles.flightEndpoint}>
                    <span style={styles.flightCity}>{flight.destinationCity} ({flight.arrivalDate})</span>
                    <span style={styles.flightTime}>{flight.arrivalTime}</span>
                </div>
            </div>
            <div style={styles.flightDetails}>
                <span>{flight.flightType} - Duration: {flight.duration}</span>
            </div>
        </div>
    );
};


// 3. COMPONENTE PRINCIPAL (UserFlightList)
const UserFlights: React.FC = () => {
    // State para voos, loading e mensagens (mesmo padrão)
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true); // Começa true para buscar dados
    const [message, setMessage] = useState('');
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

    // Lógica de busca de dados (Adaptado do seu handleSubmit)
    useEffect(() => {
        // Função async para buscar os dados
        const fetchFlights = async () => {
            setLoading(true);
            setMessage('');

            try {
                // Trocamos fetch 'POST' por 'GET'
                const response = await fetch(API_URL, {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data: Flight[] = await response.json();
                    setFlights(data);
                } else {
                    const errorData = await response.json();
                    setMessage(`Erro ao carregar voos: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Erro de rede:', error);
                setMessage('Erro de conexão com o servidor.');
            } finally {
                setLoading(false);
            }
        };

        fetchFlights(); // Executa a função ao carregar o componente
    }, []); // O array vazio [] garante que isso rode apenas uma vez

    const handleCardClick = (flight: Flight) => {
        setSelectedFlight(flight);
    };

    const handleCloseModal = () => {
        setSelectedFlight(null);
    };

    // Função para renderizar o conteúdo da lista
    const renderContent = () => {
        if (loading) {
            return <p>Carregando voos...</p>;
        }
        if (message) {
            // Reutiliza o estilo de mensagem do seu código
            return <p style={{ color: 'red' }}>{message}</p>;
        }
        if (flights.length === 0) {
            return <p>Nenhum voo encontrado.</p>;
        }
        
        // Mapeia os dados do state para o sub-componente FlightCard
        return flights.map(flight => (
            <FlightCard key={flight.userFlightId} flight={flight} onClick={handleCardClick}/>
        ));
    };

    return (
        <div style={styles.container}>
            <Navbar/>

            <div style={styles.mainContent}>
                <div style={styles.flightListContainer}>
                    <h2 style={styles.title}>Your flights:</h2>
                    
                    <div style={styles.listArea}>
                        {renderContent()}
                    </div>
                </div>
            </div>
            {selectedFlight && (
                <FlightDetailModal 
                    flight={selectedFlight} 
                    onClose={handleCloseModal} 
                />
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#00254A',
        color: 'white',
        padding: '10px 50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logoText: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginLeft: '10px',
    },
    signInButton: {
        backgroundColor: '#1E90FF', 
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '20px', 
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
    },
    registerLink: { 
        textDecoration: 'none',
    },
    mainContent: {
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px', 
    },

    flightListContainer: { 
        backgroundColor: 'transparent', 
        width: '100%',
        maxWidth: '700px', 
    },
    title: {
        color: '#00254A', 
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    listArea: {
        width: '100%',
    },
    
    flightCardButton: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #eee',
        width: '100%',
        cursor: 'pointer',
        textAlign: 'left', 
        fontFamily: 'inherit',
    },
    flightRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
    },
    flightEndpoint: {
        display: 'flex',
        flexDirection: 'column',
    },
    flightCity: {
        fontSize: '16px',
        color: '#333',
    },
    flightTime: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#00254A',
    },
    flightArrow: {
        fontSize: '24px',
        color: '#00254A',
        margin: '0 20px',
    },
    flightDetails: {
        fontSize: '14px',
        color: '#555',
        borderTop: '1px solid #f0f0f0',
        paddingTop: '12px',
        marginTop: '12px',
    },

    //MODAL STYLES
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '100%',
        maxWidth: '550px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        paddingBottom: '16px',
        marginBottom: '16px',
    },
    modalHeaderText: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#00254A',
    },
    modalHeaderArrow: {
        fontSize: '20px',
        color: '#00254A',
    },
    modalBody: {
        display: 'flex',
        flexDirection: 'row',
        gap: '24px', // Espaço entre as colunas
    },
    modalColumn: {
        flex: 1, // Faz as colunas dividirem o espaço
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    modalRow: {
        display: 'flex',
        flexDirection: 'column',
    },
    modalLabel: {
        fontSize: '14px',
        color: '#555',
        marginBottom: '2px',
    },
    modalValue: {
        fontSize: '16px',
        fontWeight: '500',
        color: '#111',
    },
    modalValueStatus: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#00254A',
        textTransform: 'capitalize', // Deixa 'booked' com 'B' maiúsculo
    },
    modalFooter: {
        borderTop: '1px solid #eee',
        paddingTop: '16px',
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'flex-end', // Alinha o botão à direita
    },
    cancelButton: {
        backgroundColor: '#d9534f', // Vermelho
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
    },
};

export default UserFlights;