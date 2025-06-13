
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Gift, Ribbon, MessageSquare, Tag, ShoppingCart, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LindenSquareLogo from '@/components/LindenSquareLogo';
import { toast } from 'sonner';

const CustomizeGiftBox = () => {
  const navigate = useNavigate();
  
  // Sample selected box data (would come from previous selection)
  const selectedBox = {
    id: 1,
    name: "Executive Appreciation",
    theme: "Professional",
    basePrice: 89.99,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    contents: ["Premium leather notebook", "Artisan coffee selection", "Elegant pen set", "Gourmet chocolates"]
  };

  const [personalization, setPersonalization] = useState({
    ribbonColor: 'blue',
    ribbonStyle: 'classic',
    giftMessage: '',
    senderName: '',
    tagStyle: 'elegant',
    packagingType: 'premium',
    deliveryInstructions: ''
  });

  const [personalizationCosts, setPersonalizationCosts] = useState({
    ribbonUpgrade: 0,
    premiumPackaging: 15.00,
    customTag: 5.00,
    expressDelivery: 0
  });

  const ribbonOptions = [
    { id: 'blue', name: 'Classic Blue', color: 'bg-blue-600', price: 0 },
    { id: 'gold', name: 'Elegant Gold', color: 'bg-yellow-500', price: 3.00 },
    { id: 'silver', name: 'Silver', color: 'bg-gray-400', price: 3.00 },
    { id: 'red', name: 'Festive Red', color: 'bg-red-600', price: 0 },
    { id: 'green', name: 'Forest Green', color: 'bg-green-600', price: 0 }
  ];

  const ribbonStyles = [
    { id: 'classic', name: 'Classic Bow', price: 0 },
    { id: 'modern', name: 'Modern Wrap', price: 2.00 },
    { id: 'elegant', name: 'Elegant Twist', price: 4.00 }
  ];

  const tagStyles = [
    { id: 'simple', name: 'Simple Card', price: 0 },
    { id: 'elegant', name: 'Elegant Card', price: 5.00 },
    { id: 'premium', name: 'Premium Foil Card', price: 8.00 }
  ];

  const packagingTypes = [
    { id: 'standard', name: 'Standard Box', price: 0 },
    { id: 'premium', name: 'Premium Box', price: 15.00 },
    { id: 'luxury', name: 'Luxury Presentation Box', price: 25.00 }
  ];

  const handlePersonalizationChange = (field: string, value: string) => {
    setPersonalization(prev => ({
      ...prev,
      [field]: value
    }));

    // Update costs based on selection
    updatePersonalizationCosts(field, value);
  };

  const updatePersonalizationCosts = (field: string, value: string) => {
    let newCosts = { ...personalizationCosts };

    switch (field) {
      case 'ribbonColor':
        const ribbon = ribbonOptions.find(r => r.id === value);
        newCosts.ribbonUpgrade = ribbon?.price || 0;
        break;
      case 'ribbonStyle':
        const style = ribbonStyles.find(s => s.id === value);
        newCosts.ribbonUpgrade += style?.price || 0;
        break;
      case 'tagStyle':
        const tag = tagStyles.find(t => t.id === value);
        newCosts.customTag = tag?.price || 0;
        break;
      case 'packagingType':
        const packaging = packagingTypes.find(p => p.id === value);
        newCosts.premiumPackaging = packaging?.price || 0;
        break;
    }

    setPersonalizationCosts(newCosts);
  };

  const calculateSubtotal = () => {
    return selectedBox.basePrice + Object.values(personalizationCosts).reduce((sum, cost) => sum + cost, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.08; // 8% tax
    return subtotal + tax;
  };

  const handleContinueToRecipients = () => {
    if (!personalization.giftMessage.trim()) {
      toast.error('Please add a gift message before continuing');
      return;
    }
    
    if (!personalization.senderName.trim()) {
      toast.error('Please enter the sender name');
      return;
    }

    navigate('/recipients');
  };

  const handleBackToBoxSelection = () => {
    navigate('/choose-gift-box');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <LindenSquareLogo size="medium" />
              <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
              <h1 className="hidden sm:block text-xl font-semibold text-gray-900">Customize Your Gift Box</h1>
            </div>
            <Button variant="outline" onClick={handleBackToBoxSelection}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Selection
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Customization Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Selected Box Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Selected Gift Box
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <img 
                    src={selectedBox.image} 
                    alt={selectedBox.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{selectedBox.name}</h3>
                    <p className="text-gray-600">{selectedBox.theme}</p>
                    <p className="text-linden-blue font-semibold">${selectedBox.basePrice}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ribbon Customization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ribbon className="h-5 w-5" />
                  Ribbon & Wrapping
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Ribbon Color</Label>
                  <RadioGroup 
                    value={personalization.ribbonColor} 
                    onValueChange={(value) => handlePersonalizationChange('ribbonColor', value)}
                    className="flex flex-wrap gap-4"
                  >
                    {ribbonOptions.map((ribbon) => (
                      <div key={ribbon.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={ribbon.id} id={ribbon.id} />
                        <Label htmlFor={ribbon.id} className="flex items-center space-x-2 cursor-pointer">
                          <div className={`w-4 h-4 rounded-full ${ribbon.color}`}></div>
                          <span>{ribbon.name}</span>
                          {ribbon.price > 0 && <span className="text-sm text-gray-500">+${ribbon.price}</span>}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="ribbonStyle">Ribbon Style</Label>
                  <Select value={personalization.ribbonStyle} onValueChange={(value) => handlePersonalizationChange('ribbonStyle', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ribbonStyles.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name} {style.price > 0 && `(+$${style.price})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Gift Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Gift Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="giftMessage">Personal Message *</Label>
                  <Textarea
                    id="giftMessage"
                    placeholder="Write your personal message here..."
                    value={personalization.giftMessage}
                    onChange={(e) => handlePersonalizationChange('giftMessage', e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-sm text-gray-500">
                    {personalization.giftMessage.length}/200 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderName">From (Sender Name) *</Label>
                  <Input
                    id="senderName"
                    placeholder="Your name or company name"
                    value={personalization.senderName}
                    onChange={(e) => handlePersonalizationChange('senderName', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card & Packaging */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Card & Packaging
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="tagStyle">Gift Card Style</Label>
                  <Select value={personalization.tagStyle} onValueChange={(value) => handlePersonalizationChange('tagStyle', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tagStyles.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name} {tag.price > 0 && `(+$${tag.price})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="packagingType">Packaging Type</Label>
                  <Select value={personalization.packagingType} onValueChange={(value) => handlePersonalizationChange('packagingType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {packagingTypes.map((packaging) => (
                        <SelectItem key={packaging.id} value={packaging.id}>
                          {packaging.name} {packaging.price > 0 && `(+$${packaging.price})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryInstructions">Special Delivery Instructions</Label>
                  <Textarea
                    id="deliveryInstructions"
                    placeholder="Any special instructions for delivery..."
                    value={personalization.deliveryInstructions}
                    onChange={(e) => handlePersonalizationChange('deliveryInstructions', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Base Box */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{selectedBox.name}</span>
                    <span>${selectedBox.basePrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Personalization Costs */}
                {Object.entries(personalizationCosts).map(([key, cost]) => {
                  if (cost > 0) {
                    const labels = {
                      ribbonUpgrade: 'Ribbon Upgrade',
                      premiumPackaging: 'Premium Packaging',
                      customTag: 'Custom Card',
                      expressDelivery: 'Express Delivery'
                    };
                    
                    return (
                      <div key={key} className="flex justify-between text-sm text-gray-600">
                        <span>{labels[key as keyof typeof labels]}</span>
                        <span>+${cost.toFixed(2)}</span>
                      </div>
                    );
                  }
                  return null;
                })}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (8%):</span>
                    <span>${(calculateSubtotal() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping:</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Continue Button */}
                <div className="pt-4">
                  <Button 
                    className="w-full bg-linden-blue hover:bg-linden-blue/90"
                    onClick={handleContinueToRecipients}
                  >
                    Continue to Recipients
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                </div>

                {/* Gift Preview */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Your Personalized Gift</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Ribbon:</span>
                      <span className="capitalize">{personalization.ribbonColor} {personalization.ribbonStyle}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Card:</span>
                      <span className="capitalize">{personalization.tagStyle}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Packaging:</span>
                      <span className="capitalize">{personalization.packagingType}</span>
                    </div>
                    {personalization.giftMessage && (
                      <div className="text-sm">
                        <span className="font-medium">Message:</span>
                        <p className="italic text-gray-600 mt-1">"{personalization.giftMessage}"</p>
                        <p className="text-right text-xs text-gray-500 mt-1">- {personalization.senderName}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeGiftBox;
