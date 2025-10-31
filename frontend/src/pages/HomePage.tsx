import { useAuth } from '../contexts/AuthContext'; 
import React from 'react';
import Navbar from "../components/layouts/navbar"; 
import PageContainer from "../components/layouts/pageContainer"; 

const HomeScreen: React.FC = () => {
    const { user } = useAuth(); 

    if (!user) {
        return (
             <div className="min-h-screen bg-gray-50">
                <Navbar />
                <PageContainer>
                    <div style={pageStyles.loading}>Carregando dados do usuário...</div>
                </PageContainer>
            </div>
        );
    }

    return(
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <PageContainer>
                <h1 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-2">Bem-vindo, {user.name}!</h1>
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800">Detalhes do Usuário:</h2>
                    <p className="text-gray-600"><strong>Nome:</strong> {user.name}</p>
                    <p className="text-gray-600"><strong>E-mail:</strong> {user.email}</p>
                    <p className="text-gray-600"><strong>ID:</strong> {user.id}</p>
                    <p className="text-gray-600"><strong>Tipo de Usuário:</strong> {user.type === 'admin' ? 'Administrador' : 'Usuário Padrão'}</p>
                </div>
            </PageContainer>
        </div>
    )
};
export default HomeScreen;

const pageStyles: any = {
    loading: {
        textAlign: 'center', paddingTop: '50px', fontSize: '18px',
        color: '#555',
    }
};