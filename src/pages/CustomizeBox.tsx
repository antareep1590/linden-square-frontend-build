
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Gift, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface AvailableGift {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

const availableGifts: AvailableGift[] = [
  {
    id: 'gift-1',
    name: 'Premium Coffee Set',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
    price: 24.99,
    category: 'Beverages'
  },
  {
    id: 'gift-2',
    name: 'Gourmet Chocolate Box',
    image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=300&h=200&fit=crop',
    price: 19.99,
    category: 'Food'
  },
  {
    id: 'gift-3',
    name: 'Scented Candle',
    image: 'https://images.unsplash.com/photo-1602874801031-7ad547c7b2f9?w=300&h=200&fit=crop',
    price: 15.99,
    category: 'Home'
  },
  {
    id: 'gift-4',
    name: 'Artisan Tea Collection',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    price: 22.99,
    category: 'Beverages'
  },
  {
    id: 'gift-5',
    name: 'Premium Notebook',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop',
    price: 18.99,
    category: 'Stationery'
  },
  {
    id: 'gift-6',
    name: 'Wellness Kit',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=200&fit=crop',
    price: 39.99,
    category: 'Health'
  }
];

const CustomizeBox = () => {
  const navigate = useNavigate();
  const { selectedBoxes, updateBox } = useCart();

  const updateGiftQuantity = (boxId: string, giftId: string, newQuantity: number) => {
    const box = selectedBoxes.find(b => b.id === boxId);
    if (!box) return;

    const updatedGifts = [...box.gifts];
    const existingGiftIndex = updatedGifts.findIndex(g => g.id === giftId);

    if (newQuantity <= 0) {
      if (existingGiftIndex > -1) {
        updatedGifts.splice(existingGiftIndex, 1);
        toast.success('Gift removed from box');
      }
    } else {
      if (existingGiftIndex > -1) {
        updatedGifts[existingGiftIndex].quantity = newQuantity;
      } else {
        const availableGift = availableGifts.find(g => g.id === giftId);
        if (availableGift) {
          updatedGifts.push({
            id: giftId,
            name: availableGift.name,
            price: availableGift.price,
            quantity: newQuantity
          });
          toast.success('Gift added to box');
        }
      }
    }

    updateBox(boxId, { gifts: updatedGifts });
  };

  const getGiftQuantity = (boxId: string, giftId: string) => {
    const box = selectedBoxes.find(b => b.id === boxId);
    if (!box) return 0;
    const gift = box.gifts.find(g => g.id === giftId);
    return gift ? gift.quantity : 0;
  };

  const calculateBoxTotal = (boxId: string) => {
    const box = selectedBoxes.find(b => b.id === boxId);
    if (!box) return 0;
    
    const giftsTotal = box.gifts.reduce((sum, gift) => sum + (gift.price * gift.quantity), 0);
    return box.basePrice + giftsTotal;
  };

  const handleContinue = () => {
    if (selectedBoxes.some(box => box.gifts.length === 0)) {
      toast.error('Please add at least one gift to each box');
      return;
    }
    navigate('/personalization');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Customize Your Box</h1>
          <p className="text-gray-600">Customize the gifts in each of your selected boxes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Box Customization */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Your Gift Boxes ({selectedBoxes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {selectedBoxes.map((box) => (
                  <AccordionItem key={box.id} value={box.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{box.name}</span>
                          <Badge variant="outline">{box.size}</Badge>
                          <Badge variant="secondary">{box.theme}</Badge>
                          <span className="text-sm text-gray-600">{box.gifts.length} items</span>
                        </div>
                        <span className="font-bold text-linden-blue">${calculateBoxTotal(box.id).toFixed(2)}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-4">
                        {/* Current Gifts */}
                        <div>
                          <h4 className="font-medium mb-3">Current Gifts in This Box</h4>
                          {box.gifts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {box.gifts.map(gift => (
                                <div key={gift.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <div className="font-medium text-sm">{gift.name}</div>
                                    <div className="text-xs text-gray-600">${gift.price} × {gift.quantity}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateGiftQuantity(box.id, gift.id, gift.quantity - 1)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-6 text-center text-sm">{gift.quantity}</span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateGiftQuantity(box.id, gift.id, gift.quantity + 1)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateGiftQuantity(box.id, gift.id, 0)}
                                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No gifts added yet. Add gifts from the catalog below.</p>
                          )}
                        </div>

                        {/* Available Gifts Catalog */}
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-3">Available Gifts Catalog</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableGifts.map(gift => {
                              const quantity = getGiftQuantity(box.id, gift.id);
                              const isSelected = quantity > 0;

                              return (
                                <div 
                                  key={gift.id}
                                  className={`border rounded-lg p-3 transition-all ${
                                    isSelected ? 'border-linden-blue bg-blue-50' : 'border-gray-200'
                                  }`}
                                >
                                  <div className="space-y-3">
                                    <img 
                                      src={gift.image} 
                                      alt={gift.name}
                                      className="w-full h-24 object-cover rounded"
                                    />
                                    <div>
                                      <h5 className="font-medium text-sm">{gift.name}</h5>
                                      <div className="flex items-center justify-between mt-1">
                                        <Badge variant="secondary" className="text-xs">{gift.category}</Badge>
                                        <span className="font-bold text-linden-blue text-sm">${gift.price}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => updateGiftQuantity(box.id, gift.id, quantity - 1)}
                                          disabled={quantity <= 0}
                                          className="h-6 w-6 p-0"
                                        >
                                          <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-6 text-center text-sm">{quantity}</span>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => updateGiftQuantity(box.id, gift.id, quantity + 1)}
                                          className="h-6 w-6 p-0"
                                        >
                                          <Plus className="h-3 w-3" />
                                        </Button>
                                      </div>
                                      <Button
                                        variant={isSelected ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => updateGiftQuantity(box.id, gift.id, isSelected ? 0 : 1)}
                                        className={isSelected ? "bg-linden-blue hover:bg-linden-blue/90" : ""}
                                      >
                                        {isSelected ? 'Added' : 'Add'}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Customization Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {selectedBoxes.map(box => (
                  <div key={box.id} className="border-b pb-3 last:border-b-0">
                    <div className="font-medium text-sm mb-2">{box.name}</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Base Box</span>
                        <span>${box.basePrice.toFixed(2)}</span>
                      </div>
                      {box.gifts.map(gift => (
                        <div key={gift.id} className="flex justify-between text-gray-600">
                          <span>{gift.name} (×{gift.quantity})</span>
                          <span>${(gift.price * gift.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-medium text-sm mt-2 pt-2 border-t">
                      <span>Box Total</span>
                      <span className="text-linden-blue">${calculateBoxTotal(box.id).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total All Boxes</span>
                  <span className="text-linden-blue">
                    ${selectedBoxes.reduce((total, box) => total + calculateBoxTotal(box.id), 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button 
                onClick={handleContinue}
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
              >
                Continue to Personalization
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomizeBox;
