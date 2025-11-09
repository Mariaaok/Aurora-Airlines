import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { API_BASE_URL } from '../config';

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const {
        searchData,
        departureFlight,
        departureSeats,
        returnFlight,
        returnSeats,
        passengerCount
    } = useBooking();

    if (!departureFlight || departureSeats.length === 0) {
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
                    <h1 style={styles.title}>Checkout & Passenger Details</h1>
                    
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>Booking Summary</h2>
                        
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Departure Flight</h3>
                            <p><strong>Flight:</strong> {departureFlight.flightNumber}</p>
                            <p><strong>Route:</strong> {departureFlight.originAirport.city} ({departureFlight.originAirport.IATA}) → {departureFlight.destinationAirport.city} ({departureFlight.destinationAirport.IATA})</p>
                            <p><strong>Departure:</strong> {departureFlight.departureDate} at {formatTime(departureFlight.departureTime)}</p>
                            <p><strong>Arrival:</strong> {departureFlight.arrivalDate} at {formatTime(departureFlight.arrivalTime)}</p>
                            <p><strong>Aircraft:</strong> {departureFlight.aircraftType.type}</p>
                            <p><strong>Seats:</strong> {departureSeats.join(', ')}</p>
                        </div>

                        {returnFlight && (
                            <div style={styles.section}>
                                <h3 style={styles.sectionTitle}>Return Flight</h3>
                                <p><strong>Flight:</strong> {returnFlight.flightNumber}</p>
                                <p><strong>Route:</strong> {returnFlight.originAirport.city} ({returnFlight.originAirport.IATA}) → {returnFlight.destinationAirport.city} ({returnFlight.destinationAirport.IATA})</p>
                                <p><strong>Departure:</strong> {returnFlight.departureDate} at {formatTime(returnFlight.departureTime)}</p>
                                <p><strong>Arrival:</strong> {returnFlight.arrivalDate} at {formatTime(returnFlight.arrivalTime)}</p>
                                <p><strong>Aircraft:</strong> {returnFlight.aircraftType.type}</p>
                                <p><strong>Seats:</strong> {returnSeats.join(', ')}</p>
                            </div>
                        )}

                        {!returnFlight && (
                            <div style={styles.section}>
                                <p style={styles.oneWayNotice}>One-way trip (no return flight selected)</p>
                            </div>
                        )}

                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Passengers</h3>
                            <p><strong>Number of passengers:</strong> {passengerCount}</p>
                            <p style={styles.notice}>
                                Passenger detail forms will appear here (one form per passenger).
                                Each passenger will need to provide their personal information.
                            </p>
                        </div>
                    </div>

                    <div style={styles.placeholder}>
                        <p>🚧 Passenger detail forms and payment integration will be implemented here</p>
                        <p>Each of the {passengerCount} passenger(s) will have a dedicated form to fill out their details.</p>
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
        maxWidth: '1000px',
        margin: '0 auto',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '2rem',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    cardTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#1f2937',
    },
    section: {
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#1e3a5f',
    },
    oneWayNotice: {
        fontStyle: 'italic',
        color: '#6b7280',
    },
    notice: {
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        color: '#6b7280',
        fontSize: '0.95rem',
    },
    placeholder: {
        backgroundColor: '#fef3c7',
        border: '2px dashed #f59e0b',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
        color: '#92400e',
    },
};

export default CheckoutPage;
