import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';

interface SearchFormData {
    from: string;
    to: string;
    departureDate: string;
    returnDate: string;
}

const FlightSearchPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [formData, setFormData] = useState<SearchFormData>({
        from: '',
        to: '',
        departureDate: '',
        returnDate: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${API_BASE_URL}/flights/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            if (response.ok) {
                const results = await response.json();
                // Navigate to results page with search data (to be implemented later)
                console.log('Search results:', results);
                // For now, we'll just log the results
                // navigate('/search-results', { state: { results, searchData: formData } });
            } else {
                console.error('Search failed');
            }
        } catch (error) {
            console.error('Error searching for flights:', error);
        }
    };

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

    return (
        <div style={styles.pageContainer}>
            {/* Top Navigation Bar */}
            <nav style={styles.navbar}>
                <div style={styles.logoContainer}>
                    <img src="/logo-branca.png" alt="Aurora Airlines" style={styles.logo} />
                </div>
                <button onClick={handleSignOut} style={styles.signInButton}>
                    Sign out
                </button>
            </nav>

            {/* Main Content with Background */}
            <div style={styles.mainContent}>
                {/* Glass Panel Container */}
                <div style={styles.searchContainer}>
                    <div style={styles.glassPanel}>
                        <h2 style={styles.title}>Search for your next flight here:</h2>
                        
                        <form onSubmit={handleSearch} style={styles.form}>
                            <div style={styles.row}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>From:</label>
                                    <input
                                        type="text"
                                        name="from"
                                        value={formData.from}
                                        onChange={handleChange}
                                        style={styles.input}
                                        placeholder="Departure city"
                                        required
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>To:</label>
                                    <input
                                        type="text"
                                        name="to"
                                        value={formData.to}
                                        onChange={handleChange}
                                        style={styles.input}
                                        placeholder="Destination city"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Swap Icon (centered between rows) */}
                            <div style={styles.swapIconContainer}>
                                <div style={styles.swapIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M7 16V4M7 4L3 8M7 4L11 8" />
                                        <path d="M17 8V20M17 20L21 16M17 20L13 16" />
                                    </svg>
                                </div>
                            </div>

                            <div style={styles.row}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Departure:</label>
                                    <input
                                        type="date"
                                        name="departureDate"
                                        value={formData.departureDate}
                                        onChange={handleChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Return:</label>
                                    <input
                                        type="date"
                                        name="returnDate"
                                        value={formData.returnDate}
                                        onChange={handleChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" style={styles.searchButton}>
                                <span>Search</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" />
                                </svg>
                            </button>
                        </form>
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
    signInButton: {
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundImage: 'url("/aurora-bg.jpg"), linear-gradient(to bottom, #0f172a, #1e293b, #0c4a6e)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
    },
    searchContainer: {
        width: '100%',
        maxWidth: '900px',
        padding: '2rem',
    },
    glassPanel: {
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
    },
    title: {
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '2rem',
        textAlign: 'left',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        color: 'white',
        fontSize: '0.95rem',
        fontWeight: '500',
        marginBottom: '0.5rem',
    },
    input: {
        padding: '0.875rem 1rem',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '12px',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        outline: 'none',
        transition: 'box-shadow 0.3s',
    },
    swapIconContainer: {
        display: 'flex',
        justifyContent: 'center',
        margin: '-0.75rem 0',
    },
    swapIcon: {
        backgroundColor: 'white',
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        color: '#1e3a5f',
    },
    searchButton: {
        backgroundColor: '#0e7490',
        color: 'white',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: '1rem',
        boxShadow: '0 4px 12px rgba(14, 116, 144, 0.3)',
        transition: 'all 0.3s',
        minWidth: '200px',
    },
};

export default FlightSearchPage;
