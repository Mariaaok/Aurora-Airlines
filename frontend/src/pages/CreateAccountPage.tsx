import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/users';

interface FullCreateUserDto {
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    workplace: string;
    workplaceAddress: string;
    birthday: string;
    CPF: string;
    RG: string;
    RGIssueDate: string;
    IssuingBodyofRG: string;
    password: string;
}

const initialFormState: FullCreateUserDto = {
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    workplace: '',
    workplaceAddress: '',
    birthday: '',
    password: '', 
    CPF: '', 
    RG: '',
    RGIssueDate: '',
    IssuingBodyofRG: ''
};


interface InputFieldProps {
    label: string;
    name: keyof FullCreateUserDto;
    placeholder: string;
    type?: string;
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}

const InputField: React.FC<InputFieldProps> = 
    ({ label, name, placeholder, type = 'text', value, onChange }) => (
    <div style={styles.inputGroup}>
        <label htmlFor={name} style={styles.label}>{label}</label>
        <input
            id={name} 
            type={type}
            name={name}
            value={value} 
            onChange={onChange} 
            placeholder={placeholder}
            style={styles.input}
            required
        />
    </div>
);


const CreateAccountScreen: React.FC = () => {
    const [formData, setFormData] = useState<FullCreateUserDto>(initialFormState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
            setFormData(prev => ({ 
            ...prev, 
            [name as keyof FullCreateUserDto]: value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage('Conta criada com sucesso!');
            } else {
                const errorData = await response.json();
                setMessage(`Erro ao criar conta: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            setMessage('Erro de conexão com o servidor.');
        } finally {
            setLoading(false);
        }
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
                <div style={styles.formContainer}>
                    <h2 style={styles.title}>Create your account</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <InputField label="Full name" name="name" placeholder="Name and surname" value={formData.name} onChange={handleChange} />
                        <InputField label="Address" name="address" placeholder="Full address" value={formData.address} onChange={handleChange} />
                        <InputField label="Phone number" name="phoneNumber" placeholder="With country code" value={formData.phoneNumber} onChange={handleChange} />
                        <InputField label="E-mail" name="email" placeholder="example@email.com" type="email" value={formData.email} onChange={handleChange} />
                        <InputField label="Workplace" name="workplace" placeholder="Name of company" value={formData.workplace} onChange={handleChange} />
                        <InputField label="Workplace address" name="workplaceAddress" placeholder="Name of company" value={formData.workplaceAddress} onChange={handleChange} />
                        <InputField label="Birthday" name="birthday" placeholder="yyyy-mm-dd" value={formData.birthday} onChange={handleChange} />

                        <h3 style={styles.subTitle}>Documentos e Segurança</h3>
                        <InputField label="Password" name="password" placeholder="Sua senha" type="password" value={formData.password} onChange={handleChange} />
                        <InputField label="CPF" name="CPF" placeholder="000.000.000-00" value={formData.CPF} onChange={handleChange} />
                        <InputField label="RG" name="RG" placeholder="Seu número de RG" value={formData.RG} onChange={handleChange} />
                        <InputField label="Data de Emissão RG" name="RGIssueDate" placeholder="yyyy-mm-dd" value={formData.RGIssueDate} onChange={handleChange} />
                        <InputField label="Órgão Emissor RG" name="IssuingBodyofRG" placeholder="Ex: SSP/SP" value={formData.IssuingBodyofRG} onChange={handleChange} />


                        {message && <p style={{ color: message.startsWith('Erro') ? 'red' : 'green' }}>{message}</p>}

                        <button type="submit" disabled={loading} style={styles.submitButton}>
                            {loading ? 'Criando...' : 'Create Account'}
                        </button>
                    </form>
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
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
    },
    mainContent: {
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 0',
    },
    formContainer: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px', 
    },
    title: {
        color: '#00254A',
        marginBottom: '30px',
        fontSize: '24px',
    },
    subTitle: {
        color: '#00254A',
        marginTop: '30px',
        marginBottom: '15px',
        fontSize: '18px',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: '500',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#00254A',
        color: 'white',
        padding: '15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '18px',
        marginTop: '20px',
    },
};

export default CreateAccountScreen;