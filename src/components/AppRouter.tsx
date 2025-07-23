import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../pages/Dashboard';
import CreateShipment from '../pages/CreateShipment';
import TrackShipment from '../pages/TrackShipment';
import ShipmentDetails from '../pages/ShipmentDetails';
import Navbar from './layout/Navbar';
import { useState } from 'react';

const AppRouter: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'register') {
      return <RegisterPage onSwitchToLogin={() => setCurrentPage('login')} />;
    }
    return <LoginPage onSwitchToRegister={() => setCurrentPage('register')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'create':
        return <CreateShipment onBack={() => setCurrentPage('dashboard')} />;
      case 'track':
        return <TrackShipment onBack={() => setCurrentPage('dashboard')} />;
      case 'details':
        return selectedShipmentId ? (
          <ShipmentDetails 
            shipmentId={selectedShipmentId} 
            onBack={() => setCurrentPage('dashboard')} 
          />
        ) : (
          <Dashboard 
            onNavigate={(page, shipmentId) => {
              setCurrentPage(page);
              if (shipmentId) setSelectedShipmentId(shipmentId);
            }} 
          />
        );
      default:
        return (
          <Dashboard 
            onNavigate={(page, shipmentId) => {
              setCurrentPage(page);
              if (shipmentId) setSelectedShipmentId(shipmentId);
            }} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onNavigate={(page) => {
          setCurrentPage(page);
          setSelectedShipmentId(null);
        }} 
        currentPage={currentPage}
      />
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default AppRouter;