
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Gift, Plus, Minus, Package } from 'lucide-react';

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
    },
    {
      id: '4',
      name: 'Wellness Kit',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=200&fit=crop',
      price: 29.99,
      description: 'Complete wellness package with aromatherapy essentials',
      category: 'Health',
      included: false,
      quantity: 0
    }
  ]
};

const BoxDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [boxDetails, setBoxDetails] = useState<BoxDetails>(mockBoxDetails);

  const updateGiftQuantity = (giftId: string, newQuantity: number, included: boolean) => {
    setBoxDetails(prev => ({
      ...prev,
      gifts: prev.gifts.map(gift => 
        gift.id === giftId 
          ? { ...gift, quantity: Math.max(0, newQuantity), included }
          : gift
      )
    }));
  };

  const calculateTotal = () => {
    const giftsTotal = boxDetails.gifts
      .filter(gift => gift.included && gift.quantity > 0)
      .reduce((sum, gift) => sum + (gift.price * gift.quantity), 0);
    return boxDetails.basePrice + giftsTotal;
  };

  const getIncludedGiftsCount = () => {
    return boxDetails.gifts.filter(gift => gift.included && gift.quantity > 0).length;
  };

  const handlePersonalize = () => {
    navigate('/recipient-selection', { 
      state: { 
        boxDetails,
        selectedGifts: boxDetails.gifts.filter(gift => gift.included && gift.quantity > 0)
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
            <div className="space-y-4">
              {boxDetails.gifts.map((gift) => (
                <div 
                  key={gift.id}
                  className={`border rounded-lg p-4 transition-all ${
                    gift.included ? 'border-linden-blue bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={gift.image} 
                      alt={gift.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{gift.name}</h4>
                      <p className="text-sm text-gray-600">{gift.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{gift.category}</Badge>
                        <span className="font-bold text-linden-blue">${gift.price}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {gift.included ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateGiftQuantity(gift.id, gift.quantity - 1, gift.quantity > 1)}
                            disabled={gift.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{gift.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateGiftQuantity(gift.id, gift.quantity + 1, true)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateGiftQuantity(gift.id, 0, false)}
                            className="ml-2"
                          >
                            Remove
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateGiftQuantity(gift.id, 1, true)}
                          className="bg-linden-blue text-white hover:bg-linden-blue/90"
                        >
                          Add to Box
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            {boxDetails.gifts
              .filter(gift => gift.included && gift.quantity > 0)
              .map(gift => (
                <div key={gift.id} className="flex justify-between text-sm">
                  <span>{gift.name} (x{gift.quantity})</span>
                  <span>${(gift.price * gift.quantity).toFixed(2)}</span>
                </div>
              ))}
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
            Continue to Recipients
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoxDetails;
