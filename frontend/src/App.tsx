// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginPage'; 
import CreateAccountScreen from './pages/CreateAccountPage';
import AircraftsPage from './pages/AdminAircraftsPage'; 
import EmployeesPage from './pages/EmployeesPage';
import HomeScreen from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} /> 
      
      <Route path="/register" element={<CreateAccountScreen />} /> 
      
      <Route path="/admin/aircrafts" element={<AircraftsPage />} />

      <Route path="/admin/employees" element={<EmployeesPage />} />

      <Route path="/home" element={<HomeScreen/>} />
      
      <Route path="*" element={<h1>404 | Página Não Encontrada</h1>} />
    </Routes>
  );
}

export default App;


