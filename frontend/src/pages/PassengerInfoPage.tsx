import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking, PassengerData } from '../contexts/BookingContext';
import { API_BASE_URL } from '../config';

const PassengerInfoPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const {
        departureFlight,
        departureSeats,
        returnFlight,
        returnSeats,
        passengerCount,
        setPassengers: savePassengersToContext
    } = useBooking();

    if (!departureFlight || departureSeats.length === 0) {
        navigate('/search-flights');
        return null;
    }

    const initialPassengerData: PassengerData = {
        fullName: '',
        birthday: '',
        phoneNumber: '',
        cpf: '',
        email: '',
        rg: ''
    };

    const [passengers, setPassengers] = useState<PassengerData[]>(
        Array(passengerCount).fill(null).map(() => ({ ...initialPassengerData }))
    );

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

    const handlePassengerChange = (index: number, field: keyof PassengerData, value: string) => {
        const updatedPassengers = [...passengers];
        updatedPassengers[index] = {
            ...updatedPassengers[index],
            [field]: value
        };
        setPassengers(updatedPassengers);
    };

    const calculatePrice = () => {
        const basePrice = 350;
        const internationalMultiplier = departureFlight.flightType.name.toLowerCase().includes('international') ? 2 : 1;
        
        let total = basePrice * internationalMultiplier * passengerCount;
        
        if (returnFlight) {
            const returnInternational = returnFlight.flightType.name.toLowerCase().includes('international') ? 2 : 1;
            total += basePrice * returnInternational * passengerCount;
        }
        
        return total.toFixed(2);
    };

    const handleGoToCheckout = () => {
        savePassengersToContext(passengers);
        navigate('/checkout');
    };

    const finalPrice = calculatePrice();

    const renderPassengerForm = (passenger: PassengerData, index: number, section: 'departure' | 'return') => (
        <div key={`${section}-${index}`} style={styles.passengerCard}>
            <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Full name</label>
                    <input
                        type="text"
                        value={passenger.fullName}
                        onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value)}
                        placeholder="Name and surname"
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Birthday</label>
                    <input
                        type="text"
                        value={passenger.birthday}
                        onChange={(e) => handlePassengerChange(index, 'birthday', e.target.value)}
                        placeholder="yyyy-mm-dd"
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Phone number</label>
                    <input
                        type="text"
                        value={passenger.phoneNumber}
                        onChange={(e) => handlePassengerChange(index, 'phoneNumber', e.target.value)}
                        placeholder="With country code"
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>CPF</label>
                    <input
                        type="text"
                        value={passenger.cpf}
                        onChange={(e) => handlePassengerChange(index, 'cpf', e.target.value)}
                        placeholder="Numbers only"
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>E-mail</label>
                    <input
                        type="email"
                        value={passenger.email}
                        onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                        placeholder="example@email.com"
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>RG</label>
                    <input
                        type="text"
                        value={passenger.rg}
                        onChange={(e) => handlePassengerChange(index, 'rg', e.target.value)}
                        placeholder="Numbers only"
                        style={styles.input}
                    />
                </div>
            </div>
        </div>
    );

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
                    <h1 style={styles.title}>Passengers</h1>
                    
                    <div style={styles.scrollContainer}>
                        <div style={styles.flightSection}>
                            <h2 style={styles.flightSectionTitle}>Departure Flight</h2>
                            {passengers.map((passenger, index) => 
                                renderPassengerForm(passenger, index, 'departure')
                            )}
                        </div>

                        {returnFlight && (
                            <div style={styles.flightSection}>
                                <h2 style={styles.flightSectionTitle}>Return Flight</h2>
                                {passengers.map((passenger, index) => 
                                    renderPassengerForm(passenger, index, 'return')
                                )}
                            </div>
                        )}
                    </div>

                    <div style={styles.priceCard}>
                        <h2 style={styles.priceTitle}>Price:</h2>
                        <div style={styles.priceRow}>
                            <span style={styles.priceLabel}>{passengerCount} passenger{passengerCount > 1 ? 's' : ''}</span>
                            <span style={styles.priceValue}>{finalPrice} USD</span>
                        </div>
                    </div>

                    <div style={styles.buttonContainer}>
                        <button onClick={handleGoToCheckout} style={styles.checkoutButton}>
                            Go to checkout
                        </button>
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    contentContainer: {
        width: '100%',
        maxWidth: '700px',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '1.5rem',
    },
    scrollContainer: {
        maxHeight: '400px',
        overflowY: 'auto',
        marginBottom: '1.5rem',
        paddingRight: '0.5rem',
    },
    passengerCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.875rem',
        color: '#374151',
        fontWeight: '500',
    },
    input: {
        padding: '0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '0.875rem',
        outline: 'none',
    },
    priceCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    priceTitle: {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '1rem',
    },
    priceRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: '0.875rem',
        color: '#1f2937',
    },
    priceValue: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#1f2937',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    checkoutButton: {
        backgroundColor: '#1e88e5',
        color: 'white',
        border: 'none',
        padding: '0.875rem 3rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    flightSection: {
        marginBottom: '2rem',
    },
    flightSectionTitle: {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: '#1e3a5f',
        marginBottom: '1rem',
        paddingLeft: '0.5rem',
    },
};

export default PassengerInfoPage;
