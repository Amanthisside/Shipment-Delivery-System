import React from 'react';
import { ArrowLeft, Package, User, MapPin, Phone, Calendar, DollarSign, Truck, Download } from 'lucide-react';
import { useShipments } from '../contexts/ShipmentContext';
import { formatDate, formatDateTime, formatCurrency } from '../utils/formatters';

interface ShipmentDetailsProps {
  shipmentId: string;
  onBack: () => void;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ shipmentId, onBack }) => {
  const { getShipmentById } = useShipments();
  const shipment = getShipmentById(shipmentId);

  if (!shipment) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900">Shipment not found</h2>
          <p className="text-gray-600 mt-1">The requested shipment could not be found.</p>
          <button
            onClick={onBack}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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

  const handlePrintLabel = () => {
    const printContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2>Shipping Label</h2>
        <p><strong>Tracking:</strong> ${shipment.trackingNumber}</p>
        <hr>
        <div style="margin: 20px 0;">
          <h3>From:</h3>
          <p>${shipment.senderName}<br>
          ${shipment.senderAddress}<br>
          ${shipment.senderPhone}</p>
        </div>
        <div style="margin: 20px 0;">
          <h3>To:</h3>
          <p>${shipment.receiverName}<br>
          ${shipment.receiverAddress}<br>
          ${shipment.receiverPhone}</p>
        </div>
        <hr>
        <p><strong>Package:</strong> ${shipment.packageDescription}</p>
        <p><strong>Weight:</strong> ${shipment.packageWeight} lbs</p>
        <p><strong>Delivery Type:</strong> ${shipment.deliveryType}</p>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipment Details</h1>
            <p className="text-gray-600 mt-1">Tracking: {shipment.trackingNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(shipment.status)}`}>
            {getStatusLabel(shipment.status)}
          </span>
          <button
            onClick={handlePrintLabel}
            className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Print Label
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sender & Receiver Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sender */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Sender
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-gray-900">{shipment.senderName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-gray-900">{shipment.senderAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{shipment.senderPhone}</p>
                </div>
              </div>
            </div>

            {/* Receiver */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Receiver
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-gray-900">{shipment.receiverName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-gray-900">{shipment.receiverAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{shipment.receiverPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Package Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-purple-600" />
              Package Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-gray-900">{shipment.packageDescription}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Size</p>
                <p className="text-gray-900">{shipment.packageSize.charAt(0).toUpperCase() + shipment.packageSize.slice(1)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Weight</p>
                <p className="text-gray-900">{shipment.packageWeight} lbs</p>
              </div>
            </div>
          </div>

          {/* Tracking History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-orange-600" />
              Tracking History
            </h3>
            <div className="space-y-4">
              {shipment.statusHistory.map((entry, index) => (
                <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex-shrink-0 w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{entry.status}</h4>
                      <span className="text-sm text-gray-500">{formatDateTime(entry.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {entry.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Shipment Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tracking Number</span>
                <span className="text-sm font-medium text-gray-900">{shipment.trackingNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Delivery Type</span>
                <span className="text-sm font-medium text-gray-900">
                  {shipment.deliveryType.charAt(0).toUpperCase() + shipment.deliveryType.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cost</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(shipment.cost)}</span>
              </div>
              <hr />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(shipment.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estimated Delivery</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(shipment.estimatedDelivery)}</span>
              </div>
              {shipment.actualDelivery && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Actual Delivery</span>
                  <span className="text-sm font-medium text-green-600">{formatDate(shipment.actualDelivery)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Important Dates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Important Dates
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Shipment Created</p>
                <p className="text-sm text-gray-600">{formatDateTime(shipment.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                <p className="text-sm text-gray-600">{formatDateTime(shipment.estimatedDelivery)}</p>
              </div>
              {shipment.actualDelivery && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Delivered</p>
                  <p className="text-sm text-green-600">{formatDateTime(shipment.actualDelivery)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Billing Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Billing
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Base Cost</span>
                <span className="text-sm text-gray-900">{formatCurrency(shipment.cost * 0.7)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Delivery Premium</span>
                <span className="text-sm text-gray-900">{formatCurrency(shipment.cost * 0.3)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-medium">
                <span className="text-sm text-gray-900">Total</span>
                <span className="text-sm text-gray-900">{formatCurrency(shipment.cost)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;