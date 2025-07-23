import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  packageSize: 'small' | 'medium' | 'large' | 'extra-large';
  packageWeight: number;
  packageDescription: string;
  deliveryType: 'standard' | 'express' | 'overnight';
  status: 'pending' | 'picked-up' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  actualDelivery?: string;
  cost: number;
  createdAt: string;
  userId: string;
  statusHistory: {
    status: string;
    timestamp: string;
    location: string;
    description: string;
  }[];
}

interface ShipmentContextType {
  shipments: Shipment[];
  createShipment: (shipmentData: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'statusHistory'>) => string;
  updateShipmentStatus: (id: string, status: Shipment['status'], location: string, description: string) => void;
  getShipmentById: (id: string) => Shipment | undefined;
  getShipmentByTracking: (trackingNumber: string) => Shipment | undefined;
  getUserShipments: (userId: string) => Shipment[];
}

const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export const useShipments = () => {
  const context = useContext(ShipmentContext);
  if (context === undefined) {
    throw new Error('useShipments must be used within a ShipmentProvider');
  }
  return context;
};

interface ShipmentProviderProps {
  children: ReactNode;
}

export const ShipmentProvider: React.FC<ShipmentProviderProps> = ({ children }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  const shipmentUser = [
    {
        "name": "aa",
        "email": "demo@shiptrack.com",
        "phone": "1234567890",
        "address": "Asksfk",
        "password": "demo123",
        "id": "uix3pmioh"
    }
]
localStorage.setItem('shipment_users',JSON.stringify(shipmentUser))
  useEffect(() => {
    const savedShipments = localStorage.getItem('shipment_data');
    if (savedShipments) {
      setShipments(JSON.parse(savedShipments));
    } else {
      // Initialize with demo data
      const demoShipments: Shipment[] = [
        {
          id: 'demo1',
          trackingNumber: 'SHP001234567',
          senderName: 'John Doe',
          senderAddress: '123 Main St, New York, NY 10001',
          senderPhone: '+1-555-0123',
          receiverName: 'Jane Smith',
          receiverAddress: '456 Oak Ave, Los Angeles, CA 90210',
          receiverPhone: '+1-555-0456',
          packageSize: 'medium',
          packageWeight: 2.5,
          packageDescription: 'Electronics - Laptop',
          deliveryType: 'express',
          status: 'in-transit',
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          cost: 45.99,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          userId: 'demo-user',
          statusHistory: [
            {
              status: 'Package Created',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              location: 'New York, NY',
              description: 'Shipment created and label printed'
            },
            {
              status: 'Picked Up',
              timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
              location: 'New York Distribution Center',
              description: 'Package picked up by carrier'
            },
            {
              status: 'In Transit',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              location: 'Chicago, IL Hub',
              description: 'Package in transit to destination'
            }
          ]
        }
      ];
     
      setShipments(demoShipments);
      localStorage.setItem('shipment_data', JSON.stringify(demoShipments));
      
    }
  }, []);

  const generateTrackingNumber = (): string => {
    const prefix = 'SHP';
    const number = Math.random().toString().substr(2, 9);
    return `${prefix}${number}`;
  };

  const calculateDeliveryDate = (deliveryType: string): string => {
    const now = new Date();
    let days = 5; // standard
    
    if (deliveryType === 'express') days = 2;
    if (deliveryType === 'overnight') days = 1;
    
    const deliveryDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return deliveryDate.toISOString();
  };

  const calculateCost = (packageSize: string, deliveryType: string, weight: number): number => {
    let baseCost = 10;
    
    // Size multiplier
    const sizeMultipliers = { small: 1, medium: 1.5, large: 2, 'extra-large': 3 };
    baseCost *= sizeMultipliers[packageSize as keyof typeof sizeMultipliers];
    
    // Delivery type multiplier
    const deliveryMultipliers = { standard: 1, express: 2, overnight: 3 };
    baseCost *= deliveryMultipliers[deliveryType as keyof typeof deliveryMultipliers];
    
    // Weight additional cost
    baseCost += weight * 2;
    
    return Math.round(baseCost * 100) / 100;
  };

  const createShipment = (shipmentData: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'statusHistory'>): string => {
    const trackingNumber = generateTrackingNumber();
    const estimatedDelivery = calculateDeliveryDate(shipmentData.deliveryType);
    const cost = calculateCost(shipmentData.packageSize, shipmentData.deliveryType, shipmentData.packageWeight);
    
    const newShipment: Shipment = {
      ...shipmentData,
      id: Math.random().toString(36).substr(2, 9),
      trackingNumber,
      estimatedDelivery,
      cost,
      status: 'pending',
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'Package Created',
          timestamp: new Date().toISOString(),
          location: shipmentData.senderAddress.split(',').slice(-2).join(',').trim(),
          description: 'Shipment created successfully'
        }
      ]
    };

    const updatedShipments = [...shipments, newShipment];
    setShipments(updatedShipments);
    localStorage.setItem('shipment_data', JSON.stringify(updatedShipments));
    
    return trackingNumber;
  };

  const updateShipmentStatus = (id: string, status: Shipment['status'], location: string, description: string) => {
    const updatedShipments = shipments.map(shipment => {
      if (shipment.id === id) {
        const newStatusEntry = {
          status: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
          timestamp: new Date().toISOString(),
          location,
          description
        };
        
        return {
          ...shipment,
          status,
          statusHistory: [...shipment.statusHistory, newStatusEntry],
          actualDelivery: status === 'delivered' ? new Date().toISOString() : shipment.actualDelivery
        };
      }
      return shipment;
    });

    setShipments(updatedShipments);
    localStorage.setItem('shipment_data', JSON.stringify(updatedShipments));
  };

  const getShipmentById = (id: string): Shipment | undefined => {
    return shipments.find(shipment => shipment.id === id);
  };

  const getShipmentByTracking = (trackingNumber: string): Shipment | undefined => {
    return shipments.find(shipment => shipment.trackingNumber === trackingNumber);
  };

  const getUserShipments = (userId: string): Shipment[] => {
    return shipments.filter(shipment => shipment.userId === userId);
  };

  const value = {
    shipments,
    createShipment,
    updateShipmentStatus,
    getShipmentById,
    getShipmentByTracking,
    getUserShipments
  };

  return <ShipmentContext.Provider value={value}>{children}</ShipmentContext.Provider>;
};