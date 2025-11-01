import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importar axios para requisições HTTP
import Navbar from '../components/layouts/navbar';
import PageContainer from '../components/layouts/pageContainer';
import SectionHeader from '../components/layouts/sectionHeader';
import { AdminTabs } from '../components/layouts/adminTabs';
import { EditableCard } from '../components/cards/EditableCard';
import AircraftTypeModal from '../components/aircraftTypesModal'; 
import SeatMapViewerModal from '../components/seatMapViewerModal'; 
// Importar constantes e interfaces do novo arquivo
import { API_BASE_URL, AircraftType, CreateAircraftTypeDto, UpdateAircraftTypeDto } from '../aircraft-types.constants'; 

// O array initialAircraftTypes é removido e substituído por estado vazio.

const AdminAircraftTypesPage: React.FC = () => {
    // Inicializar com array vazio e adicionar estado de carregamento
    const [aircraftTypes, setAircraftTypes] = useState<AircraftType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // Estados do Modal de Edição/Criação
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [typeToEdit, setTypeToEdit] = useState<AircraftType | null>(null);
    
    // Estados do Modal de Visualização
    const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
    const [typeToView, setTypeToView] = useState<{ type: string; layoutData: string } | null>(null);

    // NOVO: Função para buscar a lista de tipos de aeronave (GET /aircraft-types)
    const fetchAircraftTypes = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<AircraftType[]>(API_BASE_URL); 
            setAircraftTypes(response.data);
        } catch (error) {
            console.error('Error fetching aircraft types:', error);
            alert('Error loading aircraft types list.');
        } finally {
            setIsLoading(false);
        }
    };

    // Chama a busca na montagem do componente
    useEffect(() => {
        fetchAircraftTypes();
    }, []);

    // --- Funções de Edição/Criação ---
    const handleOpenAddModal = () => {
        setTypeToEdit(null);
        setIsEditModalOpen(true);
    };

    const handleOpenEditModal = (type: AircraftType) => {
        setTypeToEdit(type);
        setIsEditModalOpen(true);
    };
    
    // --- Funções de Visualização ---
    const handleViewSeatMap = (type: AircraftType) => {
        setTypeToView({ 
            type: type.type, 
            layoutData: type.layoutData 
        });
        setIsViewerModalOpen(true);
    };


    // ATUALIZADO: Usando axios.delete
    const handleDeleteType = async (id: number, typeName: string) => {
        if (!window.confirm(`Are you sure you want to delete the aircraft type ${typeName}?`)) {
            return;
        }
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            alert(`Aircraft type ${typeName} deleted successfully.`);
            fetchAircraftTypes(); // Recarrega a lista
        } catch (error) {
            console.error('Error deleting aircraft type:', error);
            alert('Error deleting aircraft type. Check the console.');
        }
    };

    // ATUALIZADO: Usando axios.post/patch
    const handleSaveType = async (data: Omit<AircraftType, 'id'>) => {
        try {
            if (typeToEdit) {
                // Edição: PATCH
                await axios.patch(`${API_BASE_URL}/${typeToEdit.id}`, data as UpdateAircraftTypeDto);
                alert('Aircraft type updated successfully!');
            } else {
                // Criação: POST
                await axios.post(API_BASE_URL, data as CreateAircraftTypeDto);
                alert('Aircraft type added successfully!');
            }
            fetchAircraftTypes(); // Recarrega a lista
        } catch (error) {
            console.error(`Error saving aircraft type:`, error);
            alert(`Error saving aircraft type. Check the console.`);
        }
    };

    // NOVO: Estado de Carregamento
    if (isLoading) {
        return (
             <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div style={loadingStyles}>Loading aircraft types...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <AdminTabs />
            <PageContainer>
                <SectionHeader
                    title="Aircraft Types"
                    buttonText="Add New Type"
                    onButtonClick={handleOpenAddModal}
                />
                
                <div className="space-y-4">
                    {aircraftTypes.length === 0 ? (
                        <p className="text-gray-500">Nenhum tipo de aeronave cadastrado.</p>
                    ) : (
                        aircraftTypes.map(type => (
                            <EditableCard
                                key={type.id}
                                type={type.type}
                                seats={type.seats}
                                description={type.description}
                                onViewSeatMap={() => handleViewSeatMap(type)} 
                                onEdit={() => handleOpenEditModal(type)}
                                onDelete={() => handleDeleteType(type.id, type.type)}
                            />
                        ))
                    )}
                </div>

                <AircraftTypeModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveType}
                    aircraftTypeToEdit={typeToEdit}
                />

                <SeatMapViewerModal
                    isOpen={isViewerModalOpen}
                    onClose={() => setIsViewerModalOpen(false)}
                    aircraftTypeData={typeToView}
                />
            </PageContainer>
        </div>
    );
};

export default AdminAircraftTypesPage;

// Estilo para o estado de loading
const loadingStyles: React.CSSProperties = {
    textAlign: 'center', paddingTop: '50px', fontSize: '18px',
    color: '#555',
};