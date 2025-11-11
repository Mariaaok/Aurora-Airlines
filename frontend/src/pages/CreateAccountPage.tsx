import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/users`;


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
    customInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const InputField: React.FC<InputFieldProps> = 
    ({ label, name, placeholder, type = 'text', value, onChange, customInputProps = {} }) => (
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
            {...customInputProps}
        />
    </div>
);


const CreateAccountScreen: React.FC = () => {
    const [formData, setFormData] = useState<FullCreateUserDto>(initialFormState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'phoneNumber') {
            newValue = value.replace(/[^0-9]/g, ''); 
        }
        
        if (name === 'CPF') {
            newValue = value.replace(/[^0-9]/g, '').slice(0, 11);
        }

        if (name === 'RG') {
            newValue = value.replace(/[^0-9]/g, '').slice(0, 9);
        }

        if (name === 'birthday' || name === 'RGIssueDate') {
            if (e.target.type !== 'date') {
                newValue = value.replace(/[^0-9-]/g, ''); 
     
            }
        }
        
        setFormData(prev => ({ 
            ...prev, 
            [name as keyof FullCreateUserDto]: newValue 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (formData.CPF.length !== 11) {
            setMessage('Error: The identification number (CPF) must contain 11 digits.');
            setLoading(false);
            return;
        }
        if (formData.RG.length !== 9) {
            setMessage('Error: The RG must contain 9 digits.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage('Account created successfully!');
            } else {
                const errorData = await response.json();
                setMessage(`Error creating account: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Network error:', error);
            setMessage('Server connection error.');
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
                        <InputField 
                            label="Phone number" 
                            name="phoneNumber" 
                            placeholder="With country code" 
                            value={formData.phoneNumber} 
                            onChange={handleChange}
                            customInputProps={{ inputMode: 'numeric', maxLength: 15 }}
                        />
                        <InputField label="E-mail" name="email" placeholder="example@email.com" type="email" value={formData.email} onChange={handleChange} />
                        <InputField label="Workplace" name="workplace" placeholder="Name of company" value={formData.workplace} onChange={handleChange} />
                        <InputField label="Workplace address" name="workplaceAddress" placeholder="Full address" value={formData.workplaceAddress} onChange={handleChange} />
                        <InputField 
                            label="Birthday" 
                            name="birthday" 
                            placeholder="yyyy-mm-dd" 
                            type="text" 
                            value={formData.birthday} 
                            onChange={handleChange} 
                            customInputProps={{ pattern: "\\d{4}-\\d{2}-\\d{2}", title: "Formato: YYYY-MM-DD" }}
                        />

                        <h3 style={styles.subTitle}>Documentos e Segurança</h3>
                        <InputField label="Password" name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} />
                        
                        <InputField 
                            label="CPF" 
                            name="CPF" 
                            placeholder="00000000000" 
                            value={formData.CPF} 
                            onChange={handleChange}
                            customInputProps={{ inputMode: 'numeric', maxLength: 11 }}
                        />
                        <InputField 
                            label="RG" 
                            name="RG" 
                            placeholder="000000000" 
                            value={formData.RG} 
                            onChange={handleChange}
                            customInputProps={{ inputMode: 'numeric', maxLength: 9 }}
                        />
                        <InputField 
                        label="RG Issue Date" 
                        name="RGIssueDate" 
                        placeholder="yyyy-mm-dd" 
                        type="text" 
                        value={formData.RGIssueDate} 
                        onChange={handleChange} 
                        customInputProps={{ pattern: "\\d{4}-\\d{2}-\\d{2}", title: "Formato: YYYY-MM-DD" }}
                    />
                        <InputField label="Issuing Body of RG" name="IssuingBodyofRG" placeholder="Ex: SSP/SP" value={formData.IssuingBodyofRG} onChange={handleChange} />


                        {message && <p style={{ color: message.startsWith('Erro') ? 'red' : 'green', marginTop: '15px' }}>{message}</p>}

                        <button type="submit" disabled={loading} style={styles.submitButton}>
                            {loading ? 'Criando...' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAccountScreen;



const styles: any = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f4f7f6',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 50px',
        backgroundColor: '#003366', 
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logoText: {
        color: '#a0ffff',
        fontSize: '24px',
        fontWeight: 'bold',
        letterSpacing: '2px',
    },
    registerLink: {
        textDecoration: 'none',
    },
    signInButton: {
        backgroundColor: '#005f99',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
    mainContent: {
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
    },
    formContainer: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px',
    },
    title: {
        color: '#003366',
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '28px',
    },
    subTitle: {
        color: '#003366',
        marginTop: '30px',
        marginBottom: '15px',
        borderBottom: '1px solid #eee',
        paddingBottom: '5px',
        fontSize: '18px',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#333',
        fontWeight: '600',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxSizing: 'border-box',
        fontSize: '16px',
    },
    submitButton: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#005f99',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold',
        marginTop: '25px',
        transition: 'background-color 0.3s',
    }
};