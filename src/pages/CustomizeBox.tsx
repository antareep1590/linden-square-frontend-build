
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Minus, Package, Gift, Trash2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const CustomizeBox = () => {
  const navigate = useNavigate();
  const { selectedBoxes, updateBoxGifts, updateBoxPersonalization } = useCart();
  const [selectedBoxIndex, setSelectedBoxIndex] = useState(0);
  const [personalizations, setPersonalizations] = useState<{[key: string]: string}>({});

  // For demo purposes, check if user is "logged in" based on current route or state
  // In a real app, this would come from an auth context
  const isLoggedIn = window.location.pathname.includes('/dashboard') || false;

  const currentBox = selectedBoxes[selectedBoxIndex];

  if (!currentBox) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Package className="h-16 w-16 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-600">No boxes selected</h2>
        <p className="text-gray-500">Please select a gift box first</p>
        <Button onClick={() => navigate('/box-listing')}>
          Select Gift Boxes
        </Button>
      </div>
    );
  }

  const updateGiftQuantity = (giftId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    const updatedGifts = currentBox.gifts.map(gift =>
      gift.id === giftId ? { ...gift, quantity: newQuantity } : gift
    ).filter(gift => gift.quantity > 0);

    updateBoxGifts(currentBox.id, updatedGifts);
  };

  const removeGift = (giftId: string) => {
    const updatedGifts = currentBox.gifts.filter(gift => gift.id !== giftId);
    updateBoxGifts(currentBox.id, updatedGifts);
    toast.success('Gift removed from box');
  };

  const calculateBoxTotal = () => {
    return currentBox.gifts.reduce((total, gift) => 
      total + (gift.price * gift.quantity), 0
    );
  };

  const handlePersonalizationChange = (field: string, value: string) => {
    const key = `${currentBox.id}-${field}`;
    setPersonalizations(prev => ({
      ...prev,
      [key]: value
    }));
    
    updateBoxPersonalization(currentBox.id, field, value);
  };

  const handleProceedToNextStep = () => {
    if (selectedBoxes.length === 0) {
      toast.error('Please add at least one item to your box');
      return;
    }
    
    // If user is not logged in (new client), proceed through the flow
    // but redirect to login when they try to checkout
    navigate('/personalization');
  };

  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      // For new clients, redirect to login before checkout
      toast.info('Please log in to complete your order');
      navigate('/login');
      return;
    }
    
    // For existing clients, proceed to payment
    navigate('/payment-method');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/box-listing')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gift Boxes
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Customize Your Gift Box</h1>
          <p className="text-gray-600">Personalize your selection and add custom touches</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleProceedToNextStep}
            className="bg-linden-blue hover:bg-linden-blue/90"
          >
            Next: Personalization
          </Button>
        </div>
      </div>

      {/* Box Selection Tabs */}
      {selectedBoxes.length > 1 && (
        <div className="flex gap-2 mb-6">
          {selectedBoxes.map((box, index) => (
            <Button
              key={box.id}
              variant={selectedBoxIndex === index ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedBoxIndex(index)}
              className={selectedBoxIndex === index ? "bg-linden-blue" : ""}
            >
              {box.name}
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Box Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{currentBox.name}</span>
                <Badge variant="outline">{currentBox.size}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Theme:</span>
                  <span className="ml-2 font-medium">{currentBox.theme}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium capitalize">{currentBox.type}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gift Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Gift Items ({currentBox.gifts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentBox.gifts.map((gift) => (
                <div key={gift.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{gift.name}</h4>
                    <p className="text-sm text-gray-600">${gift.price.toFixed(2)} each</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateGiftQuantity(gift.id, gift.quantity - 1)}
                      disabled={gift.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{gift.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateGiftQuantity(gift.id, gift.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">${(gift.price * gift.quantity).toFixed(2)}</p>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeGift(gift.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {currentBox.gifts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="mx-auto h-12 w-12 mb-4" />
                  <p>No items in this box. Add some gifts to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personalization Options */}
          <Card>
            <CardHeader>
              <CardTitle>Personalization Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="giftMessage">Gift Message</Label>
                <Textarea
                  id="giftMessage"
                  placeholder="Add a personal message to include with this gift box..."
                  value={personalizations[`${currentBox.id}-giftMessage`] || ''}
                  onChange={(e) => handlePersonalizationChange('giftMessage', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senderName">From (Sender Name)</Label>
                <Input
                  id="senderName"
                  placeholder="Your name or company name"
                  value={personalizations[`${currentBox.id}-senderName`] || ''}
                  onChange={(e) => handlePersonalizationChange('senderName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special packaging or delivery instructions..."
                  value={personalizations[`${currentBox.id}-specialInstructions`] || ''}
                  onChange={(e) => handlePersonalizationChange('specialInstructions', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${calculateBoxTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Personalization:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping:</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${calculateBoxTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  className="w-full bg-linden-blue hover:bg-linden-blue/90"
                  onClick={handleProceedToNextStep}
                >
                  Continue to Personalization
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/box-listing')}
                >
                  Add More Boxes
                </Button>
              </div>

              {/* Quick Checkout for Demo */}
              <div className="pt-4 border-t">
                <Button 
                  variant="outline"
                  className="w-full border-linden-gold text-linden-gold hover:bg-linden-gold hover:text-white"
                  onClick={handleProceedToCheckout}
                >
                  Quick Checkout
                </Button>
                {!isLoggedIn && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    You'll be prompted to log in before payment
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomizeBox;
