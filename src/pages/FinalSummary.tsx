import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Users, CreditCard } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useCart } from '@/contexts/CartContext';

const FinalSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedBoxes } = useCart();
  const state = location.state || {};

  // Mock data for demonstration with proper structure
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
      { name: 'Scented Candle', price: 15.99, quantity: 1 },
      { name: 'Artisan Tea Collection', price: 22.99, quantity: 1 },
      { name: 'Premium Notebook', price: 18.99, quantity: 1 }
    ],
    personalization: {
      ribbonColor: 'Gold',
      giftWrap: 'Elegant White',
      cardMessage: 'Happy Birthday! Wishing you all the best.',
      addOnsCost: 18.00,
      selectedAddOns: [
        { name: 'Gold Ribbon', price: 5.00 },
        { name: 'Elegant White Gift Wrap', price: 8.00 },
        { name: 'Custom Card Message', price: 5.00 }
      ]
    },
    recipients: [
      { name: 'John Smith', email: 'john@company.com', tag: 'Client' },
      { name: 'Sarah Johnson', email: 'sarah@partner.com', tag: 'Partner' },
      { name: 'Mike Wilson', email: 'mike@team.com', tag: 'Team Member' }
    ],
    sendOption: 'now'
  };

  const summary = { ...mockSummary, ...state };

  const calculateBoxSubtotal = (box: any) => {
    const basePrice = box.basePrice || 0;
    const giftsTotal = box.gifts?.reduce((sum: number, gift: any) => 
      sum + (gift.price * gift.quantity), 0) || 0;
    return basePrice + giftsTotal;
  };

  const calculateBoxPersonalizationCost = (box: any) => {
    return box.personalization?.addOnsCost || 0;
  };

  const calculateBoxTotal = (box: any) => {
    return calculateBoxSubtotal(box) + calculateBoxPersonalizationCost(box);
  };

  const shippingCost = 15.00;
  const grandTotal = selectedBoxes.reduce((total, box) => total + calculateBoxTotal(box), 0) + shippingCost;

  const handleCheckout = () => {
    navigate('/payment-method', { state: { ...summary, total: grandTotal } });
  };

  const handlePayLater = () => {
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
          {/* Gift Boxes - Accordion Layout */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Gift Boxes ({selectedBoxes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {selectedBoxes.map((box, index) => (
                  <AccordionItem key={box.id} value={box.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">{box.name}</span>
                          <div className="flex gap-2">
                            <Badge variant="outline">{box.size}</Badge>
                            <Badge variant="outline">{box.theme}</Badge>
                          </div>
                        </div>
                        <span className="font-bold text-linden-blue">${calculateBoxTotal(box).toFixed(2)}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex justify-between">
                              <span>Base Box</span>
                              <span>${box.basePrice?.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Included Gifts Section */}
                        {box.gifts && box.gifts.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-3">Included Gifts</h4>
                            <div className="space-y-2">
                              {box.gifts.map((gift: any, giftIndex: number) => (
                                <div key={giftIndex} className="flex justify-between text-sm">
                                  <span>{gift.name} (x{gift.quantity})</span>
                                  <span>${(gift.price * gift.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Personalization Section */}
                        {box.personalization && (
                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-3">Personalization</h4>
                            <div className="space-y-2 text-sm">
                              {box.personalization.selectedAddOns && box.personalization.selectedAddOns.length > 0 ? (
                                <div className="space-y-2">
                                  {box.personalization.selectedAddOns.map((addon: any, addonIndex: number) => (
                                    <div key={addonIndex} className="flex justify-between">
                                      <span>{addon.name}</span>
                                      <span>${addon.price.toFixed(2)}</span>
                                    </div>
                                  ))}
                                  {box.personalization.cardMessage && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-xs text-gray-600 mb-1">Card Message:</p>
                                      <p className="text-sm italic">"{box.personalization.cardMessage}"</p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <>
                                  {box.personalization.selectedOptions?.get('ribbonColor') && (
                                    <div className="flex justify-between">
                                      <span>Ribbon Color:</span>
                                      <span>{box.personalization.selectedOptions.get('ribbonColor')}</span>
                                    </div>
                                  )}
                                  {box.personalization.selectedOptions?.get('giftWrap') && (
                                    <div className="flex justify-between">
                                      <span>Gift Wrap:</span>
                                      <span>{box.personalization.selectedOptions.get('giftWrap')}</span>
                                    </div>
                                  )}
                                  {box.personalization.cardMessage && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-xs text-gray-600 mb-1">Card Message:</p>
                                      <p className="text-sm italic">"{box.personalization.cardMessage}"</p>
                                    </div>
                                  )}
                                </>
                              )}
                              <div className="flex justify-between font-medium pt-2 border-t">
                                <span>Personalization Total</span>
                                <span>${calculateBoxPersonalizationCost(box).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Assigned Recipients Section */}
                        {box.assignedRecipients && box.assignedRecipients.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-3">Recipients</h4>
                            <div className="space-y-2">
                              {box.assignedRecipients.map((recipient: any, recipientIndex: number) => (
                                <div key={recipientIndex} className="flex items-center justify-between text-sm">
                                  <span>{recipient.name}</span>
                                  {recipient.tag && (
                                    <Badge variant="secondary" className="text-xs">{recipient.tag}</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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
                {selectedBoxes.map((box, index) => (
                  <div key={box.id} className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span>{box.name}</span>
                      <span>${calculateBoxTotal(box).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-linden-blue">${grandTotal.toFixed(2)}</span>
                  </div>
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
