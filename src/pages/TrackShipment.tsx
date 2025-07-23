import React, { useState } from 'react';
import { ArrowLeft, Search, Package, MapPin, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { useShipments, Shipment } from '../contexts/ShipmentContext';
import { formatDate, formatDateTime } from '../utils/formatters';

interface TrackShipmentProps {
  onBack: () => void;
}

const TrackShipment: React.FC<TrackShipmentProps> = ({ onBack }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const { getShipmentByTracking } = useShipments();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsSearching(true);
    setError('');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundShipment = getShipmentByTracking(trackingNumber.trim());
    
    if (foundShipment) {
      setShipment(foundShipment);
    } else {
      setError('Shipment not found. Please check your tracking number and try again.');
      setShipment(null);
    }
    
    setIsSearching(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'picked-up':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'in-transit':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'out-for-delivery':
        return <MapPin className="h-5 w-5 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'picked-up': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-transit': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'out-for-delivery': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getProgressPercentage = (status: string) => {
    const statusOrder = ['pending', 'picked-up', 'in-transit', 'out-for-delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Track Your Shipment</h1>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Tracking Number
            </label>
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="tracking"
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g., SHP123456789"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSearching ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  'Track'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Demo Tracking Numbers */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-2">Try these demo tracking numbers:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTrackingNumber('SHP001234567')}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
            >
              SHP001234567
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tracking Results */}
      {shipment && (
        <div className="space-y-6">
          {/* Shipment Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Shipment Details</h2>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(shipment.status)}`}>
                {getStatusLabel(shipment.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Tracking Number</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{shipment.trackingNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">From</p>
                <p className="mt-1 text-gray-900">{shipment.senderName}</p>
                <p className="text-sm text-gray-500">{shipment.senderAddress.split(',')[0]}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">To</p>
                <p className="mt-1 text-gray-900">{shipment.receiverName}</p>
                <p className="text-sm text-gray-500">{shipment.receiverAddress.split(',')[0]}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                <p className="mt-1 text-gray-900">{formatDate(shipment.estimatedDelivery)}</p>
                {shipment.actualDelivery && (
                  <p className="text-sm text-green-600">Delivered: {formatDate(shipment.actualDelivery)}</p>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{Math.round(getProgressPercentage(shipment.status))}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage(shipment.status)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Tracking History</h3>
            <div className="space-y-4">
              {shipment.statusHistory.map((entry, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(entry.status.toLowerCase().replace(' ', '-'))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{entry.status}</p>
                      <p className="text-sm text-gray-500">{formatDateTime(entry.timestamp)}</p>
                    </div>
                    <p className="text-sm text-gray-600">{entry.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {entry.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Package Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Size & Weight</p>
                <p className="mt-1 text-gray-900">
                  {shipment.packageSize.charAt(0).toUpperCase() + shipment.packageSize.slice(1)} • {shipment.packageWeight} lbs
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Delivery Type</p>
                <p className="mt-1 text-gray-900">
                  {shipment.deliveryType.charAt(0).toUpperCase() + shipment.deliveryType.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1 text-gray-900">{shipment.packageDescription}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackShipment;