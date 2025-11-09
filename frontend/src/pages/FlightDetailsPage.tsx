import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { API_BASE_URL } from '../config';
import { Flight } from '../flights.constants';
import SeatSelectorModal from '../components/SeatSelectorModal';

interface LocationState {
    flight: Flight;
    searchData: {
        from: string;
        to: string;
        departureDate: string;
        returnDate: string;
    };
    isReturn: boolean;
}

const FlightDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { 
        searchData: bookingSearchData,
        setDepartureFlight,
        setDepartureSeats,
        setReturnFlight,
        setReturnSeats,
        departureSeats: savedDepartureSeats,
        returnSeats: savedReturnSeats
    } = useBooking();
    const state = location.state as LocationState;

    const flight = state?.flight;
    const searchData = state?.searchData || bookingSearchData;
    const isReturn = state?.isReturn || false;

    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    useEffect(() => {
        if (isReturn && savedReturnSeats.length > 0) {
            setSelectedSeats(savedReturnSeats);
        } else if (!isReturn && savedDepartureSeats.length > 0) {
            setSelectedSeats(savedDepartureSeats);
        }
    }, [isReturn, savedDepartureSeats, savedReturnSeats]);
    const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);

    if (!flight) {
        navigate('/search-flights');
        return null;
    }

    const handleSignOut = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            
            if (response.ok) {
                logout();
                navigate('/', { replace: true });
            }
        } catch (error) {
            console.error('Error logging out:', error);
            logout();
            navigate('/', { replace: true });
        }
    };

    const handleSeatToggle = (seatId: string) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(s => s !== seatId);
            } else {
                return [...prev, seatId];
            }
        });
    };

    const handleContinue = async () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat before continuing.');
            return;
        }

        if (!searchData) {
            alert('Search data is missing. Please start over.');
            navigate('/search-flights');
            return;
        }

        if (isReturn) {
            setReturnFlight(flight);
            setReturnSeats(selectedSeats);
            
            console.log('Return flight and seats selected!');
            navigate('/passenger-info');
        } else {
            setDepartureFlight(flight);
            setDepartureSeats(selectedSeats);
            
            try {
                const returnSearchData = {
                    from: searchData.to,
                    to: searchData.from,
                    departureDate: searchData.returnDate,
                    returnDate: searchData.returnDate
                };

                const response = await fetch(`${API_BASE_URL}/flights/search`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(returnSearchData),
                    credentials: 'include',
                });

                if (response.ok) {
                    const results = await response.json();
                    navigate('/flight-results', { 
                        state: { 
                            results, 
                            searchData: searchData,
                            isReturn: true
                        } 
                    });
                } else {
                    console.error('Return flight search failed');
                    alert('Failed to search for return flights. Please try again.');
                }
            } catch (error) {
                console.error('Error searching for return flights:', error);
                alert('Error searching for return flights. Please try again.');
            }
        }
    };

    const formatTime = (time: string) => {
        return time.substring(0, 5);
    };

    const aircraftTypeData = {
        type: flight.aircraftType.type,
        layoutData: flight.aircraftType.layoutData
    };

    return (
        <div style={styles.pageContainer}>
            <nav style={styles.navbar}>
                <div style={styles.logoContainer}>
                    <img src="/logo-branca.png" alt="Aurora Airlines" style={styles.logo} />
                </div>
                <button onClick={handleSignOut} style={styles.signOutButton}>
                    Sign out
                </button>
            </nav>

            <div style={styles.mainContent}>
                <div style={styles.contentContainer}>
                    <button onClick={() => navigate(-1)} style={styles.backButton}>
                        ← Go back to the results
                    </button>

                    <div style={styles.flightRoute}>
                        <div style={styles.routeItem}>
                            <span style={styles.planeIcon}>✈</span>
                            <span style={styles.label}>From:</span>
                            <span style={styles.city}>{flight.originAirport.city}</span>
                        </div>
                        <div style={styles.routeItem}>
                            <span style={styles.personIcon}>👤</span>
                            <span style={styles.label}>To:</span>
                            <span style={styles.city}>{flight.destinationAirport.city}</span>
                        </div>
                    </div>

                    <button onClick={() => navigate('/search-flights')} style={styles.searchAnotherLink}>
                        Search for another flight
                    </button>

                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>Trip summary:</h2>
                        
                        <div style={styles.summaryGrid}>
                            <div style={styles.summaryItem}>
                                <span style={styles.summaryLabel}>Departure:</span>
                                <span style={styles.summaryValue}>
                                    {formatTime(flight.departureTime)} {flight.originAirport.IATA}
                                </span>
                            </div>
                            
                            <div style={styles.summaryItem}>
                                <span style={styles.summaryLabel}>Estimated arrival:</span>
                                <span style={styles.summaryValue}>
                                    {formatTime(flight.arrivalTime)} {flight.destinationAirport.IATA}
                                </span>
                            </div>
                            
                            <div style={styles.summaryItem}>
                                <span style={styles.summaryLabel}>Flight duration:</span>
                                <span style={styles.summaryValue}>{flight.estimatedDuration}</span>
                            </div>
                            
                            <div style={styles.summaryItem}>
                                <span style={styles.summaryLabel}>Aircraft:</span>
                                <span style={styles.summaryValue}>{flight.aircraftType.type}</span>
                            </div>
                            
                            <div style={styles.summaryItemFull}>
                                <span style={styles.summaryLabel}>Flight number:</span>
                                <span style={styles.summaryValue}>{flight.flightNumber}</span>
                            </div>
                        </div>
                    </div>

                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>Seats:</h2>
                        
                        <div style={styles.seatsContent}>
                            <div style={styles.seatsDisplay}>
                                <span style={styles.seatsLabel}>Seats:</span>
                                <span style={styles.seatsValue}>
                                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
                                </span>
                            </div>
                            
                            <button 
                                onClick={() => setIsSeatModalOpen(true)} 
                                style={styles.chooseSeatsButton}
                            >
                                Choose your seats
                            </button>
                        </div>
                    </div>

                    <div style={styles.continueContainer}>
                        <button onClick={handleContinue} style={styles.continueButton}>
                            Continue
                        </button>
                    </div>
                </div>
            </div>

            <SeatSelectorModal
                isOpen={isSeatModalOpen}
                onClose={() => setIsSeatModalOpen(false)}
                aircraftTypeData={aircraftTypeData}
                selectedSeats={selectedSeats}
                onSeatToggle={handleSeatToggle}
            />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    pageContainer: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#e5e7eb',
    },
    navbar: {
        backgroundColor: '#1e3a5f',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        height: '50px',
        width: 'auto',
    },
    signOutButton: {
        backgroundColor: '#34d399',
        color: 'white',
        border: 'none',
        padding: '0.75rem 2rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    mainContent: {
        flex: 1,
        padding: '2rem',
    },
    contentContainer: {
        maxWidth: '800px',
        margin: '0 auto',
    },
    backButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#1f2937',
        fontSize: '0.95rem',
        cursor: 'pointer',
        marginBottom: '1.5rem',
        padding: '0.5rem 0',
    },
    flightRoute: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-around',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    routeItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    planeIcon: {
        fontSize: '1.25rem',
    },
    personIcon: {
        fontSize: '1.25rem',
    },
    label: {
        fontSize: '0.95rem',
        color: '#6b7280',
    },
    city: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#1f2937',
    },
    searchAnotherLink: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#1f2937',
        fontSize: '0.95rem',
        cursor: 'pointer',
        marginBottom: '2rem',
        padding: '0',
        textDecoration: 'underline',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    cardTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#1f2937',
    },
    summaryGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
    },
    summaryItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    summaryItemFull: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        gridColumn: 'span 2',
    },
    summaryLabel: {
        fontSize: '0.95rem',
        color: '#6b7280',
    },
    summaryValue: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#1f2937',
    },
    seatsContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    seatsDisplay: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    seatsLabel: {
        fontSize: '0.95rem',
        color: '#6b7280',
    },
    seatsValue: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#1f2937',
    },
    chooseSeatsButton: {
        backgroundColor: '#0e7490',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    continueContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2rem',
    },
    continueButton: {
        backgroundColor: '#0e7490',
        color: 'white',
        border: 'none',
        padding: '1rem 3rem',
        borderRadius: '8px',
        fontSize: '1.125rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(14, 116, 144, 0.3)',
    },
};

export default FlightDetailsPage;
