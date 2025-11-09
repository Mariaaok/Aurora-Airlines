import React from 'react';
import SeatSelector from './SeatSelector';
import { Button } from './ui/button';

interface SeatSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    aircraftTypeData: { 
        type: string; 
        layoutData: string;
    } | null;
    selectedSeats: string[];
    onSeatToggle: (seatId: string) => void;
}

const SeatSelectorModal: React.FC<SeatSelectorModalProps> = ({ 
    isOpen, 
    onClose, 
    aircraftTypeData,
    selectedSeats,
    onSeatToggle
}) => {
    if (!isOpen || !aircraftTypeData) return null;

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.container}>
                <SeatSelector
                    layoutData={aircraftTypeData.layoutData} 
                    typeName={aircraftTypeData.type}
                    selectedSeats={selectedSeats}
                    onSeatToggle={onSeatToggle}
                />
                
                <div className="mt-6 flex justify-center">
                    <Button onClick={onClose} type="button">
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectorModal;

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
