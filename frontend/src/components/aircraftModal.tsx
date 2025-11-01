import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import axios from 'axios'; // NOVO: Importar axios
import { Button } from './ui/button';
import { PrimaryButton } from './buttons/primaryButton';
// Assumindo que este arquivo existe e contém a URL e as interfaces
import { API_BASE_URL, Aircraft, CreateAircraftDto, UpdateAircraftDto } from '../aircrafts.constants'; 
import { AircraftType } from '../aircraft-types.constants'; 

interface AircraftModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAircraftSaved: () => void;
    aircraftToEdit: Aircraft | null;
    aircraftTypes: AircraftType[]; 
}

const initialFormData: CreateAircraftDto = {
    id: '',
    aircraftTypeId: 0,
};

const AircraftModal: React.FC<AircraftModalProps> = ({ isOpen, onClose, onAircraftSaved, aircraftToEdit, aircraftTypes }) => {
    const isEditMode = !!aircraftToEdit;
    const [formData, setFormData] = useState<CreateAircraftDto | UpdateAircraftDto>(initialFormData);

    useEffect(() => {
        if (aircraftToEdit) {
            setFormData({
                aircraftTypeId: aircraftToEdit.aircraftTypeId,
            } as UpdateAircraftDto);
        } else {
            // FIX: No modo de criação, use o ID do primeiro AircraftType disponível
            const defaultTypeId = aircraftTypes.length > 0 ? aircraftTypes[0].id : 0;

            setFormData({
                id: '',
                // Garante que o ID inicial do tipo seja válido para o DDL/API
                aircraftTypeId: defaultTypeId, 
            });
        }
    }, [aircraftToEdit, isOpen, aircraftTypes]); // Adicionado aircraftTypes como dependência

    if (!isOpen) return null;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Converte aircraftTypeId para número, pois o DTO espera um number.
        setFormData(prev => ({ ...prev, [name]: (name === 'aircraftTypeId' ? Number(value) : value) }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        const dataToSave = formData as CreateAircraftDto | UpdateAircraftDto;

        try {
            if (isEditMode && aircraftToEdit) {
                // Requisição PATCH (Update)
                // Envia o payload do DTO de atualização (apenas aircraftTypeId) para a rota /aircrafts/{id}
                await axios.patch(`${API_BASE_URL}/${aircraftToEdit.id}`, dataToSave);
                alert(`Aeronave ${aircraftToEdit.id} updated successfully!`); 
            } else {
                // Requisição POST (Create)
                // Envia o payload do DTO de criação (id e aircraftTypeId) para a rota /aircrafts
                await axios.post(API_BASE_URL, dataToSave as CreateAircraftDto);
                alert('Aircraft added successfully!');
            }
            
            onAircraftSaved(); // Recarrega a lista
            onClose();
        } catch (error) {
            console.error(`Error saving aircraft:`, error);
            // Mensagem de erro mais detalhada se for erro de validação (ex: ID já existe)
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : `Error saving aircraft. Check the console.`;
            alert(errorMessage);
        }
    };

    const title = isEditMode ? 'Update Aircraft' : 'Add new aircraft';
    const buttonText = isEditMode ? 'Save changes' : 'Add new aircraft';
    
    // Define o valor selecionado no DDL (garantindo que seja um número ou um valor do DDL)
    const selectedAircraftTypeId = Number((formData as CreateAircraftDto).aircraftTypeId) || aircraftTypes[0]?.id || 0;
    // Garante que o DDL tenha um valor selecionado mesmo que o formData esteja vazio no modo Update
    const displayAircraftTypeId = isEditMode && aircraftToEdit ? aircraftToEdit.aircraftTypeId : selectedAircraftTypeId;


    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.container}>
                <h2 style={modalStyles.title}>{title}</h2>
                <form onSubmit={handleSubmit} style={modalStyles.form}>
                    
                    {/* Campo ID da Aeronave (Apenas para Create) */}
                    {!isEditMode && (
                        <div style={modalStyles.inputGroup}>
                            <label htmlFor="id">Aircraft ID (e.g., A001)</label>
                            <input
                                id="id"
                                type="text"
                                name="id"
                                value={(formData as CreateAircraftDto).id || ''}
                                onChange={handleChange}
                                style={modalStyles.input}
                                required
                            />
                        </div>
                    )}
                    
                    {/* Campo Tipo de Aeronave (DDL) */}
                    <div style={modalStyles.inputGroup}>
                        <label htmlFor="aircraftTypeId">Aircraft Type</label>
                        <select
                            id="aircraftTypeId"
                            name="aircraftTypeId"
                            // No modo de edição, usa o ID do objeto original até que o usuário mude
                            value={isEditMode ? aircraftToEdit?.aircraftTypeId : displayAircraftTypeId}
                            onChange={handleChange}
                            style={modalStyles.input}
                            required
                        >
                             {/* Garante que o valor inicial seja o valor atual do objeto em edição */}
                            {aircraftTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.type} ({type.seats} seats)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={modalStyles.buttonGroup}>
                        <PrimaryButton type="submit">
                            {buttonText}
                        </PrimaryButton>
                        <Button type="button" onClick={onClose} variant="link" className='text-red-500 hover:text-red-600'>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AircraftModal;

// Estilos mantidos para layout
const modalStyles: { [key: string]: React.CSSProperties } = {
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
    inputGroup: {
        marginBottom: '15px',
    },
    input: {
        padding: '10px', margin: '5px 0 15px 0', border: '1px solid #ccc',
        borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box',
    },
    buttonGroup: {
        marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '10px',
    },
};