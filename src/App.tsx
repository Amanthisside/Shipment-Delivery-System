import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ShipmentProvider } from './contexts/ShipmentContext';
import AppRouter from './components/AppRouter';

function App() {
  return (
    <AuthProvider>
      <ShipmentProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRouter />
        </div>
      </ShipmentProvider>
    </AuthProvider>
  );
}

export default App;