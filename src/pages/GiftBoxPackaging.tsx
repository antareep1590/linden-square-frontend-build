
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Check, Gift } from 'lucide-react';
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

// Mock selected gifts data
const mockSelectedGifts: SelectedGift[] = [
  { id: '1', name: 'Premium Coffee Set', quantity: 3 },
  { id: '2', name: 'Luxury Notebook', quantity: 2 },
  { id: '3', name: 'Wellness Kit', quantity: 1 },
  { id: '4', name: 'Gourmet Chocolate Box', quantity: 4 },
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Packaging & Delivery</h1>
          <p className="text-gray-500">
            Select gift boxes and assign your gifts for delivery.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-2xl font-bold text-linden-blue">${getTotalCost().toFixed(2)}</p>
        </div>
      </div>

      {/* Selected Gifts Summary */}
      <Card className="bg-linden-lightblue border-linden-blue">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-linden-blue">
            <Gift className="h-5 w-5" />
            Selected Gifts Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                Total Items: {getTotalSelectedItems()}
              </p>
              <p className="text-sm text-gray-600">
                {selectedGifts.length} different gift types selected
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {selectedGifts.map((gift) => (
              <div key={gift.id} className="flex items-center justify-between bg-white rounded-lg p-3 border">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{gift.name}</p>
                  <p className="text-xs text-gray-500">Quantity: {gift.quantity}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {gift.quantity}x
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gift Box Selection */}
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
                <Button className="mt-2">Continue to Shipping</Button>
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
