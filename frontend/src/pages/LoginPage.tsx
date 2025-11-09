import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; 

const API_URL = 'http://localhost:3001/auth/login';

interface LoginFormData {
    email: string;
    password: string;
}

interface UserDto {
    id: number;
    name: string;
    email: string;
    password: string; 
    role: 'admin' | 'user';
}


interface InputFieldProps {
 label: string;
 name: keyof LoginFormData; 
 type?: string;
 value: string;
 onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = 
 ({ label, name, type = 'text', value, onChange }) => ( 
 <div style={styles.inputGroup}>
 <label htmlFor={name} style={styles.label}>{label}</label>
 <input
 id={name} 
 type={type}
 name={name}
 value={value}
 onChange={onChange}
 style={styles.input}
 required
 />
 </div>
);



const LoginScreen: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name as keyof LoginFormData]: value }));
    };

    useEffect(() => {
        if (user) {
            if (user.type === 'admin') {
                navigate('/admin/employees', { replace: true });
            } else {
                navigate('/my-flights', { replace: true }); 
            }
        }
    }, [user, navigate]);
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        /*const { email, password } = formData;

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                setMessage('Error in communication with the server. Status:' + response.status);
                setLoading(false);
                return;
            }

            const users: UserDto[] = await response.json();

            const foundUser = users.find(user => 
                user.email === email && user.password === password
            );

            if (foundUser) {
                setMessage('Login successful!');
                
                login({ 
                    id: foundUser.id, 
                    name: foundUser.name, 
                    email: foundUser.email,
                    type: foundUser.role
                });
            } else {
                setMessage('Login failure: Incorrect user or password.');
            }

        } catch (error) {
            console.error('Network or processing error:', error);
            setMessage('Connection or data processing error.');
        } finally {
            setLoading(false);
        }*/

        try {
            const loginData = {
                email: formData.email,
                password: formData.password
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
                credentials: 'include',
            });

            if (response.ok) {
                const userData = await response.json();

                login({
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    type: userData.role
                });

                setMessage('Login sucessful!');

            } else {
                setMessage('Login failure: Incorrect user or password.')
            }
        } catch (error) {
            console.error('Network or processing error:', error)
            setMessage('Connection or data processing error.');
        } finally {
            setLoading(false);
        }
    };


    

    return (
        <div style={{ ...styles.container, ...styles.centerContent }}>
            <div style={styles.logoContainer}>
                <img src="/logo-azul.png" alt="Aurora Airlines Logo" style={styles.logo} />
            </div>

            <form onSubmit={handleLogin} style={styles.form}>
                <InputField 
                    label="E-mail" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                />
                <InputField 
                    label="Password" 
                    name="password" 
                    type="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                />

                {message && <p style={{ color: message.startsWith('Fail') ? 'red' : 'green', marginTop: '20px' }}>{message}</p>}
                
                <button type="submit" disabled={loading} style={styles.signInButton}>
                    {loading ? 'Loading...' : 'Sign in'}
                </button>
            </form>
            
            <div style={styles.registerLinkContainer}>
                <span style={styles.text}>Don't have an account?</span>
                <Link to="/register" style={styles.registerLink}>
                    Register here
                </Link>
            </div>
        </div>
    );
};


const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        backgroundColor: 'white',
        color: '#00254A',
    },
    centerContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 20px',
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '50px',
    },
    logo: {
        width: '120px', 
        height: 'auto',
        marginBottom: '10px',
    },
    logoText: {
        fontSize: '18px',
        fontWeight: 'bold',
        letterSpacing: '3px',
        margin: '0',
    },
    form: {
        width: '100%',
        maxWidth: '350px',
    },
    inputGroup: {
        marginBottom: '25px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '16px',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxSizing: 'border-box',
        fontSize: '16px',
    },
    signInButton: {
        width: '100%',
        backgroundColor: '#00254A', 
        color: 'white',
        padding: '15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '18px',
        marginTop: '30px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
    registerLinkContainer: {
        marginTop: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    text: {
        color: '#555',
        marginBottom: '5px',
    },
    registerLink: {
        color: '#00254A',
        textDecoration: 'underline',
        fontWeight: 'bold',
    }
};

export default LoginScreen;