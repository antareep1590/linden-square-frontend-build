
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Users, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const FinalSummary = () => {
  const navigate = useNavigate();
  const { giftBoxes, recipients, getTotalCost } = useCart();

  const getRecipientsByIds = (recipientIds: string[]) => {
    return recipients.filter(r => recipientIds.includes(r.id));
  };

  const calculateBoxTotal = (box: any) => {
    let total = box.basePrice;
    
    // Add gift costs
    box.selectedGifts.forEach((quantity: number) => {
      total += 25.00 * quantity; // Mock price
    });
    
    // Add personalization costs
    if (box.personalization) {
      total += box.personalization.addOnsCost;
    }
    
    // Multiply by number of recipients for this box
    return total * box.assignedRecipients.length;
  };

  const shippingCost = 15.00;
  const subtotal = getTotalCost();
  const total = subtotal + shippingCost;
  const totalRecipients = giftBoxes.reduce((sum, box) => sum + box.assignedRecipients.length, 0);

  const handleCheckout = () => {
    navigate('/payment-method', { 
      state: { 
        giftBoxes, 
        recipients, 
        total,
        subtotal,
        shippingCost
      }
    });
  };

  const handlePayLater = () => {
    alert('Order saved. Payment link will be sent to your email.');
    navigate('/dashboard');
  };

  if (giftBoxes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/gift-box-flow')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order Summary</h1>
            <p className="text-gray-600">No gift boxes found. Please add gift boxes first.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Order Summary</h1>
          <p className="text-gray-600">Review your complete order before proceeding to payment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {giftBoxes.map((box, index) => {
            const boxRecipients = getRecipientsByIds(box.assignedRecipients);
            const boxTotal = calculateBoxTotal(box);
            
            return (
              <Card key={box.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Gift Box {index + 1}: {box.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex gap-2 mb-2">
                        {box.size && <Badge variant="outline">{box.size}</Badge>}
                        {box.theme && <Badge variant="outline">{box.theme}</Badge>}
                        <Badge className="bg-linden-blue">{box.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Base Price: ${box.basePrice.toFixed(2)}</p>
                    </div>
                    <span className="font-bold text-lg">${boxTotal.toFixed(2)}</span>
                  </div>

                  {/* Gifts Section */}
                  {box.selectedGifts.size > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Included Gifts</h4>
                      <div className="space-y-2">
                        {Array.from(box.selectedGifts.entries()).map(([giftId, quantity]) => (
                          <div key={giftId} className="flex justify-between text-sm">
                            <span>Gift {giftId} (x{quantity})</span>
                            <span>${(25.00 * quantity).toFixed(2)}</span>
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
                            {box.personalization.selectedAddOns.map((addon, addonIndex) => (
                              <div key={addonIndex} className="flex justify-between">
                                <span>{addon.name}</span>
                                <span>${addon.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {box.personalization.ribbonColor && (
                              <div className="flex justify-between">
                                <span>Ribbon Color:</span>
                                <span>{box.personalization.ribbonColor}</span>
                              </div>
                            )}
                            {box.personalization.giftWrap && (
                              <div className="flex justify-between">
                                <span>Gift Wrap:</span>
                                <span>{box.personalization.giftWrap}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {box.personalization.cardMessage && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Card Message:</p>
                            <p className="text-sm italic">"{box.personalization.cardMessage}"</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Personalization Total</span>
                          <span>${box.personalization.addOnsCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recipients for this box */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Recipients ({boxRecipients.length})</h4>
                    <div className="space-y-2">
                      {boxRecipients.map((recipient) => (
                        <div key={recipient.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium text-sm">{recipient.name}</div>
                            <div className="text-xs text-gray-600">{recipient.email}</div>
                          </div>
                          {recipient.tag && (
                            <Badge variant="secondary" className="text-xs">{recipient.tag}</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                {giftBoxes.map((box, index) => (
                  <div key={box.id} className="flex justify-between">
                    <span>Box {index + 1} ({box.assignedRecipients.length} recipients)</span>
                    <span>${calculateBoxTotal(box).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping ({totalRecipients} recipients)</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-linden-blue">${total.toFixed(2)}</span>
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
