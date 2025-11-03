import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { PrimaryButton } from './buttons/primaryButton';
import { FormRow } from './forms/formRow'; // Importar FormRow
import { FormSection } from './forms/formSection'; // Importar FormSection
// As interfaces abaixo são baseadas na estrutura definida em etapas anteriores (simulação)
import { API_BASE_URL, Flight, CreateFlightDto, UpdateFlightDto, Transfer } from '../flights.constants'; 
import { FlightType } from '../flight-types.constants';
import { AircraftType } from '../aircraft-types.constants';
import { Airport } from '../airports.constants';
import { Employee } from '../constants'; // Assumindo que a interface Employee está aqui

// --- Tipagem de Props e Estado ---

// Estrutura de dados para o estado do formulário (inclui dados prontos para o POST)
interface FlightFormData extends Omit<CreateFlightDto, 'transfers'> {
    transfers: Transfer[]; // Manter como array para manipulação de estado
}

interface FlightModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFlightSaved: () => void;
    flightToEdit: Flight | null;
    // Dados para DDLs
    allFlightTypes: FlightType[];
    allAircraftTypes: AircraftType[];
    allAirports: Airport[];
    allEmployees: Employee[];
}

const initialFormData: FlightFormData = {
    flightNumber: '',
    flightTypeId: 0,
    aircraftTypeId: 0,
    originAirportId: 0,
    destinationAirportId: 0,
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    estimatedDuration: '',
    transfers: [],
    staffIds: [],
};

// --- Componente Principal ---

