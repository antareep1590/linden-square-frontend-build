
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Users, CreditCard, Clock } from 'lucide-react';

const FinalSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  // Mock data for demonstration
  const mockSummary = {
    boxDetails: {
      name: 'Birthday Celebration Box',
      size: 'Medium',
      theme: 'Birthday',
      basePrice: 85.00
    },
    selectedGifts: [
      { name: 'Premium Coffee Set', price: 24.99, quantity: 1 },
      { name: 'Gourmet Chocolate Box', price: 19.99, quantity: 1 },
      { name: 'Scented Candle', price: 15.99, quantity: 1 }
    ],
    personalization: {
      ribbonColor: 'Gold',
      giftWrap: 'Elegant White',
      cardMessage: 'Happy Birthday! Wishing you all the best.',
      addOnsCost: 18.00
    },
    recipients: [
      { name: 'John Smith', email: 'john@company.com', tag: 'Client' },
      { name: 'Sarah Johnson', email: 'sarah@partner.com', tag: 'Partner' },
      { name: 'Mike Wilson', email: 'mike@team.com', tag: 'Team Member' }
    ],
    sendOption: 'now'
  };

  const summary = { ...mockSummary, ...state };

  const calculateSubtotal = () => {
    const basePrice = summary.boxDetails?.basePrice || 0;
    const giftsTotal = summary.selectedGifts?.reduce((sum: number, gift: any) => 
      sum + (gift.price * gift.quantity), 0) || 0;
    return basePrice + giftsTotal;
  };

  const personalizationCost = summary.personalization?.addOnsCost || 0;
  const shippingCost = 15.00; // Mock shipping cost
  const subtotal = calculateSubtotal();
  const total = subtotal + personalizationCost + shippingCost;
  const recipientCount = summary.recipients?.length || 0;

  const handleCheckout = () => {
    navigate('/payment-method', { state: { ...summary, total } });
  };

  const handlePayLater = () => {
    // Mock pay later process
    alert('Order saved. Payment link will be sent to your email.');
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Order Summary</h1>
          <p className="text-gray-600">Review your order before proceeding to payment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gift Box Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Gift Box
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{summary.boxDetails?.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{summary.boxDetails?.size}</Badge>
                    <Badge variant="outline">{summary.boxDetails?.theme}</Badge>
                  </div>
                </div>
                <span className="font-bold">${summary.boxDetails?.basePrice?.toFixed(2)}</span>
              </div>

              {summary.selectedGifts && summary.selectedGifts.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Included Gifts</h4>
                  <div className="space-y-2">
                    {summary.selectedGifts.map((gift: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{gift.name} (x{gift.quantity})</span>
                        <span>${(gift.price * gift.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {summary.personalization && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Personalization</h4>
                  <div className="space-y-2 text-sm">
                    {summary.personalization.ribbonColor && (
                      <div className="flex justify-between">
                        <span>Ribbon Color:</span>
                        <span>{summary.personalization.ribbonColor}</span>
                      </div>
                    )}
                    {summary.personalization.giftWrap && (
                      <div className="flex justify-between">
                        <span>Gift Wrap:</span>
                        <span>{summary.personalization.giftWrap}</span>
                      </div>
                    )}
                    {summary.personalization.cardMessage && (
                      <div className="flex justify-between">
                        <span>Card Message:</span>
                        <span className="max-w-xs text-right">"{summary.personalization.cardMessage}"</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Personalization Total</span>
                      <span>${personalizationCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recipients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recipients ({recipientCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.recipients?.map((recipient: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{recipient.name}</div>
                      <div className="text-sm text-gray-600">{recipient.email}</div>
                    </div>
                    {recipient.tag && (
                      <Badge variant="secondary" className="text-xs">{recipient.tag}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Personalization</span>
                  <span>${personalizationCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping ({recipientCount} recipients)</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-linden-blue">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {summary.sendOption === 'now' ? 'Send Now' : 'Send Later'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-linden-blue hover:bg-linden-blue/90"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handlePayLater}
                  className="w-full"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Pay Later
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure payment processing. Your information is protected.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinalSummary;
