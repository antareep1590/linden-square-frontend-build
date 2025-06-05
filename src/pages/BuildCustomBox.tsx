import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Package, Gift, Plus, Minus, ShoppingCart } from 'lucide-react';

interface CustomBoxGift {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
}

interface CustomBoxConfig {
  size: 'Small' | 'Medium' | 'Large' | '';
  theme: string;
  gifts: CustomBoxGift[];
}

const availableGifts = [
  {
    id: '1',
    name: 'Premium Coffee Set',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
    price: 49.99,
    category: 'Beverages'
  },
  {
    id: '2',
    name: 'Luxury Notebook',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop',
    price: 29.99,
    category: 'Stationery'
  },
  {
    id: '3',
    name: 'Wellness Kit',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=200&fit=crop',
    price: 79.99,
    category: 'Health'
  },
  {
    id: '4',
    name: 'Gourmet Chocolate Box',
    image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=300&h=200&fit=crop',
    price: 39.99,
    category: 'Food'
  }
];

const themes = ['No Theme', 'Birthday', 'Professional', 'Holiday', 'Wellness', 'Luxury'];
const boxSizes = [
  { value: 'Small', price: 15, description: 'Fits 2-4 items' },
  { value: 'Medium', price: 25, description: 'Fits 4-6 items' },
  { value: 'Large', price: 35, description: 'Fits 6-8 items' }
];

const BuildCustomBox = () => {
  const navigate = useNavigate();
  const [boxConfig, setBoxConfig] = useState<CustomBoxConfig>({
    size: '',
    theme: 'No Theme',
    gifts: []
  });

  const updateGiftQuantity = (giftId: string, quantity: number) => {
    setBoxConfig(prev => {
      const existingGiftIndex = prev.gifts.findIndex(g => g.id === giftId);
      const gift = availableGifts.find(g => g.id === giftId);
      
      if (!gift) return prev;

      const newGifts = [...prev.gifts];
      
      if (quantity <= 0) {
        if (existingGiftIndex > -1) {
          newGifts.splice(existingGiftIndex, 1);
        }
      } else {
        if (existingGiftIndex > -1) {
          newGifts[existingGiftIndex].quantity = quantity;
        } else {
          newGifts.push({ ...gift, quantity });
        }
      }

      return { ...prev, gifts: newGifts };
    });
  };

  const getGiftQuantity = (giftId: string) => {
    return boxConfig.gifts.find(g => g.id === giftId)?.quantity || 0;
  };

  const calculateTotal = () => {
    const boxPrice = boxSizes.find(s => s.value === boxConfig.size)?.price || 0;
    const giftsTotal = boxConfig.gifts.reduce((sum, gift) => sum + (gift.price * gift.quantity), 0);
    return boxPrice + giftsTotal;
  };

  const handleContinue = () => {
    if (!boxConfig.size || boxConfig.gifts.length === 0) {
      return;
    }
    navigate('/personalization', { state: { customBox: boxConfig } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/gift-box-flow')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gift Box Flow
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Build Your Custom Box</h1>
          <p className="text-gray-600">Create a personalized gift box from scratch</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Box Configuration */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Box Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Box Size</label>
              <Select value={boxConfig.size} onValueChange={(value: 'Small' | 'Medium' | 'Large') => 
                setBoxConfig(prev => ({ ...prev, size: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {boxSizes.map(size => (
                    <SelectItem key={size.value} value={size.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{size.value}</span>
                        <span className="text-xs text-gray-500 ml-2">${size.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {boxConfig.size && (
                <p className="text-xs text-gray-500 mt-1">
                  {boxSizes.find(s => s.value === boxConfig.size)?.description}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <Select value={boxConfig.theme} onValueChange={(value) => 
                setBoxConfig(prev => ({ ...prev, theme: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map(theme => (
                    <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {boxConfig.size && (
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Box Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Box ({boxConfig.size})</span>
                    <span>${boxSizes.find(s => s.value === boxConfig.size)?.price}</span>
                  </div>
                  {boxConfig.gifts.map(gift => (
                    <div key={gift.id} className="flex justify-between">
                      <span>{gift.name} (x{gift.quantity})</span>
                      <span>${(gift.price * gift.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-linden-blue">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gift Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Select Gifts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableGifts.map(gift => {
                const quantity = getGiftQuantity(gift.id);
                const isSelected = quantity > 0;

                return (
                  <div 
                    key={gift.id}
                    className={`border rounded-lg p-4 transition-all ${
                      isSelected ? 'border-linden-blue bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="space-y-3">
                      <img 
                        src={gift.image} 
                        alt={gift.name}
                        className="w-full h-32 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-semibold">{gift.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="secondary" className="text-xs">{gift.category}</Badge>
                          <span className="font-bold text-linden-blue">${gift.price}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateGiftQuantity(gift.id, quantity - 1)}
                            disabled={quantity <= 0}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateGiftQuantity(gift.id, quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateGiftQuantity(gift.id, isSelected ? 0 : 1)}
                          className={isSelected ? "bg-linden-blue hover:bg-linden-blue/90" : ""}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {isSelected ? 'Added' : 'Add'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Button */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Ready to continue?</h3>
              <p className="text-sm text-gray-500">
                {boxConfig.gifts.length} gift(s) selected in {boxConfig.size || 'no'} box
              </p>
            </div>
            <Button 
              onClick={handleContinue}
              className="bg-linden-blue hover:bg-linden-blue/90"
              disabled={!boxConfig.size || boxConfig.gifts.length === 0}
            >
              Continue to Personalization
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuildCustomBox;
