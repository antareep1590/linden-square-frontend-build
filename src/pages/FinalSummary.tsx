
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Users, Calendar, CreditCard, Gift, Ribbon, MessageSquare } from 'lucide-react';

const FinalSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock data - in real app this would come from the route state
  const orderData = location.state || {
    selectedBox: {
      id: '1',
      name: 'Premium Coffee Collection',
      description: 'A curated selection of premium coffee and accessories',
      price: 85,
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=200&fit=crop',
      items: [
        'Ethiopian Single Origin Coffee (12oz)',
        'French Press Coffee Maker',
        'Ceramic Coffee Mug',
        'Honey Sticks (6 pack)'
      ]
    },
    recipients: [
      { name: 'John Smith', email: 'john@company.com', tag: 'Client' },
      { name: 'Sarah Johnson', email: 'sarah@partner.com', tag: 'Partner' }
    ],
    personalizations: [
      { type: 'ribbon', color: 'Gold', cost: 0 },
      { type: 'message', text: 'Thank you for your partnership!', cost: 0 },
      { type: 'card', design: 'Corporate', cost: 5 }
    ],
    sendOption: 'now'
  };

  const { selectedBox, recipients, personalizations, sendOption } = orderData;
  
  const subtotal = selectedBox?.price * recipients.length || 0;
  const personalizationCost = personalizations?.reduce((sum, p) => sum + (p.cost || 0), 0) || 0;
  const tax = (subtotal + personalizationCost) * 0.08;
  const total = subtotal + personalizationCost + tax;

  const handleProceedToCheckout = () => {
    navigate('/payment', { state: { ...orderData, total } });
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
          <p className="text-gray-600">Review your order before checkout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Gift Box */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Selected Gift Box
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <img 
                  src={selectedBox?.image} 
                  alt={selectedBox?.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedBox?.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedBox?.description}</p>
                  <p className="font-medium text-lg">${selectedBox?.price}</p>
                </div>
              </div>
              
              {/* Included Gifts */}
              <div className="mt-4">
                <h4 className="font-medium mb-2">Included Gifts:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedBox?.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Gift className="h-4 w-4 text-linden-blue" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personalizations */}
          {personalizations && personalizations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ribbon className="h-5 w-5" />
                  Personalizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {personalizations.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {item.type === 'ribbon' && <Ribbon className="h-4 w-4 text-linden-gold" />}
                        {item.type === 'message' && <MessageSquare className="h-4 w-4 text-linden-blue" />}
                        {item.type === 'card' && <Gift className="h-4 w-4 text-green-600" />}
                        <div>
                          <p className="font-medium capitalize">{item.type}</p>
                          <p className="text-sm text-gray-600">
                            {item.color || item.design || item.text}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {item.cost > 0 ? `$${item.cost}` : 'Included'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recipients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recipients ({recipients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recipients.map((recipient, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{recipient.name}</p>
                      <p className="text-sm text-gray-600">{recipient.email}</p>
                    </div>
                    {recipient.tag && (
                      <Badge variant="secondary" className="text-xs">{recipient.tag}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Send Option:</span>
                  <span className="font-medium capitalize">{sendOption}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-medium">5-7 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Method:</span>
                  <span className="font-medium">Standard Shipping</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Total */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Order Total
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gift Boxes ({recipients.length})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {personalizationCost > 0 && (
                  <div className="flex justify-between">
                    <span>Personalizations</span>
                    <span>${personalizationCost.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleProceedToCheckout}
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
              >
                Proceed to Checkout
              </Button>

              <div className="text-xs text-gray-500 text-center">
                You will be charged when your order is confirmed
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinalSummary;
