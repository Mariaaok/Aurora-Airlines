import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { API_BASE_URL } from '../config';

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const {
        departureFlight,
        departureSeats,
        returnFlight,
        returnSeats,
        passengerCount
    } = useBooking();

    const [cardNumber, setCardNumber] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [securityNumber, setSecurityNumber] = useState('');
    const [installments, setInstallments] = useState('1');
    const [paymentType, setPaymentType] = useState<'debit' | 'credit'>('credit');
    const [errors, setErrors] = useState<{[key: string]: string}>({});

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

    const formatDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}`;
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

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!cardNumber) {
            newErrors.cardNumber = 'Card number is required';
        } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'Card number must be 16 digits';
        }

        if (!nameOnCard) {
            newErrors.nameOnCard = 'Name on card is required';
        } else if (!/^[a-zA-Z\s]+$/.test(nameOnCard)) {
            newErrors.nameOnCard = 'Name must contain only letters';
        }

        if (!expirationDate) {
            newErrors.expirationDate = 'Expiration date is required';
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
            newErrors.expirationDate = 'Format must be MM/YY';
        }

        if (!securityNumber) {
            newErrors.securityNumber = 'Security number is required';
        } else if (!/^\d{3,4}$/.test(securityNumber)) {
            newErrors.securityNumber = 'Security number must be 3-4 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCardNumberChange = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 16) {
            const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
            setCardNumber(formatted);
        }
    };

    const handleExpirationDateChange = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 4) {
            if (cleaned.length >= 2) {
                setExpirationDate(cleaned.substring(0, 2) + '/' + cleaned.substring(2));
            } else {
                setExpirationDate(cleaned);
            }
        }
    };

    const handleSecurityNumberChange = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 4) {
            setSecurityNumber(cleaned);
        }
    };

    const handleConfirm = () => {
        if (validateForm()) {
            console.log('Payment confirmed!');
            alert('Booking confirmed! (Backend integration pending)');
        }
    };

    const finalPrice = calculatePrice();

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
                    <div style={styles.card}>
                        <h2 style={styles.sectionTitle}>Details:</h2>
                        
                        <div style={styles.flightDetails}>
                            <div style={styles.routeInfo}>
                                <div style={styles.routeSection}>
                                    <span style={styles.cityDate}>
                                        {departureFlight.originAirport.city} ({formatDate(departureFlight.departureDate)})
                                    </span>
                                    <span style={styles.time}>{formatTime(departureFlight.departureTime)}</span>
                                </div>
                                
                                <span style={styles.arrow}>→</span>
                                
                                <div style={styles.routeSection}>
                                    <span style={styles.cityDate}>
                                        {departureFlight.destinationAirport.city} ({formatDate(departureFlight.arrivalDate)})
                                    </span>
                                    <span style={styles.time}>{formatTime(departureFlight.arrivalTime)}</span>
                                </div>
                            </div>
                            
                            <div style={styles.flightInfo}>
                                {departureFlight.flightType.name} - Duration: {departureFlight.estimatedDuration}
                            </div>
                            
                            {returnFlight && (
                                <>
                                    <div style={styles.routeInfo}>
                                        <div style={styles.routeSection}>
                                            <span style={styles.cityDate}>
                                                {returnFlight.originAirport.city} ({formatDate(returnFlight.departureDate)})
                                            </span>
                                            <span style={styles.time}>{formatTime(returnFlight.departureTime)}</span>
                                        </div>
                                        
                                        <span style={styles.arrow}>→</span>
                                        
                                        <div style={styles.routeSection}>
                                            <span style={styles.cityDate}>
                                                {returnFlight.destinationAirport.city} ({formatDate(returnFlight.arrivalDate)})
                                            </span>
                                            <span style={styles.time}>{formatTime(returnFlight.arrivalTime)}</span>
                                        </div>
                                    </div>
                                    
                                    <div style={styles.flightInfo}>
                                        {returnFlight.flightType.name} - Duration: {returnFlight.estimatedDuration}
                                    </div>
                                </>
                            )}
                            
                            <div style={styles.passengers}>
                                {passengerCount} passenger{passengerCount > 1 ? 's' : ''}
                            </div>
                        </div>

                        <div style={styles.priceSection}>
                            <span style={styles.priceLabel}>Final Price</span>
                            <span style={styles.priceValue}>{finalPrice} USD</span>
                        </div>

                        <div style={styles.paymentSection}>
                            <h3 style={styles.paymentTitle}>Payment method:</h3>
                            
                            <div style={styles.paymentMethodLabel}>
                                Credit/debit card
                            </div>

                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Card number</label>
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => handleCardNumberChange(e.target.value)}
                                        placeholder="1234 5678 9012 3456"
                                        style={{
                                            ...styles.input,
                                            ...(errors.cardNumber ? styles.inputError : {})
                                        }}
                                    />
                                    {errors.cardNumber && <span style={styles.errorText}>{errors.cardNumber}</span>}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Name on card</label>
                                    <input
                                        type="text"
                                        value={nameOnCard}
                                        onChange={(e) => setNameOnCard(e.target.value)}
                                        placeholder="John Doe"
                                        style={{
                                            ...styles.input,
                                            ...(errors.nameOnCard ? styles.inputError : {})
                                        }}
                                    />
                                    {errors.nameOnCard && <span style={styles.errorText}>{errors.nameOnCard}</span>}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Expiration date</label>
                                    <input
                                        type="text"
                                        value={expirationDate}
                                        onChange={(e) => handleExpirationDateChange(e.target.value)}
                                        placeholder="MM/YY"
                                        style={{
                                            ...styles.input,
                                            ...(errors.expirationDate ? styles.inputError : {})
                                        }}
                                    />
                                    {errors.expirationDate && <span style={styles.errorText}>{errors.expirationDate}</span>}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Security number</label>
                                    <input
                                        type="text"
                                        value={securityNumber}
                                        onChange={(e) => handleSecurityNumberChange(e.target.value)}
                                        placeholder="123"
                                        style={{
                                            ...styles.input,
                                            ...(errors.securityNumber ? styles.inputError : {})
                                        }}
                                    />
                                    {errors.securityNumber && <span style={styles.errorText}>{errors.securityNumber}</span>}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Installments</label>
                                    <select
                                        value={installments}
                                        onChange={(e) => setInstallments(e.target.value)}
                                        style={styles.select}
                                    >
                                        <option value="1">1x of {finalPrice} USD</option>
                                        <option value="2">2x of {(parseFloat(finalPrice) / 2).toFixed(2)} USD</option>
                                        <option value="3">3x of {(parseFloat(finalPrice) / 3).toFixed(2)} USD</option>
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <div style={styles.radioGroup}>
                                        <label style={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                value="debit"
                                                checked={paymentType === 'debit'}
                                                onChange={() => setPaymentType('debit')}
                                                style={styles.radio}
                                            />
                                            Debit
                                        </label>
                                        <label style={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                value="credit"
                                                checked={paymentType === 'credit'}
                                                onChange={() => setPaymentType('credit')}
                                                style={styles.radio}
                                            />
                                            Credit
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.buttonContainer}>
                        <button onClick={handleConfirm} style={styles.confirmButton}>
                            Confirm
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
        maxWidth: '600px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#1f2937',
    },
    flightDetails: {
        marginBottom: '1.5rem',
    },
    routeInfo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.5rem',
    },
    routeSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    cityDate: {
        fontSize: '0.875rem',
        color: '#1f2937',
    },
    time: {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: '#1f2937',
    },
    arrow: {
        fontSize: '1.5rem',
        color: '#6b7280',
    },
    flightInfo: {
        fontSize: '0.875rem',
        color: '#6b7280',
        marginBottom: '1rem',
    },
    passengers: {
        fontSize: '0.875rem',
        color: '#1f2937',
        marginTop: '0.5rem',
    },
    priceSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb',
        marginBottom: '2rem',
    },
    priceLabel: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#1f2937',
    },
    priceValue: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#1f2937',
    },
    paymentSection: {
        marginTop: '2rem',
    },
    paymentTitle: {
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#1f2937',
    },
    paymentMethodLabel: {
        fontSize: '0.875rem',
        color: '#6b7280',
        marginBottom: '1.5rem',
        textAlign: 'center',
        padding: '0.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
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
    inputError: {
        borderColor: '#ef4444',
    },
    select: {
        padding: '0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '0.875rem',
        outline: 'none',
        backgroundColor: 'white',
        cursor: 'pointer',
    },
    radioGroup: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        paddingTop: '1.75rem',
    },
    radioLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        color: '#374151',
        cursor: 'pointer',
    },
    radio: {
        width: '1rem',
        height: '1rem',
        cursor: 'pointer',
    },
    errorText: {
        fontSize: '0.75rem',
        color: '#ef4444',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2rem',
    },
    confirmButton: {
        backgroundColor: '#1e3a5f',
        color: 'white',
        border: 'none',
        padding: '0.875rem 4rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
};

export default CheckoutPage;
