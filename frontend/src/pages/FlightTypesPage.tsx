import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/layouts/navbar';
import PageContainer from '../components/layouts/pageContainer';
import SectionHeader from '../components/layouts/sectionHeader';
import { AdminTabs } from '../components/layouts/adminTabs';
import DataCard from '../components/cards/DataCard';
import DangerButton from '../components/buttons/dangerButton';
import FlightTypeModal from '../components/flightTypeModal'; 
import { API_BASE_URL, FlightType } from '../flight-types.constants';

const AdminFlightTypesPage: React.FC = () => {
    const [flightTypes, setFlightTypes] = useState<FlightType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [typeToEdit, setTypeToEdit] = useState<FlightType | null>(null);

    const fetchFlightTypes = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<FlightType[]>(API_BASE_URL); 
            setFlightTypes(response.data);
        } catch (error) {
            console.error('Error fetching flight types:', error);
            alert('Error loading flight types list.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFlightTypes();
    }, []);

    const handleSaveType = async () => {
        await fetchFlightTypes(); 
        setIsModalOpen(false);
    };

    const handleDeleteType = async (id: number, typeName: string) => {
        if (!window.confirm(`Are you sure you want to delete the flight type ${typeName}?`)) {
            return;
        }
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            alert(`Flight type ${typeName} deleted successfully.`);
            fetchFlightTypes(); 
        } catch (error) {
            console.error('Error deleting flight type:', error);
            alert('Error deleting flight type. Check the console.');
        }
    };

    const handleOpenAddModal = () => {
        setTypeToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (type: FlightType) => {
        setTypeToEdit(type);
        setIsModalOpen(true);
    };


    if (isLoading) {
        return (
             <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div style={loadingStyles}>Loading flight types...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <AdminTabs />
            <PageContainer>
                <SectionHeader
                    title="Flight Types"
                    buttonText="Add New Type"
                    onButtonClick={handleOpenAddModal}
                />
                
                <div className="space-y-4">
                    {flightTypes.length === 0 ? (
                        <p className="text-gray-500">Nenhum tipo de voo cadastrado.</p>
                    ) : (
                        flightTypes.map(type => (
                            <DataCard
                                key={type.id}
                                actions={
                                    <>
                                        <button 
                                            onClick={() => handleOpenEditModal(type)} 
                                            className="text-blue-800 hover:text-blue-900 p-1 rounded transition"
                                            title="Edit Type"
                                        >
                                            ✏️
                                        </button>
                                        <DangerButton onClick={() => handleDeleteType(type.id, type.name)}>🗑️</DangerButton>
                                    </>
                                }
                            >
                                <div className="flex justify-between w-full">
                                    <span className="font-medium">{type.name}</span>
                                </div>
                            </DataCard>
                        ))
                    )}
                </div>

                <FlightTypeModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onFlightTypeSaved={handleSaveType}
                    flightTypeToEdit={typeToEdit}
                />
            </PageContainer>
        </div>
    );
};

export default AdminFlightTypesPage;

const loadingStyles: React.CSSProperties = {
    textAlign: 'center', paddingTop: '50px', fontSize: '18px',
    color: '#555',
};