// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Importe as páginas que você criou
import LoginScreen from './pages/LoginScreen'; 
import CreateAccountScreen from './pages/createAccountScreen';
import AircraftsPage from './pages/AdminAircraftsPage'; 

function App() {
  return (
    // <Routes> e <Route> configuram o roteamento
    <Routes>
      {/* Rota raiz: Exibe a tela de Login */}
      <Route path="/" element={<LoginScreen />} /> 
      
      {/* Rota /register: Exibe a tela de Criação de Conta */}
      <Route path="/register" element={<CreateAccountScreen />} /> 
      
      {/* Exemplo de rota de administrador (mantida) */}
      <Route path="/admin/aircrafts" element={<AircraftsPage />} />
      
      {/* Opcional: Rota 404 para URLs não encontradas */}
      <Route path="*" element={<h1>404 | Página Não Encontrada</h1>} />
    </Routes>
  );
}

export default App;


