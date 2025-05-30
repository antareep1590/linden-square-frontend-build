
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Minus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Gift {
  id: string;
  name: string;
  image: string;
  quantity: number;
}

interface GiftAssignmentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBox: {
    id: string;
    name: string;
    image: string;
    capacity: number;
  } | null;
}

const availableGifts: Gift[] = [
  {
    id: '1',
    name: 'Premium Coffee Set',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
    quantity: 0,
  },
  {
    id: '2',
    name: 'Luxury Notebook',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop',
    quantity: 0,
  },
  {
    id: '3',
    name: 'Wellness Kit',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=200&fit=crop',
    quantity: 0,
  },
  {
    id: '4',
    name: 'Gourmet Chocolate Box',
    image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=300&h=200&fit=crop',
    quantity: 0,
  },
];

const GiftAssignmentPanel: React.FC<GiftAssignmentPanelProps> = ({
  isOpen,
  onClose,
  selectedBox,
}) => {
  const [gifts, setGifts] = useState<Gift[]>(availableGifts);

  const updateGiftQuantity = (giftId: string, newQuantity: number) => {
    setGifts(gifts.map(gift => 
      gift.id === giftId ? { ...gift, quantity: Math.max(0, newQuantity) } : gift
    ));
  };

  const getTotalItems = () => {
    return gifts.reduce((sum, gift) => sum + gift.quantity, 0);
  };

  const handleSaveAssignment = () => {
    console.log('Saving gift assignment:', { selectedBox, gifts });
    onClose();
  };

  if (!isOpen || !selectedBox) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/20" onClick={onClose} />
      
      {/* Side Panel */}
      <div className="w-96 bg-white shadow-xl h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Assign Gifts to Box</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Box Info */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Selected Box</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <img 
                  src={selectedBox.image} 
                  alt={selectedBox.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-medium">{selectedBox.name}</h3>
                  <p className="text-sm text-gray-500">
                    Capacity: {selectedBox.capacity} items
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {getTotalItems()}/{selectedBox.capacity} assigned
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="mb-6" />

          {/* Available Gifts */}
          <div className="space-y-4">
            <h3 className="font-medium">Available Gifts</h3>
            {gifts.map((gift) => (
              <Card key={gift.id} className="p-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={gift.image} 
                    alt={gift.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{gift.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGiftQuantity(gift.id, gift.quantity - 1)}
                      disabled={gift.quantity === 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {gift.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGiftQuantity(gift.id, gift.quantity + 1)}
                      disabled={getTotalItems() >= selectedBox.capacity}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <Card className="mt-6 bg-gray-50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total Items:</span>
                <span>{getTotalItems()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Capacity Used:</span>
                <span className={getTotalItems() > selectedBox.capacity ? 'text-red-500' : 'text-green-600'}>
                  {Math.round((getTotalItems() / selectedBox.capacity) * 100)}%
                </span>
              </div>
              {getTotalItems() > selectedBox.capacity && (
                <p className="text-red-500 text-xs mt-2">
                  Exceeds box capacity by {getTotalItems() - selectedBox.capacity} items
                </p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAssignment}
              className="flex-1"
              disabled={getTotalItems() === 0 || getTotalItems() > selectedBox.capacity}
            >
              Save Assignment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftAssignmentPanel;
