import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Check, Gift, ShoppingBag } from 'lucide-react';
import GiftAssignmentPanel from '@/components/GiftAssignmentPanel';

interface GiftBox {
  id: string;
  name: string;
  image: string;
  capacity: number;
  price: number;
  description: string;
  assigned?: boolean;
}

interface SelectedGift {
  id: string;
  name: string;
  quantity: number;
  image: string;
  price: number;
}

const giftBoxes: GiftBox[] = [
  {
    id: '1',
    name: 'Premium Gift Box',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    capacity: 5,
    price: 24.99,
    description: 'Elegant premium box perfect for corporate gifts',
  },
  {
    id: '2',
    name: 'Luxury Gift Box',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    capacity: 8,
    price: 39.99,
    description: 'Spacious luxury box with premium finishing',
  },
  {
    id: '3',
    name: 'Deluxe Gift Box',
    image: 'https://images.unsplash.com/photo-1607344645866-009c7d0a734f?w=400&h=300&fit=crop',
    capacity: 3,
    price: 18.99,
    description: 'Compact deluxe box for smaller gift collections',
  },
  {
    id: '4',
    name: 'Executive Gift Box',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    capacity: 10,
    price: 49.99,
    description: 'Large executive box for extensive gift packages',
  },
];

// Mock selected gifts data with images
const mockSelectedGifts: SelectedGift[] = [
  { 
    id: '1', 
    name: 'Premium Coffee Set', 
    quantity: 3, 
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop',
    price: 49.99
  },
  { 
    id: '2', 
    name: 'Luxury Notebook', 
    quantity: 2, 
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=100&fit=crop',
    price: 29.99
  },
  { 
    id: '3', 
    name: 'Wellness Kit', 
    quantity: 1, 
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100&h=100&fit=crop',
    price: 79.99
  },
  { 
    id: '4', 
    name: 'Gourmet Chocolate Box', 
    quantity: 4, 
    image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=100&h=100&fit=crop',
    price: 39.99
  },
];

const GiftBoxPackaging = () => {
  const [selectedBoxes, setSelectedBoxes] = useState<Set<string>>(new Set());
  const [assignmentPanelOpen, setAssignmentPanelOpen] = useState(false);
  const [selectedBoxForAssignment, setSelectedBoxForAssignment] = useState<GiftBox | null>(null);
  const [selectedGifts] = useState<SelectedGift[]>(mockSelectedGifts);

  const toggleBoxSelection = (boxId: string) => {
    const newSelection = new Set(selectedBoxes);
    if (newSelection.has(boxId)) {
      newSelection.delete(boxId);
    } else {
      newSelection.add(boxId);
    }
    setSelectedBoxes(newSelection);
  };

  const handleAssignGifts = (box: GiftBox) => {
    setSelectedBoxForAssignment(box);
    setAssignmentPanelOpen(true);
  };

  const getTotalCost = () => {
    return Array.from(selectedBoxes).reduce((total, boxId) => {
      const box = giftBoxes.find(b => b.id === boxId);
      return total + (box?.price || 0);
    }, 0);
  };

  const getTotalSelectedItems = () => {
    return selectedGifts.reduce((total, gift) => total + gift.quantity, 0);
  };

  const getTotalGiftValue = () => {
    return selectedGifts.reduce((total, gift) => total + (gift.price * gift.quantity), 0);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Packaging & Delivery</h1>
          <p className="text-gray-600 text-lg">
            Select gift boxes and assign your gifts for delivery.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Packaging Cost</p>
          <p className="text-2xl font-bold text-linden-blue">${getTotalCost().toFixed(2)}</p>
        </div>
      </div>

      {/* Enhanced Selected Gifts Summary */}
      <Card className="bg-gradient-to-r from-linden-lightblue to-white border-linden-blue shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linden-blue rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-linden-blue">Selected Gifts Summary</CardTitle>
                <p className="text-sm text-gray-600">Items ready for packaging</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white rounded-lg p-3 border border-linden-blue/20">
                <p className="text-2xl font-bold text-linden-blue">{getTotalSelectedItems()}</p>
                <p className="text-xs text-gray-500">Total Items</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{selectedGifts.length}</p>
                  <p className="text-sm text-gray-600">Gift Types</p>
                </div>
                <Gift className="h-8 w-8 text-linden-blue" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">${getTotalGiftValue().toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Total Gift Value</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedGifts.map((gift) => (
              <div key={gift.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <img 
                    src={gift.image} 
                    alt={gift.name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{gift.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">Qty: {gift.quantity}</span>
                      <Badge variant="secondary" className="text-xs bg-linden-lightblue text-linden-blue">
                        ${(gift.price * gift.quantity).toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gift Box Selection */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Gift Boxes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftBoxes.map((box) => {
            const isSelected = selectedBoxes.has(box.id);
            
            return (
              <Card 
                key={box.id} 
                className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  isSelected ? 'ring-2 ring-linden-blue bg-linden-lightblue' : ''
                }`}
                onClick={() => toggleBoxSelection(box.id)}
              >
                <CardHeader className="p-0">
                  <div className="relative">
                    <img 
                      src={box.image} 
                      alt={box.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      {isSelected && (
                        <div className="bg-linden-blue text-white rounded-full w-8 h-8 flex items-center justify-center">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{box.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {box.capacity} items
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600">{box.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-linden-blue">
                        ${box.price}
                      </span>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Capacity: {box.capacity}</span>
                      </div>
                    </div>

                    {/* Assign Gifts Button */}
                    {isSelected && (
                      <div className="pt-3 border-t">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignGifts(box);
                          }}
                        >
                          Assign Gifts to This Box
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

      {/* Summary */}
      {selectedBoxes.size > 0 && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Selected Boxes</h3>
                <p className="text-sm text-gray-500">
                  {selectedBoxes.size} box(es) selected
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${getTotalCost().toFixed(2)}</p>
                <Button className="mt-2 bg-linden-blue hover:bg-linden-blue/90">Continue to Shipping</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gift Assignment Panel */}
      <GiftAssignmentPanel
        isOpen={assignmentPanelOpen}
        onClose={() => setAssignmentPanelOpen(false)}
        selectedBox={selectedBoxForAssignment}
      />
    </div>
  );
};

export default GiftBoxPackaging;