const FlightModal: React.FC<FlightModalProps> = ({ 
    isOpen, onClose, onFlightSaved, flightToEdit, 
    allFlightTypes, allAircraftTypes, allAirports, allEmployees 
}) => {
    const isEditMode = !!flightToEdit;
    const [formData, setFormData] = useState<FlightFormData>(initialFormData);
    const [loading, setLoading] = useState(false);

    // Efeito para carregar dados de edição
    useEffect(() => {
        if (flightToEdit) {
            const transfersArray: Transfer[] = flightToEdit.transfers ? JSON.parse(flightToEdit.transfers) : [];
            
            // Mapeia o staff do backend (EmployeeFlight[]) para staffIds (number[])
            // O backend deve retornar os IDs dos funcionários para o DTO
            const initialStaffIds = flightToEdit.staff.map(s => s.employee.id); 

            setFormData({
                flightNumber: flightToEdit.flightNumber,
                flightTypeId: flightToEdit.flightTypeId,
                aircraftTypeId: flightToEdit.aircraftTypeId,
                originAirportId: flightToEdit.originAirportId,
                destinationAirportId: flightToEdit.destinationAirportId,
                departureDate: flightToEdit.departureDate,
                departureTime: flightToEdit.departureTime,
                arrivalDate: flightToEdit.arrivalDate,
                arrivalTime: flightToEdit.arrivalTime,
                estimatedDuration: flightToEdit.estimatedDuration,
                transfers: transfersArray,
                staffIds: initialStaffIds,
            });
        } else {
            // Inicializa IDs dos DDLs com o primeiro valor válido
            setFormData({
                ...initialFormData,
                flightTypeId: allFlightTypes[0]?.id || 0,
                aircraftTypeId: allAircraftTypes[0]?.id || 0,
                originAirportId: allAirports[0]?.id || 0,
                destinationAirportId: allAirports[0]?.id || 0,
            });
        }
    }, [flightToEdit, isOpen, allFlightTypes, allAircraftTypes, allAirports, allEmployees]);

    if (!isOpen) return null;

    // Lida com mudança de campos simples (Input/Select)
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name.includes('Id') ? Number(value) : value 
        }));
    };

    // --- Lógica de Escalas (Transfers) ---

    const handleAddTransfer = () => {
        setFormData(prev => ({
            ...prev,
            transfers: [...prev.transfers, { airportId: allAirports[0]?.id || 0, departureTime: '', arrivalTime: '' }]
        }));
    };

    const handleRemoveTransfer = (index: number) => {
        setFormData(prev => ({
            ...prev,
            transfers: prev.transfers.filter((_, i) => i !== index),
        }));
    };

    const handleTransferChange = (index: number, field: keyof Transfer, value: string | number) => {
        const newTransfers = formData.transfers.map((t, i) => {
            if (i === index) {
                return { ...t, [field]: value };
            }
            return t;
        });
        setFormData(prev => ({ ...prev, transfers: newTransfers }));
    };

    // --- Lógica de Funcionários (Staff) ---

    const handleStaffChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedIds = Array.from(e.target.selectedOptions, option => Number(option.value));
        setFormData(prev => ({ ...prev, staffIds: selectedIds }));
    };
    
    // --- Submissão do Formulário ---

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        // Converte o array de transfers para JSON string para o backend
        const dataToSubmit: CreateFlightDto | UpdateFlightDto = {
            ...formData,
            transfers: JSON.stringify(formData.transfers),
        };
        
        try {
            if (isEditMode && flightToEdit) {
                // PATCH (Update)
                await axios.patch(`${API_BASE_URL}/${flightToEdit.id}`, dataToSubmit as UpdateFlightDto);
                alert(`Flight ${flightToEdit.flightNumber} updated successfully!`); 
            } else {
                // POST (Create)
                await axios.post(API_BASE_URL, dataToSubmit as CreateFlightDto);
                alert('Flight added successfully!');
            }
            
            onFlightSaved(); 
            onClose();
        } catch (error) {
            console.error(`Error saving flight:`, error);
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : `Error saving flight. Check the console.`;
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const title = isEditMode ? 'Update Flight' : 'Add new flight';
    const buttonText = isEditMode ? 'Save changes' : 'Add new flight';

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.container}>
                <h2 style={modalStyles.title}>{title}</h2>
                <form onSubmit={handleSubmit} style={modalStyles.form}>
                    
                    {/* SEÇÃO 1: INFORMAÇÕES BÁSICAS */}
                    <FormSection title="Flight Details">
                        <div className="grid grid-cols-2 gap-4">
                            <FormRow label="Flight number">
                                <input 
                                    type="text" 
                                    name="flightNumber" 
                                    value={formData.flightNumber} 
                                    onChange={handleChange} 
                                    required 
                                    readOnly={isEditMode} // ID não é editável
                                    style={modalStyles.input}
                                />
                            </FormRow>
                            <FormRow label="Estimated duration (h:mm)">
                                <input 
                                    type="text" 
                                    name="estimatedDuration" 
                                    value={formData.estimatedDuration} 
                                    onChange={handleChange} 
                                    placeholder="Ex: 03:45"
                                    required 
                                    style={modalStyles.input}
                                />
                            </FormRow>
                            
                            <FormRow label="Flight Type">
                                <select name="flightTypeId" value={formData.flightTypeId} onChange={handleChange} required style={modalStyles.input}>
                                    {allFlightTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </FormRow>
                            <FormRow label="Aircraft Type">
                                <select name="aircraftTypeId" value={formData.aircraftTypeId} onChange={handleChange} required style={modalStyles.input}>
                                    {allAircraftTypes.map(t => <option key={t.id} value={t.id}>{t.type}</option>)}
                                </select>
                            </FormRow>
                        </div>
                    </FormSection>

                    {/* SEÇÃO 2: TEMPO E ROTA */}
                    <FormSection title="Route and Schedule">
                        <div className="grid grid-cols-3 gap-4">

                            <FormRow label="Departure Date">
                              <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} required style={modalStyles.input} />
                           </FormRow>
                           <FormRow label="Arrival Date">
                              <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} required style={modalStyles.input} />
                           </FormRow>
                           <div></div>

                            <FormRow label="Departure Time (Origin)">
                                <input type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} required style={modalStyles.input} />
                            </FormRow>
                            <FormRow label="Arrival Time (Final Destination)">
                                <input type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} required style={modalStyles.input} />
                            </FormRow>
                            <div></div> {/* Coluna vazia para alinhamento */}
                            
                            <FormRow label="Origin Airport (From)">
                                <select name="originAirportId" value={formData.originAirportId} onChange={handleChange} required style={modalStyles.input}>
                                    {allAirports.map(a => <option key={a.id} value={a.id}>{a.name} ({a.IATA})</option>)}
                                </select>
                            </FormRow>
                            <FormRow label="Destination Airport (At)">
                                <select name="destinationAirportId" value={formData.destinationAirportId} onChange={handleChange} required style={modalStyles.input}>
                                    {allAirports.map(a => <option key={a.id} value={a.id}>{a.name} ({a.IATA})</option>)}
                                </select>
                            </FormRow>
                        </div>
                    </FormSection>

                    {/* SEÇÃO 3: ESCALAS (TRANSFERS) */}
                    <FormSection title="Transfers/Scales">
                         <div className="space-y-3">
                            {formData.transfers.map((transfer, index) => {
                                const airport = allAirports.find(a => a.id === transfer.airportId);
                                return (
                                    <div key={index} className="flex items-center space-x-3 border-b pb-2">
                                        <div className="flex-1 grid grid-cols-3 gap-3">
                                            <FormRow label="Airport">
                                                <select 
                                                    value={transfer.airportId} 
                                                    onChange={(e) => handleTransferChange(index, 'airportId', Number(e.target.value))} 
                                                    required 
                                                    style={modalStyles.input}
                                                >
                                                    {allAirports.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                                </select>
                                            </FormRow>
                                            <FormRow label="Arrival Time">
                                                <input 
                                                    type="time" 
                                                    value={transfer.arrivalTime} 
                                                    onChange={(e) => handleTransferChange(index, 'arrivalTime', e.target.value)} 
                                                    required 
                                                    style={modalStyles.input}
                                                />
                                            </FormRow>
                                            <FormRow label="Departure Time">
                                                <input 
                                                    type="time" 
                                                    value={transfer.departureTime} 
                                                    onChange={(e) => handleTransferChange(index, 'departureTime', e.target.value)} 
                                                    required 
                                                    style={modalStyles.input}
                                                />
                                            </FormRow>
                                        </div>
                                        <Button 
                                            type="button" 
                                            onClick={() => handleRemoveTransfer(index)} 
                                            variant="destructive"
                                            size="sm"
                                            className="self-end"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                        <Button type="button" onClick={handleAddTransfer} className="mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800">
                            + Add Scale
                        </Button>
                    </FormSection>


                    {/* SEÇÃO 4: STAFF */}
                    <FormSection title="Flight Staff">
                        <p className="text-sm text-gray-600 mb-2">Select employees (Pilots, Co-pilots, Flight Attendants)</p>
                        <select 
                            name="staffIds" 
                            multiple 
                            value={formData.staffIds.map(String)} // Valor esperado é string[] para o select
                            onChange={handleStaffChange} 
                            required 
                            style={{...modalStyles.input, minHeight: '150px'}} // Aumentar altura para seleção múltipla
                        >
                            {allEmployees.map(e => (
                                <option key={e.id} value={e.id}>
                                    {e.name} ({e.category})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Use Ctrl/Cmd para selecionar múltiplos funcionários.</p>
                    </FormSection>

                    {/* BOTÕES DE AÇÃO */}
                    <div style={modalStyles.buttonGroup} className="mt-8">
                        <PrimaryButton type="submit" disabled={loading}>
                            {loading ? 'Saving...' : buttonText}
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

export default FlightModal;

// --- Estilos ---
const modalStyles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    container: {
        backgroundColor: 'white', padding: '30px 40px', borderRadius: '10px',
        width: '90%', maxWidth: '850px', boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
        maxHeight: '90vh', overflowY: 'auto',
    },
    title: {
        color: '#003366', fontSize: '24px', marginBottom: '20px', textAlign: 'center',
    },
    form: {
        display: 'flex', flexDirection: 'column', textAlign: 'left',
    },
    input: {
        width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc',
        borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box',
    },
    buttonGroup: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '10px',
    },
    // Estilos para FormRow são tratados pelo FormRow.tsx
};