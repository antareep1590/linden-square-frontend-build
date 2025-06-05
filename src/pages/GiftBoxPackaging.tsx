
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
  Clock
} from "lucide-react";

interface GiftBox {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  capacity: number;
  features: string[];
  rating: number;
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
    rating: 4.8
  },
  {
    id: '2',
    name: 'Luxury Gift Box',
    description: 'High-end gift box with gold accents and premium ribbon',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=200&fit=crop',
    capacity: 8,
    features: ['Gold Accents', 'Premium Ribbon', 'Luxury Feel'],
    rating: 4.9
  },
  {
    id: '3',
    name: 'Eco-Friendly Box',
    description: 'Sustainable gift box made from 100% recycled materials',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=200&fit=crop',
    capacity: 5,
    features: ['100% Recycled', 'Biodegradable', 'Eco-Conscious'],
    rating: 4.7
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
  const [selectedBox, setSelectedBox] = useState<string>('');
  const [selectedShipping, setSelectedShipping] = useState<string>('standard');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [addInsurance, setAddInsurance] = useState(false);
  const [addThankYouNote, setAddThankYouNote] = useState(false);
  const [signatureRequired, setSignatureRequired] = useState(false);

  const selectedGiftBox = giftBoxes.find(box => box.id === selectedBox);
  const selectedShippingOption = shippingOptions.find(option => option.id === selectedShipping);

  const calculateTotal = () => {
    let total = 0;
    if (selectedGiftBox) total += selectedGiftBox.price;
    if (selectedShippingOption) total += selectedShippingOption.price;
    if (addInsurance) total += 4.99;
    if (addThankYouNote) total += 2.99;
    if (signatureRequired) total += 3.99;
    return total;
  };

  const handleSavePackaging = () => {
    console.log('Packaging saved:', {
      giftBox: selectedGiftBox,
      shipping: selectedShippingOption,
      deliveryInstructions,
      addOns: { addInsurance, addThankYouNote, signatureRequired }
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Packaging & Delivery</h1>
        <p className="text-gray-600">Choose your gift box and delivery preferences</p>
      </div>

      {/* Gift Box Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Select Gift Box
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {giftBoxes.map((box) => (
              <Card 
                key={box.id} 
                className={`cursor-pointer transition-all ${
                  selectedBox === box.id ? 'ring-2 ring-linden-blue' : ''
                }`}
                onClick={() => setSelectedBox(box.id)}
              >
                <div className="aspect-video relative">
                  <img
                    src={box.image}
                    alt={box.name}
                    className="object-cover w-full h-full rounded-t-lg"
                  />
                  {selectedBox === box.id && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-6 w-6 text-linden-blue bg-white rounded-full" />
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
                  <div className="flex flex-wrap gap-1">
                    {box.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
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
                onCheckedChange={setAddInsurance}
              />
              <Label htmlFor="insurance" className="flex-1">
                Add shipping insurance (+$4.99)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="thank-you-note"
                checked={addThankYouNote}
                onCheckedChange={setAddThankYouNote}
              />
              <Label htmlFor="thank-you-note" className="flex-1">
                Include personalized thank-you note (+$2.99)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="signature"
                checked={signatureRequired}
                onCheckedChange={setSignatureRequired}
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
            {selectedGiftBox && (
              <div className="flex justify-between">
                <span>{selectedGiftBox.name}</span>
                <span>${selectedGiftBox.price}</span>
              </div>
            )}
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
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <Button 
            onClick={handleSavePackaging}
            className="w-full mt-6 bg-linden-blue hover:bg-linden-blue/90"
            disabled={!selectedBox}
          >
            Save Packaging & Delivery Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GiftBoxPackaging;
