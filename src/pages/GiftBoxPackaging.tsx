
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  Truck, 
  Gift,
  Star,
  CheckCircle,
  MapPin,
  Clock,
  Plus,
  Minus
} from "lucide-react";
import GiftAssignmentPanel from "@/components/GiftAssignmentPanel";

interface GiftBox {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  capacity: number;
  features: string[];
  rating: number;
  quantity: number;
}

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryTime: string;
  features: string[];
}

const giftBoxes: GiftBox[] = [
  {
    id: '1',
    name: 'Premium Wood Box',
    description: 'Elegant wooden box with magnetic closure and custom engraving options',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
    capacity: 6,
    features: ['Custom Engraving', 'Magnetic Closure', 'Sustainable Wood'],
    rating: 4.8,
    quantity: 0
  },
  {
    id: '2',
    name: 'Luxury Gift Box',
    description: 'High-end gift box with gold accents and premium ribbon',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=200&fit=crop',
    capacity: 8,
    features: ['Gold Accents', 'Premium Ribbon', 'Luxury Feel'],
    rating: 4.9,
    quantity: 0
  },
  {
    id: '3',
    name: 'Eco-Friendly Box',
    description: 'Sustainable gift box made from 100% recycled materials',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=200&fit=crop',
    capacity: 5,
    features: ['100% Recycled', 'Biodegradable', 'Eco-Conscious'],
    rating: 4.7,
    quantity: 0
  }
];

const shippingOptions: ShippingOption[] = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Regular shipping to your recipients',
    price: 0,
    deliveryTime: '5-7 business days',
    features: ['Tracking included', 'Insurance covered']
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Faster delivery for urgent gifts',
    price: 9.99,
    deliveryTime: '2-3 business days',
    features: ['Priority handling', 'Tracking included', 'Insurance covered']
  },
  {
    id: 'overnight',
    name: 'Overnight Delivery',
    description: 'Next business day delivery',
    price: 24.99,
    deliveryTime: '1 business day',
    features: ['Signature required', 'Priority handling', 'Full insurance']
  }
];

const GiftBoxPackaging = () => {
  const [selectedBoxes, setSelectedBoxes] = useState<GiftBox[]>(giftBoxes);
  const [selectedShipping, setSelectedShipping] = useState<string>('standard');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [addInsurance, setAddInsurance] = useState(false);
  const [addThankYouNote, setAddThankYouNote] = useState(false);
  const [signatureRequired, setSignatureRequired] = useState(false);
  const [showGiftAssignment, setShowGiftAssignment] = useState(false);
  const [selectedBoxForGifts, setSelectedBoxForGifts] = useState<GiftBox | null>(null);

  const selectedShippingOption = shippingOptions.find(option => option.id === selectedShipping);

  const updateBoxQuantity = (boxId: string, newQuantity: number) => {
    setSelectedBoxes(boxes => 
      boxes.map(box => 
        box.id === boxId ? { ...box, quantity: Math.max(0, newQuantity) } : box
      )
    );
  };

  const handleAssignGifts = (box: GiftBox) => {
    if (box.quantity > 0) {
      setSelectedBoxForGifts(box);
      setShowGiftAssignment(true);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Add gift box costs
    selectedBoxes.forEach(box => {
      total += box.price * box.quantity;
    });
    
    // Add shipping cost
    if (selectedShippingOption) total += selectedShippingOption.price;
    if (addInsurance) total += 4.99;
    if (addThankYouNote) total += 2.99;
    if (signatureRequired) total += 3.99;
    return total;
  };

  const getTotalBoxes = () => {
    return selectedBoxes.reduce((sum, box) => sum + box.quantity, 0);
  };

  const handleSavePackaging = () => {
    console.log('Packaging saved:', {
      giftBoxes: selectedBoxes.filter(box => box.quantity > 0),
      shipping: selectedShippingOption,
      deliveryInstructions,
      addOns: { addInsurance, addThankYouNote, signatureRequired }
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Packaging & Delivery</h1>
        <p className="text-gray-600">Choose your gift boxes, add gifts, and set delivery preferences</p>
      </div>

      {/* Gift Box Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Select Gift Boxes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedBoxes.map((box) => (
              <Card 
                key={box.id} 
                className={`transition-all ${
                  box.quantity > 0 ? 'ring-2 ring-linden-blue' : ''
                }`}
              >
                <div className="aspect-video relative">
                  <img
                    src={box.image}
                    alt={box.name}
                    className="object-cover w-full h-full rounded-t-lg"
                  />
                  {box.quantity > 0 && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-linden-blue text-white">
                        {box.quantity}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{box.name}</h3>
                    <span className="font-bold text-linden-blue">${box.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{box.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(box.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600">{box.rating}</span>
                    </div>
                    <Badge variant="outline">Capacity: {box.capacity} items</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {box.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateBoxQuantity(box.id, box.quantity - 1)}
                        disabled={box.quantity === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{box.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateBoxQuantity(box.id, box.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {box.quantity > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignGifts(box)}
                        className="text-linden-blue"
                      >
                        <Gift className="h-4 w-4 mr-1" />
                        Assign Gifts
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {shippingOptions.map((option) => (
            <div
              key={option.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedShipping === option.id ? 'border-linden-blue bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedShipping(option.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{option.name}</h3>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {option.deliveryTime}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{option.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {option.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">
                    {option.price === 0 ? 'Free' : `$${option.price}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delivery Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Delivery Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="delivery-instructions">Special Instructions</Label>
            <Textarea
              id="delivery-instructions"
              placeholder="Any special delivery instructions for recipients..."
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              className="mt-2"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Additional Services</h4>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="insurance"
                checked={addInsurance}
                onCheckedChange={(checked) => setAddInsurance(checked === true)}
              />
              <Label htmlFor="insurance" className="flex-1">
                Add shipping insurance (+$4.99)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="thank-you-note"
                checked={addThankYouNote}
                onCheckedChange={(checked) => setAddThankYouNote(checked === true)}
              />
              <Label htmlFor="thank-you-note" className="flex-1">
                Include personalized thank-you note (+$2.99)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="signature"
                checked={signatureRequired}
                onCheckedChange={(checked) => setSignatureRequired(checked === true)}
              />
              <Label htmlFor="signature" className="flex-1">
                Require signature on delivery (+$3.99)
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {selectedBoxes.filter(box => box.quantity > 0).map((box) => (
              <div key={box.id} className="flex justify-between">
                <span>{box.name} (x{box.quantity})</span>
                <span>${(box.price * box.quantity).toFixed(2)}</span>
              </div>
            ))}
            {selectedShippingOption && (
              <div className="flex justify-between">
                <span>{selectedShippingOption.name}</span>
                <span>{selectedShippingOption.price === 0 ? 'Free' : `$${selectedShippingOption.price}`}</span>
              </div>
            )}
            {addInsurance && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping Insurance</span>
                <span>$4.99</span>
              </div>
            )}
            {addThankYouNote && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Thank-you Note</span>
                <span>$2.99</span>
              </div>
            )}
            {signatureRequired && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Signature Required</span>
                <span>$3.99</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total ({getTotalBoxes()} boxes)</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <Button 
            onClick={handleSavePackaging}
            className="w-full mt-6 bg-linden-blue hover:bg-linden-blue/90"
            disabled={getTotalBoxes() === 0}
          >
            Save Packaging & Delivery Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Gift Assignment Panel */}
      <GiftAssignmentPanel
        isOpen={showGiftAssignment}
        onClose={() => setShowGiftAssignment(false)}
        selectedBox={selectedBoxForGifts}
      />
    </div>
  );
};

export default GiftBoxPackaging;
