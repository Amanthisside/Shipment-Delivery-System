import React, { useState } from 'react';
import { ArrowLeft, Package, User, MapPin, Phone, Scale, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useShipments } from '../contexts/ShipmentContext';

interface CreateShipmentProps {
  onBack: () => void;
}

const CreateShipment: React.FC<CreateShipmentProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { createShipment } = useShipments();
  
  const [formData, setFormData] = useState({
    senderName: user?.name || '',
    senderAddress: user?.address || '',
    senderPhone: user?.phone || '',
    receiverName: '',
    receiverAddress: '',
    receiverPhone: '',
    packageSize: 'medium' as 'small' | 'medium' | 'large' | 'extra-large',
    packageWeight: 1,
    packageDescription: '',
    deliveryType: 'standard' as 'standard' | 'express' | 'overnight'
  });

  const [estimatedCost, setEstimatedCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const packageSizes = [
    { value: 'small', label: 'Small', description: 'Up to 1 lb' },
    { value: 'medium', label: 'Medium', description: '1-5 lbs' },
    { value: 'large', label: 'Large', description: '5-15 lbs' },
    { value: 'extra-large', label: 'Extra Large', description: '15+ lbs' }
  ];

  const deliveryTypes = [
    { value: 'standard', label: 'Standard', description: '5-7 business days', multiplier: 1 },
    { value: 'express', label: 'Express', description: '2-3 business days', multiplier: 2 },
    { value: 'overnight', label: 'Overnight', description: 'Next business day', multiplier: 3 }
  ];

  React.useEffect(() => {
    // Calculate estimated cost
    let baseCost = 10;
    const sizeMultipliers = { small: 1, medium: 1.5, large: 2, 'extra-large': 3 };
    const deliveryMultipliers = { standard: 1, express: 2, overnight: 3 };
    
    baseCost *= sizeMultipliers[formData.packageSize];
    baseCost *= deliveryMultipliers[formData.deliveryType];
    baseCost += formData.packageWeight * 2;
    
    setEstimatedCost(Math.round(baseCost * 100) / 100);
  }, [formData.packageSize, formData.deliveryType, formData.packageWeight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'packageWeight' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const tracking = createShipment({
        ...formData,
        userId: user?.id || '',
        cost: estimatedCost
      });
      
      setTrackingNumber(tracking);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating shipment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <Package className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipment Created Successfully!</h2>
          <p className="text-gray-600 mb-6">Your package has been scheduled for pickup.</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-blue-900 mb-2">Tracking Number:</p>
            <p className="text-lg font-bold text-blue-700">{trackingNumber}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={onBack}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(trackingNumber);
                alert('Tracking number copied to clipboard!');
              }}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Copy Tracking Number
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Create New Shipment</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sender Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Sender Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="senderPhone"
                    value={formData.senderPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="senderAddress"
                    value={formData.senderAddress}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Receiver Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Receiver Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="receiverName"
                    value={formData.receiverName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="receiverPhone"
                    value={formData.receiverPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    name="receiverAddress"
                    value={formData.receiverAddress}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Package Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Package Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Package Size
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {packageSizes.map((size) => (
                      <label
                        key={size.value}
                        className={`cursor-pointer border-2 rounded-lg p-3 text-center transition-colors ${
                          formData.packageSize === size.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="packageSize"
                          value={size.value}
                          checked={formData.packageSize === size.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="font-medium">{size.label}</div>
                        <div className="text-xs text-gray-500">{size.description}</div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (lbs)
                    </label>
                    <div className="relative">
                      <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        name="packageWeight"
                        value={formData.packageWeight}
                        onChange={handleChange}
                        min="0.1"
                        step="0.1"
                        required
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Type
                    </label>
                    <select
                      name="deliveryType"
                      value={formData.deliveryType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {deliveryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label} - {type.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Description
                  </label>
                  <textarea
                    name="packageDescription"
                    value={formData.packageDescription}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Describe the contents of your package..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Order Summary
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package Size:</span>
                  <span className="font-medium">{formData.packageSize.charAt(0).toUpperCase() + formData.packageSize.slice(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{formData.packageWeight} lbs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Type:</span>
                  <span className="font-medium">{deliveryTypes.find(t => t.value === formData.deliveryType)?.label}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Estimated Cost:</span>
                  <span className="text-blue-600">${estimatedCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="text-xs text-gray-500">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Estimated delivery: {deliveryTypes.find(t => t.value === formData.deliveryType)?.description}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Shipment...
                    </div>
                  ) : (
                    'Create Shipment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateShipment;