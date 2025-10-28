import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { API_BASE_URL, CATEGORY_OPTIONS, CreateEmployeeDto } from '../constants';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEmployeeAdded: () => void;
}

const initialFormData: CreateEmployeeDto = {
    name: '',
    phoneNumber: '',
    email: '',
    birthday: '',
    category: CATEGORY_OPTIONS[0],
};

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onEmployeeAdded }) => {
    // Tipagem do estado com a interface CreateEmployeeDto
    const [formData, setFormData] = useState<CreateEmployeeDto>(initialFormData);

    if (!isOpen) return null;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // TypeScript infere que name corresponde a uma chave de CreateEmployeeDto
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(API_BASE_URL, formData);
            alert('Funcionário adicionado com sucesso!');
            onEmployeeAdded(); 
            setFormData(initialFormData); // Resetar formulário
            onClose(); 
        } catch (error) {
            console.error('Erro ao adicionar funcionário:', error);
            alert('Erro ao adicionar funcionário. Verifique o console.');
        }
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.container}>
                <h2 style={modalStyles.title}>Add new employee</h2>
                <form onSubmit={handleSubmit} style={modalStyles.form}>
                    
                    {/* Mapeamento dos campos */}
                    {['Name', 'Birthday', 'E-mail', 'Phone'].map(label => {
                        const name = label.toLowerCase().replace(/[-]/g, '');
                        // Mapeia o label para a chave correta do DTO
                        const key: keyof CreateEmployeeDto = name === 'e-mail' ? 'email' : (name === 'phone' ? 'phoneNumber' : name as keyof CreateEmployeeDto);
                        return (
                            <React.Fragment key={key}>
                                <label style={modalStyles.label}>{label}</label>
                                <input
                                    type={key === 'birthday' ? 'date' : 'text'}
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    style={modalStyles.input}
                                    required
                                />
                            </React.Fragment>
                        );
                    })}

                    {/* Campo de Category (DDL) */}
                    <label style={modalStyles.label}>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        style={modalStyles.input}
                        required
                    >
                        {CATEGORY_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    <div style={modalStyles.buttonGroup}>
                        <button type="submit" style={modalStyles.addButton}>
                            Add new employee
                        </button>
                        <button type="button" onClick={onClose} style={modalStyles.cancelButton}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeModal;
interface CustomStyles{
    overlay: React.CSSProperties;
    container: React.CSSProperties;
    title: React.CSSProperties;
    form: React.CSSProperties;
    label: React.CSSProperties;
    input: React.CSSProperties;
    buttonGroup: React.CSSProperties;
    //updateButton: React.CSSProperties;
    addButton: React.CSSProperties;
    cancelButton: React.CSSProperties;
}
// Estilos básicos (mantidos do código anterior)
const modalStyles: CustomStyles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    container: {
        backgroundColor: 'white', padding: '30px 40px', borderRadius: '8px',
        width: '400px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
    },
    title: {
        color: '#003366', fontSize: '24px', marginBottom: '20px',
    },
    form: {
        display: 'flex', flexDirection: 'column', textAlign: 'left',
    },
    label: {
        fontSize: '14px', color: '#333', marginTop: '10px',
    },
    input: {
        padding: '10px', margin: '5px 0 15px 0', border: '1px solid #ccc',
        borderRadius: '4px', fontSize: '16px',
    },
    buttonGroup: {
        marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#003366', color: 'white', padding: '12px 20px',
        border: 'none', borderRadius: '5px', cursor: 'pointer',
        fontSize: '16px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        marginBottom: '10px', width: '100%',
    },
    cancelButton: {
        backgroundColor: 'transparent', color: '#CC0000', border: 'none',
        cursor: 'pointer', fontSize: '14px', textDecoration: 'underline',
    }
};