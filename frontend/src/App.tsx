
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginPage'; 
import CreateAccountScreen from './pages/CreateAccountPage';
import AircraftsPage from './pages/AdminAircraftsPage'; 
import EmployeesPage from './pages/EmployeesPage';
import HomeScreen from './pages/HomePage';
import AirportsPage from './pages/AirportsPage';
import AdminAircraftTypesPage from './pages/AircraftTypesPage';
import AdminFlightTypesPage from './pages/FlightTypesPage';
import AdminFlightsPage from './pages/FlightsPage';
import UserFlights from './pages/UserFlightsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} /> 
      
      <Route path="/register" element={<CreateAccountScreen />} /> 
      
      <Route path="/admin/aircrafts" element={<AircraftsPage />} />

      <Route path="/admin/employees" element={<EmployeesPage />} />

      <Route path="/admin/airports" element={<AirportsPage />} />

      <Route path="/admin/aircraftTypes" element={<AdminAircraftTypesPage />} />

      <Route path="/admin/flightTypesPage" element={<AdminFlightTypesPage />} />

      <Route path="/admin/flights" element={<AdminFlightsPage />} />
      
      <Route path="/home" element={<HomeScreen/>} />

      <Route path="/my-flights" element={<UserFlights/>}/>
      
      <Route path="*" element={<h1>404 | Página Não Encontrada</h1>} />
    </Routes>
  );
}

export default App;


