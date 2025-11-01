import React, { useState, FormEvent, useEffect } from 'react';
import SeatMapEditor from './forms/seatMapEditor';
import { PrimaryButton } from './buttons/primaryButton';
import { Button } from './ui/button'; 

// Importa a interface do arquivo da página, que você não forneceu,
// mas que criamos na etapa anterior para simulação.
interface AircraftType {
    id: number;
    type: string;
    seats: number;
    description: string;
    layoutData: string; // JSON string do layout
}

interface AircraftTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<AircraftType, 'id'>) => void;
    aircraftTypeToEdit: AircraftType | null;
}

const AircraftTypeModal: React.FC<AircraftTypeModalProps> = ({ isOpen, onClose, onSave, aircraftTypeToEdit }) => {
    const isEditing = !!aircraftTypeToEdit;
    
    // ESTADOS: Sincronizar com os dados de edição ou resetar
    const [type, setType] = useState(aircraftTypeToEdit?.type || '');
    // O campo 'seats' é agora um estado interno que será atualizado pelo editor
    const [seats, setSeats] = useState(aircraftTypeToEdit?.seats || 0); 
    const [description, setDescription] = useState(aircraftTypeToEdit?.description || '');
    const [layoutData, setLayoutData] = useState(aircraftTypeToEdit?.layoutData || '');

    // Efeito para preencher os dados de edição
    useEffect(() => {
        if (aircraftTypeToEdit) {
            setType(aircraftTypeToEdit.type);
            setSeats(aircraftTypeToEdit.seats);
            setDescription(aircraftTypeToEdit.description);
            setLayoutData(aircraftTypeToEdit.layoutData);
        } else {
            // Resetar estados para novo formulário
            setType('');
            setSeats(0);
            setDescription('');
            setLayoutData('');
        }
    }, [aircraftTypeToEdit, isOpen]);


    if (!isOpen) return null;

    // Função de callback do SeatMapEditor para atualizar o layoutData
    const handleLayoutChange = (newLayoutJson: string) => {
        setLayoutData(newLayoutJson);
    };

    // NOVO: Função de callback do SeatMapEditor para atualizar a contagem de assentos
    const handleSeatCountChange = (count: number) => {
        setSeats(count);
    };


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        // Simulação de salvamento
        const dataToSave: Omit<AircraftType, 'id'> = {
            type,
            // O valor de 'seats' é o estado calculado, e não o valor de um input manual.
            seats, 
            description,
            layoutData,
        };

        onSave(dataToSave);
        onClose();
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.container}>
                <h2 style={modalStyles.title}>{isEditing ? 'Edit Aircraft Type' : 'Add new type'}</h2>
                <form onSubmit={handleSubmit} style={modalStyles.form}>
                    
                    {/* Campos de Texto (Type, Description) */}
                    <div style={modalStyles.inputGroup}>
                        <label htmlFor="type">Type</label>
                        <input id="type" type="text" value={type} onChange={(e) => setType(e.target.value)} required style={modalStyles.input} />
                    </div>
                    
                    {/* CAMPO SEATS (AGORA CALCULADO/READONLY) */}
                    <div style={modalStyles.inputGroup}>
                        <label htmlFor="seats">Seats (Auto-calculated)</label>
                        <input 
                            id="seats" 
                            type="number" 
                            value={seats} 
                            readOnly // Torna o campo somente leitura
                            style={{...modalStyles.input, backgroundColor: '#eee'}} // Visualmente diferente
                        />
                    </div>
                    
                    <div style={modalStyles.inputGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{...modalStyles.input, minHeight: '80px'}} />
                    </div>

                    {/* Editor de Mapa de Assentos */}
                    <div style={modalStyles.seatMapSection}>
                         <label>Seat map</label>
                         <SeatMapEditor 
                             initialLayout={layoutData} 
                             onLayoutChange={handleLayoutChange} 
                             onSeatCountChange={handleSeatCountChange} // NOVO: Passa a função de callback
                             isEditing={true} 
                         />
                    </div>
                    

                    {/* Botões de Ação */}
                    <div style={modalStyles.buttonGroup}>
                        <PrimaryButton type="submit">
                            {isEditing ? 'Save changes' : 'Add new type'}
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

export default AircraftTypeModal;

// ... (Restante dos estilos) ...
const modalStyles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    container: {
        backgroundColor: 'white', padding: '30px 40px', borderRadius: '10px',
        width: '90%', maxWidth: '700px', boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
        maxHeight: '90vh', overflowY: 'auto',
    },
    title: {
        color: '#003366', fontSize: '24px', marginBottom: '20px', textAlign: 'center',
    },
    form: {
        display: 'flex', flexDirection: 'column', textAlign: 'left',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc',
        borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box',
    },
    seatMapSection: {
        marginTop: '20px',
    },
    buttonGroup: {
        marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '10px',
    },
};