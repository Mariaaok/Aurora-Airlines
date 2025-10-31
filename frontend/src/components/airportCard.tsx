import React from 'react';
import { Airport } from '../airports.constants';

interface AirportCardProps {
    airport: Airport;
    onEdit: (airport: Airport) => void;
    onDelete: (id: number, name: string) => void;
}

const AirportCard: React.FC<AirportCardProps> = ({ airport, onEdit, onDelete }) => {
    return (
        <div style={cardStyles.card}>
            <div style={cardStyles.row}>
                {/* Lado Esquerdo */}
                <div style={cardStyles.column}>
                    <p style={cardStyles.dataItem}>
                        <span style={cardStyles.dataLabel}>IATA:</span> {airport.IATA}
                    </p>
                    <p style={cardStyles.dataItem}>
                        <span style={cardStyles.dataLabel}>City:</span> {airport.city}
                    </p>
                </div>
                
                {/* Lado Direito */}
                <div style={cardStyles.column}>
                    <p style={cardStyles.dataItem}>
                        <span style={cardStyles.dataLabel}>Name:</span> {airport.name}
                    </p>
                    <p style={cardStyles.dataItem}>
                        <span style={cardStyles.dataLabel}>State:</span> {airport.state}
                        <span style={{...cardStyles.dataLabel, marginLeft: '15px'}}>Country:</span> {airport.country}
                    </p>
                </div>
            </div>

            {/* Ícones de Ação (Adaptado do design) */}
            <div style={cardStyles.actions}>
                <span 
                    onClick={() => onEdit(airport)} 
                    style={cardStyles.icon}
                    title="Editar"
                >
                    ✏️ 
                </span>
                <span 
                    onClick={() => onDelete(airport.id, airport.name)} 
                    style={{...cardStyles.icon, color: '#CC0000'}}
                    title="Deletar"
                >
                    🗑️ 
                </span>
            </div>
        </div>
    );
};

export default AirportCard;

// Estilos para o Card
const cardStyles: any = {
    card: {
        backgroundColor: '#fff', border: '1px solid #ddd',
        borderRadius: '8px', padding: '15px 20px', width: '100%',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)', position: 'relative',
        marginBottom: '15px',
    },
    row: {
        display: 'flex', justifyContent: 'space-between',
        paddingRight: '60px', // Espaço para os ícones
    },
    column: {
        flex: 1, 
        minWidth: '300px', 
    },
    dataItem: {
        margin: '5px 0',
        fontSize: '15px',
    },
    dataLabel: {
        fontWeight: 'bold', 
        color: '#333', 
        marginRight: '5px',
    },
    actions: {
        position: 'absolute', top: '50%', right: '15px',
        transform: 'translateY(-50%)',
        display: 'flex', gap: '10px',
    },
    icon: {
        cursor: 'pointer', 
        fontSize: '18px',
        padding: '5px',
    }
};