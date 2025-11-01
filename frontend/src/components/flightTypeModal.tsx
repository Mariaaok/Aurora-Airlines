import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { PrimaryButton } from './buttons/primaryButton';
import { API_BASE_URL, FlightType, CreateFlightTypeDto, UpdateFlightTypeDto } from '../flight-types.constants';

interface FlightTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFlightTypeSaved: () => void;
    flightTypeToEdit: FlightType | null;
}

const FlightTypeModal: React.FC<FlightTypeModalProps> = ({ isOpen, onClose, onFlightTypeSaved, flightTypeToEdit }) => {
    const isEditMode = !!flightTypeToEdit;
    const [name, setName] = useState('');

    useEffect(() => {
        if (flightTypeToEdit) {
            setName(flightTypeToEdit.name);
        } else {
            setName('');
        }
    }, [flightTypeToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        try {
            if (isEditMode && flightTypeToEdit) {
                const data: UpdateFlightTypeDto = { name };
                await axios.patch(`${API_BASE_URL}/${flightTypeToEdit.id}`, data);
                alert(`Flight type '${name}' updated successfully!`); 
            } else {
                const data: CreateFlightTypeDto = { name };
                await axios.post(API_BASE_URL, data);
                alert(`Flight type '${name}' added successfully!`);
            }
            
            onFlightTypeSaved(); 
            onClose();
        } catch (error) {
            console.error(`Error saving flight type:`, error);
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : `Error saving flight type. Check the console.`;
            alert(errorMessage);
        }
    };

    const title = isEditMode ? 'Edit Flight Type' : 'Add New Flight Type';
    const buttonText = isEditMode ? 'Save changes' : 'Add new type';

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.container}>
                <h2 style={modalStyles.title}>{title}</h2>
                <form onSubmit={handleSubmit} style={modalStyles.form}>
                    
                    <div style={modalStyles.inputGroup}>
                        <label htmlFor="name">Type Name (e.g., Nacional, Fretado)</label>
                        <input 
                            id="name" 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            style={modalStyles.input} 
                            required 
                        />
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

export default FlightTypeModal;

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