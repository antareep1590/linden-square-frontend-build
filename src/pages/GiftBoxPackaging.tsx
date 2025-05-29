
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Package, Truck, Calendar, Plus, Minus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GiftBoxAssignmentModal from '@/components/GiftBoxAssignmentModal';

interface PackagingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[];
}

interface Gift {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  description: string;
}

const packagingOptions: PackagingOption[] = [
  {
    id: 'wooden-box',
    name: 'Premium Wooden Box',
    description: 'Elegant wooden presentation box with custom engraving',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop',
    features: ['Custom engraving', 'Reusable', 'Premium feel', 'Magnetic closure']
  },
  {
    id: 'luxury-wrap',
    name: 'Luxury Gift Wrap',
    description: 'Professional wrapping with premium paper and ribbon',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop',
    features: ['Premium paper', 'Silk ribbon', 'Gift tag included', 'Tissue paper']
  },
  {
    id: 'branded-sleeve',
    name: 'Branded Sleeve',
    description: 'Custom branded packaging sleeve with your logo',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=300&h=200&fit=crop',
    features: ['Custom branding', 'Eco-friendly', 'Professional look', 'Easy opening']
  },
  {
    id: 'gift-bag',
    name: 'Premium Gift Bag',
    description: 'High-quality paper bag with handles and tissue paper',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=300&h=200&fit=crop',
    features: ['Sturdy handles', 'Tissue paper', 'Gift tag', 'Multiple sizes']
  },
  {
    id: 'eco-box',
    name: 'Eco-Friendly Box',
    description: 'Sustainable packaging made from recycled materials',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    features: ['100% recycled', 'Biodegradable', 'Custom printing', 'Various sizes']
  },
  {
    id: 'signature-box',
    name: 'Signature Collection Box',
    description: 'Our premium signature box with gold foiling',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=300&h=200&fit=crop',
    features: ['Gold foil accents', 'Velvet lining', 'Magnetic closure', 'Premium cardstock']
  }
];

// Mock selected gifts data - in real app this would come from previous step
const mockSelectedGifts = new Map([
  ['1', 3], // Premium Coffee Set - 3 units
  ['2', 2], // Luxury Notebook - 2 units
  ['3', 1], // Wellness Kit - 1 unit
  ['4', 4], // Gourmet Chocolate Box - 4 units
]);

const mockAvailableGifts: Gift[] = [
  {
    id: '1',
    name: 'Premium Coffee Set',
    price: 45.99,
    category: 'Beverages',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
    description: 'Artisanal coffee blend with ceramic mug'
  },
  {
    id: '2',
    name: 'Luxury Notebook',
    price: 29.99,
    category: 'Office',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop',
    description: 'Leather-bound journal with gold accents'
  },
  {
    id: '3',
    name: 'Wellness Kit',
    price: 67.99,
    category: 'Health',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=200&fit=crop',
    description: 'Essential oils and aromatherapy accessories'
  },
  {
    id: '4',
    name: 'Gourmet Chocolate Box',
    price: 39.99,
    category: 'Food',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=300&h=200&fit=crop',
    description: 'Assorted premium chocolates'
  }
];

