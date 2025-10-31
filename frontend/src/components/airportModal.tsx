import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, CreateAirportDto, Airport, UpdateAirportDto } from '../airports.constants';

interface AirportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAirportSaved: () => void;
    // Se for nulo, é um modal de adição (Create). Se for Airport, é de edição (Update).
    airportToEdit: Airport | null; 
}

const initialFormData: CreateAirportDto = {
    name: '',
    city: '',
    country: '',
    state: '',
    IATA: '',
};

const AirportModal: React.FC<AirportModalProps> = ({ isOpen, onClose, onAirportSaved, airportToEdit }) => {
    // Inicializa o estado com o aeroporto a ser editado ou com um formulário vazio
    const [formData, setFormData] = useState<CreateAirportDto | UpdateAirportDto>(initialFormData);
    const isEditMode = !!airportToEdit;

    useEffect(() => {
        if (airportToEdit) {
            // Se estiver editando, preenche o formulário com os dados do aeroporto
            const { id, ...rest } = airportToEdit;
            setFormData(rest);
        } else {
            // Se estiver adicionando, reseta o formulário
            setFormData(initialFormData);
        }
    }, [airportToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        try {
            if (isEditMode && airportToEdit) {
                // Requisição PATCH (Update)
                await axios.patch(`${API_BASE_URL}/${airportToEdit.id}`, formData as UpdateAirportDto);
                alert('Aeroporto atualizado com sucesso!');
            } else {
                // Requisição POST (Create)
                await axios.post(API_BASE_URL, formData as CreateAirportDto);
                alert('Aeroporto adicionado com sucesso!');
            }
            
            onAirportSaved(); // Atualiza a lista
            onClose(); // Fecha o modal
        } catch (error) {
            console.error(`Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} aeroporto:`, error);
            alert(`Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} aeroporto. Verifique o console.`);
        }
    };

    const title = isEditMode ? 'Update Airport' : 'Add new airport';
    const buttonText = isEditMode ? 'Update airport' : 'Add new airport';
    
    // Lista de campos e suas respectivas chaves DTO
    const fields: { label: string, key: keyof CreateAirportDto }[] = [
        { label: 'Name', key: 'name' },
        { label: 'City', key: 'city' },
        { label: 'State', key: 'state' },
        { label: 'Country', key: 'country' },
        { label: 'IATA Code', key: 'IATA' },
    ];

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.container}>
                <h2 style={modalStyles.title}>{title}</h2>
                <form onSubmit={handleSubmit} style={modalStyles.form}>
                    
                    {fields.map(({ label, key }) => (
                        <React.Fragment key={key}>
                            <label style={modalStyles.label}>{label}</label>
                            <input
                                type="text"
                                name={key}
                                // Usa o valor do estado local, ou o valor do objeto original (se estiver editando)
                                value={formData[key] || ''} 
                                onChange={handleChange}
                                style={modalStyles.input}
                                required
                            />
                        </React.Fragment>
                    ))}

                    <div style={modalStyles.buttonGroup}>
                        <button type="submit" style={modalStyles.saveButton}>
                            {buttonText}
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

export default AirportModal;

// Estilos básicos (adaptados)
const modalStyles: any = {
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
    saveButton: {
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