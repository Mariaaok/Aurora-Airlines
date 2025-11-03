import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  departureTime: string;
  arrivalTime: string;
  aircraftType: string;
  originCity: string;
  originIATA: string;
  destinationCity: string;
  destinationIATA: string;
}

// 2. SUB-COMPONENTE (Seguindo seu padrão de criar 'InputField')
// Criei um 'FlightCard' para reutilizar na lista
const formatFlightTime = (isoString: string) => {
  const date = new Date(isoString);
  
  // Ajusta para o fuso horário local (importante!)
  const dateStr = date.toLocaleDateString(undefined, { 
    day: '2-digit', 
    month: '2-digit' 
  });
  
  const timeStr = date.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return { date: dateStr, time: timeStr };
}


interface FlightCardProps {
    flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
    const departure = formatFlightTime(flight.departureTime);
    const arrival = formatFlightTime(flight.arrivalTime);

    return (
        <div style={styles.flightCard}>
            <div style={styles.flightRow}>
                {/* Seção de Partida */}
                <div style={styles.flightEndpoint}>
                    <span style={styles.flightCity}>{flight.originCity} ({departure.date})</span>
                    <span style={styles.flightTime}>{departure.time}</span>
                </div>

                <span style={styles.flightArrow}>→</span>

                {/* Seção de Chegada */}
                <div style={styles.flightEndpoint}>
                    <span style={styles.flightCity}>{flight.destinationCity} ({arrival.date})</span>
                    <span style={styles.flightTime}>{arrival.time}</span>
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
            <FlightCard key={flight.userFlightId} flight={flight} />
        ));
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.logoContainer}>
                    <span style={styles.logoText}>AURORA AIRLINES</span>
                </div>
                <Link to="/" style={styles.registerLink}>
                    <button style={styles.signInButton}>Sign in</button>
                </Link>
            </div>

            <div style={styles.mainContent}>
                <div style={styles.flightListContainer}>
                    <h2 style={styles.title}>Your flights:</h2>
                    
                    <div style={styles.listArea}>
                        {renderContent()}
                    </div>
                </div>
            </div>
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
    
    flightCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #eee',
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
};

export default UserFlights;