const GiftBoxPackaging = () => {
  const navigate = useNavigate();
  const [selectedPackaging, setSelectedPackaging] = useState<Map<string, number>>(new Map());
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [currentPackageId, setCurrentPackageId] = useState<string>('');
  const [giftAssignments, setGiftAssignments] = useState<Map<string, Map<string, number>>>(new Map());

  const updatePackagingQuantity = (packagingId: string, newQuantity: number) => {
    const newSelection = new Map(selectedPackaging);
    if (newQuantity <= 0) {
      newSelection.delete(packagingId);
      // Remove assignments for this package
      const newAssignments = new Map(giftAssignments);
      newAssignments.delete(packagingId);
      setGiftAssignments(newAssignments);
    } else {
      newSelection.set(packagingId, newQuantity);
    }
    setSelectedPackaging(newSelection);
  };

  const getPackagingQuantity = (packagingId: string) => {
    return selectedPackaging.get(packagingId) || 0;
  };

  const getTotalSelectedItems = () => {
    return Array.from(selectedPackaging.values()).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalCost = () => {
    let total = 0;
    selectedPackaging.forEach((quantity, packagingId) => {
      const option = packagingOptions.find(opt => opt.id === packagingId);
      if (option) {
        total += option.price * quantity;
      }
    });
    return total.toFixed(2);
  };

  const handleAssignGifts = (packageId: string) => {
    setCurrentPackageId(packageId);
    setShowAssignmentModal(true);
  };

  const handleConfirmAssignment = (packageId: string, assignments: Map<string, number>) => {
    const newAssignments = new Map(giftAssignments);
    newAssignments.set(packageId, assignments);
    setGiftAssignments(newAssignments);
  };

  const getAssignedItemsCount = (packageId: string) => {
    const assignments = giftAssignments.get(packageId);
    if (!assignments) return 0;
    return Array.from(assignments.values()).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getCurrentAssignments = (packageId: string) => {
    return giftAssignments.get(packageId) || new Map();
  };

  const handleContinue = () => {
    if (selectedPackaging.size > 0) {
      navigate('/invoices');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Package Your Gifts</h1>
        <Badge variant="outline" className="text-sm">
          Step 3 of 4
        </Badge>
      </div>

      <div className="text-gray-600">
        <p>Choose how you'd like your gifts to be packaged and delivered.</p>
      </div>

      {/* Selected Gifts Summary */}
      <div className="bg-linden-lightblue p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Selected Gifts to Package:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Array.from(mockSelectedGifts.entries()).map(([giftId, quantity]) => {
            const gift = mockAvailableGifts.find(g => g.id === giftId);
            return (
              <div key={giftId} className="text-sm">
                <span className="font-medium">{gift?.name}</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {quantity}x
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      {/* Packaging Options */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Select Packaging Style</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packagingOptions.map((option) => {
            const quantity = getPackagingQuantity(option.id);
            const isSelected = quantity > 0;
            const assignedItems = getAssignedItemsCount(option.id);
            
            return (
              <Card 
                key={option.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-linden-blue bg-linden-lightblue' : ''
                }`}
                onClick={() => updatePackagingQuantity(option.id, quantity > 0 ? 0 : 1)}
              >
                <CardHeader className="p-0">
                  <div className="relative">
                    <img 
                      src={option.image} 
                      alt={option.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-linden-blue rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                    {assignedItems > 0 && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-linden-gold text-linden-blue">
                          {assignedItems} items
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{option.name}</CardTitle>
                      <span className="text-lg font-bold text-linden-blue">
                        ${option.price}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600">{option.description}</p>
                    
                    <div className="space-y-1">
                      {option.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quantity Controls */}
                    {isSelected && (
                      <div 
                        className="space-y-3 pt-3 border-t"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updatePackagingQuantity(option.id, Math.max(0, quantity - 1))}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium text-lg min-w-[2ch] text-center">
                            {quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updatePackagingQuantity(option.id, quantity + 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {/* Assign Gifts Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignGifts(option.id)}
                          className="w-full flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Assign Gifts {assignedItems > 0 && `(${assignedItems} assigned)`}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Delivery Options */}
      {selectedPackaging.size > 0 && (
        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold">Delivery Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Delivery Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Special Instructions</label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special delivery instructions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none h-20"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-4 mt-4">
            <div className="space-y-3">
              <h3 className="font-semibold">Packaging Summary</h3>
              {Array.from(selectedPackaging.entries()).map(([packagingId, quantity]) => {
                const option = packagingOptions.find(opt => opt.id === packagingId);
                if (!option) return null;
                
                return (
                  <div key={packagingId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-linden-blue" />
                      <div>
                        <p className="font-medium">{option.name} x {quantity}</p>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-linden-blue">${(option.price * quantity).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">${option.price} each</p>
                    </div>
                  </div>
                );
              })}
              
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold">Total Packaging Cost:</span>
                <span className="text-xl font-bold text-linden-blue">${getTotalCost()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/add-personalization')}>
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={selectedPackaging.size === 0}
          className="bg-linden-blue hover:bg-linden-blue/90"
        >
          Continue to Review & Pay ({getTotalSelectedItems()} packages)
        </Button>
      </div>

      {/* Gift Assignment Modal */}
      <GiftBoxAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        packageId={currentPackageId}
        packageName={packagingOptions.find(p => p.id === currentPackageId)?.name || ''}
        selectedGifts={mockSelectedGifts}
        availableGifts={mockAvailableGifts}
        onAssignGifts={handleConfirmAssignment}
        currentAssignments={getCurrentAssignments(currentPackageId)}
      />
    </div>
  );
};

export default GiftBoxPackaging;
