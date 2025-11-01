import React from 'react';
import SeatMapViewer from './forms/seatMapViewer';
import { Button } from './ui/button';

interface SeatMapViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Dados do tipo de aeronave para visualização
    aircraftTypeData: { 
        type: string; 
        layoutData: string;
    } | null;
}

const SeatMapViewerModal: React.FC<SeatMapViewerModalProps> = ({ isOpen, onClose, aircraftTypeData }) => {
    if (!isOpen || !aircraftTypeData) return null;

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.container}>
                
                <SeatMapViewer 
                    layoutData={aircraftTypeData.layoutData} 
                    typeName={aircraftTypeData.type}
                />
                
                <div className="mt-6 flex justify-center">
                    <Button onClick={onClose} type="button">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SeatMapViewerModal;

// Estilos básicos (Reaproveitados de AircraftTypeModal)
const modalStyles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    container: {
        backgroundColor: 'white', padding: '20px', borderRadius: '10px',
        width: '90%', maxWidth: '750px', boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
        maxHeight: '90vh', overflowY: 'auto',
    },
};