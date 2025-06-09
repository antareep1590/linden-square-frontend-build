import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Package, Gift, Plus, Minus, ShoppingCart, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface CustomBoxGift {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
}

interface CustomBoxConfig {
  id: string;
  name: string;
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
  const { selectedBoxes, addBox } = useCart();
  const [createdBoxes, setCreatedBoxes] = useState<CustomBoxConfig[]>([]);
  const [currentBox, setCurrentBox] = useState<CustomBoxConfig>({
    id: '',
    name: '',
    size: '',
    theme: 'No Theme',
    gifts: []
  });

  const updateGiftQuantity = (giftId: string, quantity: number) => {
    setCurrentBox(prev => {
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
    return currentBox.gifts.find(g => g.id === giftId)?.quantity || 0;
  };

  const calculateBoxTotal = (box: CustomBoxConfig) => {
    const boxPrice = boxSizes.find(s => s.value === box.size)?.price || 0;
    const giftsTotal = box.gifts.reduce((sum, gift) => sum + (gift.price * gift.quantity), 0);
    return boxPrice + giftsTotal;
  };

  const generateBoxName = (box: CustomBoxConfig) => {
    if (box.name) return box.name;
    return `${box.size || 'Custom'} ${box.theme} Box`;
  };

  const saveCurrentBox = () => {
    if (!currentBox.size || currentBox.gifts.length === 0) {
      toast.error('Please select a box size and add at least one gift');
      return;
    }

    const boxToSave = {
      ...currentBox,
      id: Date.now().toString(),
      name: generateBoxName(currentBox)
    };

    setCreatedBoxes(prev => [...prev, boxToSave]);
    
    // Add to cart - ensure size is not empty
    if (boxToSave.size !== '') {
      const cartBox = {
        id: boxToSave.id,
        type: 'custom' as const,
        name: boxToSave.name,
        size: boxToSave.size as 'Small' | 'Medium' | 'Large',
        theme: boxToSave.theme,
        basePrice: boxSizes.find(s => s.value === boxToSave.size)?.price || 0,
        gifts: boxToSave.gifts.map(g => ({
          id: g.id,
          name: g.name,
          price: g.price,
          quantity: g.quantity
        }))
      };
      
      addBox(cartBox);
    }

    // Reset current box
    setCurrentBox({
      id: '',
      name: '',
      size: '',
      theme: 'No Theme',
      gifts: []
    });

    toast.success('Box saved successfully!');
  };

  const removeCreatedBox = (boxId: string) => {
    setCreatedBoxes(prev => prev.filter(box => box.id !== boxId));
    toast.success('Box removed');
  };

  const handleContinue = () => {
    if (selectedBoxes.length === 0) {
      toast.error('Please create at least one custom box');
      return;
    }
    navigate('/personalization');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/gift-box-flow')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gift Box Flow
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Build Your Custom Boxes</h1>
          <p className="text-gray-600">Create personalized gift boxes from scratch</p>
        </div>
      </div>

      {/* Created Boxes Summary */}
      {createdBoxes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Created Boxes ({createdBoxes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {createdBoxes.map((box) => (
                <AccordionItem key={box.id} value={box.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{box.name}</span>
                        <Badge variant="outline">{box.size}</Badge>
                        <Badge variant="secondary">{box.theme}</Badge>
                        <span className="text-sm text-gray-600">{box.gifts.length} items</span>
                      </div>
                      <span className="font-bold text-linden-blue">${calculateBoxTotal(box).toFixed(2)}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {box.gifts.map(gift => (
                          <div key={gift.id} className="text-sm p-2 bg-gray-50 rounded">
                            <div className="font-medium">{gift.name}</div>
                            <div className="text-gray-600">Qty: {gift.quantity} × ${gift.price}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCreatedBox(box.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove Box
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

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
              <Select value={currentBox.size} onValueChange={(value: 'Small' | 'Medium' | 'Large') => 
                setCurrentBox(prev => ({ ...prev, size: value }))
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
              {currentBox.size && (
                <p className="text-xs text-gray-500 mt-1">
                  {boxSizes.find(s => s.value === currentBox.size)?.description}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <Select value={currentBox.theme} onValueChange={(value) => 
                setCurrentBox(prev => ({ ...prev, theme: value }))
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

            {currentBox.size && (
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Box Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Box ({currentBox.size})</span>
                    <span>${boxSizes.find(s => s.value === currentBox.size)?.price}</span>
                  </div>
                  {currentBox.gifts.map(gift => (
                    <div key={gift.id} className="flex justify-between">
                      <span>{gift.name} (x{gift.quantity})</span>
                      <span>${(gift.price * gift.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-linden-blue">${calculateBoxTotal(currentBox).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={saveCurrentBox}
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
                disabled={!currentBox.size || currentBox.gifts.length === 0}
              >
                Save This Box
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setCurrentBox({
                    id: '',
                    name: '',
                    size: '',
                    theme: 'No Theme',
                    gifts: []
                  });
                }}
                className="w-full"
              >
                Create Another Box
              </Button>
            </div>
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
                {selectedBoxes.length} box(es) created
              </p>
            </div>
            <Button 
              onClick={handleContinue}
              className="bg-linden-blue hover:bg-linden-blue/90"
              disabled={selectedBoxes.length === 0}
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
