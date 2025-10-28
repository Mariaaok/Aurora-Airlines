import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { API_BASE_URL, CATEGORY_OPTIONS, Employee, UpdateEmployeeDto } from '../constants';

interface UpdateEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    // O objeto pode ser nulo se o modal não estiver aberto
    employeeToUpdate: Employee | null; 
    onEmployeeUpdated: () => void;
}

const UpdateEmployeeModal: React.FC<UpdateEmployeeModalProps> = ({ isOpen, onClose, employeeToUpdate, onEmployeeUpdated }) => {
    // Tipagem do estado com UpdateEmployeeDto (campos opcionais)
    const [formData, setFormData] = useState<UpdateEmployeeDto>({});

    useEffect(() => {
        if (employeeToUpdate) {
            // Sincroniza o estado do formulário com os dados do funcionário para edição
            const { id, ...rest } = employeeToUpdate;
            setFormData(rest);
        }
    }, [employeeToUpdate]);

    if (!isOpen || !employeeToUpdate) return null;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            // Requisição PATCH usa o ID do funcionário original
            await axios.patch(`${API_BASE_URL}/${employeeToUpdate.id}`, formData);
            alert('Funcionário atualizado com sucesso!');
            onEmployeeUpdated(); 
            onClose(); 
        } catch (error) {
            console.error('Erro ao atualizar funcionário:', error);
            alert('Erro ao atualizar funcionário. Verifique o console.');
        }
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.container}>
                <h2 style={modalStyles.title}>Update employee</h2>
                <form onSubmit={handleSubmit} style={modalStyles.form}>
                    
                    {/* Mapeamento dos campos */}
                    {['Name', 'Birthday', 'E-mail', 'Phone'].map(label => {
                        const name = label.toLowerCase().replace(/[-]/g, '');
                        // Mapeia o label para a chave correta do DTO
                        const key: keyof UpdateEmployeeDto = name === 'e-mail' ? 'email' : (name === 'phone' ? 'phoneNumber' : name as keyof UpdateEmployeeDto);
                        return (
                            <React.Fragment key={key}>
                                <label style={modalStyles.label}>{label}</label>
                                <input
                                    type={key === 'birthday' ? 'date' : 'text'}
                                    name={key}
                                    // Utiliza employeeToUpdate para o valor inicial, já que o estado é parcial
                                    value={formData[key] || employeeToUpdate[key as keyof Employee]} 
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
                        value={formData.category || employeeToUpdate.category}
                        onChange={handleChange}
                        style={modalStyles.input}
                        required
                    >
                        {CATEGORY_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    <div style={modalStyles.buttonGroup}>
                        <button type="submit" style={modalStyles.updateButton}>
                            Update employee
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

export default UpdateEmployeeModal;

interface CustomStyles{
    overlay: React.CSSProperties;
    container: React.CSSProperties;
    title: React.CSSProperties;
    form: React.CSSProperties;
    label: React.CSSProperties;
    input: React.CSSProperties;
    buttonGroup: React.CSSProperties;
    updateButton: React.CSSProperties;
    cancelButton: React.CSSProperties;
}

// Estilos básicos (mantidos do código anterior)
const modalStyles: CustomStyles= {
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
    updateButton: {
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