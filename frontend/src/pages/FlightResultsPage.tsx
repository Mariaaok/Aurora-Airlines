import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { API_BASE_URL } from '../config';
import { Flight } from '../flights.constants';

interface LocationState {
    results: Flight[];
    searchData: {
        from: string;
        to: string;
        departureDate: string;
        returnDate: string;
    };
    isReturn: boolean;
}

const FlightResultsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { searchData: bookingSearchData } = useBooking();
    const state = location.state as LocationState;

    const results = state?.results || [];
    const searchData = state?.searchData || bookingSearchData;
    const isReturn = state?.isReturn || false;

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

    const handleFlightClick = (flight: Flight) => {
        navigate('/flight-details', { 
            state: { 
                flight, 
                searchData,
                isReturn
            } 
        });
    };

    const handleBackToSearch = () => {
        navigate('/search-flights');
    };

    const handleSkipReturn = () => {
        console.log('Skipping return flight and proceeding to passenger info');
        navigate('/passenger-info');
    };

    const formatTime = (time: string) => {
        return time.substring(0, 5);
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
                    {!isReturn && (
                        <button onClick={handleBackToSearch} style={styles.backButton}>
                            ← Go back to search
                        </button>
                    )}

                    {isReturn && searchData && (
                        <div style={styles.routeDisplay}>
                            <div style={styles.routeItem}>
                                <span style={styles.planeIcon}>✈</span>
                                <span style={styles.label}>From:</span>
                                <span style={styles.city}>{searchData.to}</span>
                            </div>
                            <div style={styles.routeItem}>
                                <span style={styles.personIcon}>👤</span>
                                <span style={styles.label}>To:</span>
                                <span style={styles.city}>{searchData.from}</span>
                            </div>
                        </div>
                    )}

                    {isReturn && (
                        <button onClick={handleBackToSearch} style={styles.searchAnotherLink}>
                            Search for another flight
                        </button>
                    )}

                    <h1 style={styles.title}>
                        {isReturn 
                            ? 'Choose your return flight:' 
                            : `Available departure flights from ${searchData?.from} to ${searchData?.to}`
                        }
                    </h1>

                    <div style={styles.resultsContainer}>
                        {results.length === 0 ? (
                            <div style={styles.noResults}>
                                <p>No flights found for your search criteria.</p>
                                <button onClick={handleBackToSearch} style={styles.searchAgainButton}>
                                    Search again
                                </button>
                            </div>
                        ) : (
                            results.map((flight) => (
                                <div 
                                    key={flight.id} 
                                    style={styles.flightCard}
                                    onClick={() => handleFlightClick(flight)}
                                >
                                    <div style={styles.flightHeader}>
                                        <span style={styles.flightNumber}>Flight {flight.flightNumber}</span>
                                        <span style={styles.aircraftType}>{flight.aircraftType.type}</span>
                                    </div>
                                    
                                    <div style={styles.flightRoute}>
                                        <div style={styles.routePoint}>
                                            <div style={styles.airportCode}>{flight.originAirport.IATA}</div>
                                            <div style={styles.time}>{formatTime(flight.departureTime)}</div>
                                            <div style={styles.cityName}>{flight.originAirport.city}</div>
                                        </div>
                                        
                                        <div style={styles.routeLine}>
                                            <div style={styles.duration}>{flight.estimatedDuration}</div>
                                            <div style={styles.arrow}>→</div>
                                        </div>
                                        
                                        <div style={styles.routePoint}>
                                            <div style={styles.airportCode}>{flight.destinationAirport.IATA}</div>
                                            <div style={styles.time}>{formatTime(flight.arrivalTime)}</div>
                                            <div style={styles.cityName}>{flight.destinationAirport.city}</div>
                                        </div>
                                    </div>

                                    <div style={styles.flightFooter}>
                                        <span style={styles.flightType}>{flight.flightType.name}</span>
                                        <span style={styles.date}>{flight.departureDate}</span>
                                        <span style={styles.selectButton}>Select →</span>
                                    </div>
                                </div>
                            ))
                        )}
                        
                        {isReturn && (
                            <div style={styles.skipReturnContainer}>
                                <button onClick={handleSkipReturn} style={styles.skipReturnButton}>
                                    Skip return flight and proceed to checkout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    pageContainer: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f3f4f6',
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
        height: '80px',
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
        transition: 'background-color 0.3s',
    },
    mainContent: {
        flex: 1,
        padding: '2rem',
    },
    contentContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    backButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#1e3a5f',
        fontSize: '1rem',
        cursor: 'pointer',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem',
    },
    title: {
        fontSize: '1.875rem',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '2rem',
    },
    resultsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    flightCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    flightHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #e5e7eb',
    },
    flightNumber: {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: '#1e3a5f',
    },
    aircraftType: {
        fontSize: '0.875rem',
        color: '#6b7280',
    },
    flightRoute: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    routePoint: {
        flex: 1,
        textAlign: 'center',
    },
    airportCode: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#1e3a5f',
    },
    time: {
        fontSize: '1.125rem',
        color: '#4b5563',
        marginTop: '0.25rem',
    },
    cityName: {
        fontSize: '0.875rem',
        color: '#6b7280',
        marginTop: '0.25rem',
    },
    routeLine: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    duration: {
        fontSize: '0.875rem',
        color: '#6b7280',
        marginBottom: '0.5rem',
    },
    arrow: {
        fontSize: '1.5rem',
        color: '#0e7490',
    },
    flightFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb',
    },
    date: {
        fontSize: '0.875rem',
        color: '#6b7280',
    },
    selectButton: {
        color: '#0e7490',
        fontWeight: '600',
        fontSize: '0.875rem',
    },
    noResults: {
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '12px',
    },
    searchAgainButton: {
        backgroundColor: '#0e7490',
        color: 'white',
        border: 'none',
        padding: '0.75rem 2rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '1rem',
    },
    routeDisplay: {
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
        marginBottom: '1.5rem',
        padding: '0',
        textDecoration: 'underline',
    },
    flightType: {
        fontSize: '0.875rem',
        color: '#6b7280',
    },
    skipReturnContainer: {
        textAlign: 'center',
        marginTop: '2rem',
        paddingTop: '2rem',
        borderTop: '2px solid #e5e7eb',
    },
    skipReturnButton: {
        backgroundColor: 'transparent',
        color: '#dc2626',
        border: 'none',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'underline',
        padding: '0.5rem 1rem',
    },
};

export default FlightResultsPage;
