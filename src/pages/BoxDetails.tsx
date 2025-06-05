import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Gift, Package } from 'lucide-react';
import ExpandedGiftCatalog from '@/components/ExpandedGiftCatalog';

interface BoxGift {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
  included: boolean;
  quantity: number;
}

interface BoxDetails {
  id: string;
  name: string;
  image: string;
  size: string;
  theme: string;
  description: string;
  rating: number;
  basePrice: number;
  gifts: BoxGift[];
}

// Mock data for the preset box
const mockBoxDetails: BoxDetails = {
  id: 'preset-1',
  name: 'Birthday Celebration Box',
  image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=600&h=400&fit=crop',
  size: 'Medium',
  theme: 'Birthday',
  description: 'A carefully curated birthday celebration box with premium gifts and festive touches to make any birthday special.',
  rating: 4.8,
  basePrice: 85.00,
  gifts: [
    {
      id: '1',
      name: 'Premium Coffee Set',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
      price: 24.99,
      description: 'Artisan coffee selection with premium brewing accessories',
      category: 'Beverages',
      included: true,
      quantity: 1
    },
    {
      id: '2',
      name: 'Gourmet Chocolate Box',
      image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=300&h=200&fit=crop',
      price: 19.99,
      description: 'Hand-selected premium chocolates',
      category: 'Food',
      included: true,
      quantity: 1
    },
    {
      id: '3',
      name: 'Scented Candle',
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop',
      price: 15.99,
      description: 'Luxury scented candle with 40-hour burn time',
      category: 'Home',
      included: true,
      quantity: 1
    }
  ]
};

const BoxDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [boxDetails, setBoxDetails] = useState<BoxDetails>(mockBoxDetails);
  const [selectedGifts, setSelectedGifts] = useState<Map<string, number>>(
    new Map(boxDetails.gifts.filter(g => g.included).map(g => [g.id, g.quantity]))
  );

  const updateGiftQuantity = (giftId: string, newQuantity: number, included: boolean) => {
    const newSelectedGifts = new Map(selectedGifts);
    if (included && newQuantity > 0) {
      newSelectedGifts.set(giftId, newQuantity);
    } else {
      newSelectedGifts.delete(giftId);
    }
    setSelectedGifts(newSelectedGifts);
  };

  const calculateTotal = () => {
    let giftsTotal = 0;
    selectedGifts.forEach((quantity, giftId) => {
      const gift = boxDetails.gifts.find(g => g.id === giftId);
      if (gift) {
        giftsTotal += gift.price * quantity;
      } else {
        // Handle gifts from expanded catalog with mock prices
        const mockPrices: { [key: string]: number } = {
          '4': 29.99, '5': 34.99, '6': 45.99, '7': 27.99, '8': 39.99
        };
        giftsTotal += (mockPrices[giftId] || 25.00) * quantity;
      }
    });
    return boxDetails.basePrice + giftsTotal;
  };

  const getIncludedGiftsCount = () => {
    return Array.from(selectedGifts.values()).reduce((sum, quantity) => sum + quantity, 0);
  };

  const handlePersonalize = () => {
    navigate('/personalization', { 
      state: { 
        boxDetails,
        selectedGifts: Array.from(selectedGifts.entries()).map(([id, quantity]) => ({ id, quantity }))
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/box-listing')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Boxes
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{boxDetails.name}</h1>
          <p className="text-gray-600">Customize your preset box</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Box Preview */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <img 
              src={boxDetails.image} 
              alt={boxDetails.name}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{boxDetails.size}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm">{boxDetails.rating}</span>
                </div>
              </div>
              <Badge className="bg-linden-blue">{boxDetails.theme}</Badge>
              <p className="text-sm text-gray-600">{boxDetails.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Gift Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Customize Your Gifts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExpandedGiftCatalog
              gifts={[]}
              selectedGifts={selectedGifts}
              onUpdateQuantity={updateGiftQuantity}
            />
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Box Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Base Box ({boxDetails.size} {boxDetails.theme})</span>
              <span>${boxDetails.basePrice.toFixed(2)}</span>
            </div>
            {Array.from(selectedGifts.entries()).map(([giftId, quantity]) => {
              const gift = boxDetails.gifts.find(g => g.id === giftId);
              const name = gift?.name || `Gift ${giftId}`;
              const price = gift?.price || 25.00;
              return (
                <div key={giftId} className="flex justify-between text-sm">
                  <span>{name} (x{quantity})</span>
                  <span>${(price * quantity).toFixed(2)}</span>
                </div>
              );
            })}
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total ({getIncludedGiftsCount()} items)</span>
              <span className="text-linden-blue">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <Button 
            onClick={handlePersonalize}
            className="w-full mt-6 bg-linden-blue hover:bg-linden-blue/90"
            disabled={getIncludedGiftsCount() === 0}
          >
            Continue to Personalization
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoxDetails;
