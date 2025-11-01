import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/layouts/navbar";
import PageContainer from "../components/layouts/pageContainer";
import SectionHeader from "../components/layouts/sectionHeader";
import DataCard from "../components/cards/DataCard";
import DangerButton from "../components/buttons/dangerButton";
import { AdminTabs } from '../components/layouts/adminTabs';
import AircraftModal from '../components/aircraftModal'; // Modal para CRUD de Aeronaves
import { API_BASE_URL as AIRCRAFTS_API, Aircraft, CreateAircraftDto, UpdateAircraftDto } from '../aircrafts.constants'; // API Aeronaves
import { API_BASE_URL as TYPES_API, AircraftType } from '../aircraft-types.constants'; // API Tipos de Aeronave

export default function AdminAircraftsPage() {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [aircraftTypes, setAircraftTypes] = useState<AircraftType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aircraftToEdit, setAircraftToEdit] = useState<Aircraft | null>(null);

  // --- Funções de API ---

  // 1. Busca a lista de Aeronaves e Tipos
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Busca Aeronaves
      const aircraftsResponse = await axios.get<Aircraft[]>(AIRCRAFTS_API);
      
      // Busca Tipos de Aeronave (para o DDL)
      const typesResponse = await axios.get<AircraftType[]>(TYPES_API);

      setAircrafts(aircraftsResponse.data);
      setAircraftTypes(typesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading aircraft data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 2. Função de Salvar/Atualizar (passada para o modal)
  const handleSaveAircraft = async (data: CreateAircraftDto | UpdateAircraftDto) => {
    // ... Aqui estaria a lógica axios.post ou axios.patch do modal ...
    await fetchAllData(); // Recarrega os dados após salvar
  };

  // 3. Função de Exclusão
  const handleDeleteAircraft = async (id: string, type: string) => {
    if (!window.confirm(`Are you sure you want to delete aircraft ${id} (${type})?`)) {
      return;
    }
    try {
      await axios.delete(`${AIRCRAFTS_API}/${id}`);
      alert(`Aircraft ${id} deleted successfully.`);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting aircraft:', error);
      alert('Error deleting aircraft. Check the console.');
    }
  };

  // --- Funções de Modal ---
  const handleAdd = () => {
    setAircraftToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (aircraft: Aircraft) => {
    setAircraftToEdit(aircraft);
    setIsModalOpen(true);
  };
  
  // --- Renderização ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div style={loadingStyles}>Loading aircraft data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AdminTabs />
      <PageContainer>
        <SectionHeader 
          title="Aircrafts" 
          buttonText="Add new aircraft" 
          onButtonClick={handleAdd} 
        />
        
        {aircrafts.length === 0 && <p className="text-gray-500">Nenhuma aeronave cadastrada.</p>}

        {aircrafts.map((a) => (
          <DataCard
            key={a.id}
            actions={
              <>
                <button 
                  onClick={() => handleEdit(a)} 
                  className="text-blue-800 hover:text-blue-900 p-1 rounded transition"
                  title="Edit Aircraft"
                >
                  ✏️
                </button>
                <DangerButton onClick={() => handleDeleteAircraft(a.id, a.aircraftType.type)}>🗑️</DangerButton>
              </>
            }
          >
            <div className="flex justify-between w-full">
              <span className="font-medium">{a.id}</span>
              <span className="text-gray-700">{a.aircraftType.type}</span>
            </div>
          </DataCard>
        ))}
      </PageContainer>

      {/* Modal de Adição/Edição de Aeronaves */}
      <AircraftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAircraftSaved={fetchAllData}
        aircraftToEdit={aircraftToEdit}
        aircraftTypes={aircraftTypes} // Passa a lista de tipos
      />
    </div>
  );
}

const loadingStyles: React.CSSProperties = {
    textAlign: 'center', paddingTop: '50px', fontSize: '18px',
    color: '#555',
};
