
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Package, Users, Gift, CreditCard, Truck, Percent } from 'lucide-react';
import { toast } from 'sonner';

interface OrderSummary {
  boxCount: number;
  recipients: any[];
  gifts: any[];
  boxPrice: number;
  giftsTotal: number;
  personalizationTotal: number;
  shipping: number;
  discount: number;
  finalTotal: number;
}

const FinalSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock calculation - in real app this would come from state/props
  const orderSummary: OrderSummary = {
    boxCount: 5,
    recipients: location.state?.recipients || [],
    gifts: location.state?.gifts || [],
    boxPrice: 125.00,
    giftsTotal: 247.95,
    personalizationTotal: 25.00,
    shipping: 15.00,
    discount: appliedDiscount,
    finalTotal: 0
  };

  orderSummary.finalTotal = orderSummary.boxPrice + orderSummary.giftsTotal + 
                           orderSummary.personalizationTotal + orderSummary.shipping - 
                           orderSummary.discount;

  const applyCoupon = () => {
    // Mock coupon validation
    if (couponCode.toLowerCase() === 'save10') {
      const discount = (orderSummary.boxPrice + orderSummary.giftsTotal) * 0.1;
      setAppliedDiscount(discount);
      toast.success('Coupon applied! 10% discount on gifts and boxes.');
    } else if (couponCode.toLowerCase() === 'freeship') {
      setAppliedDiscount(orderSummary.shipping);
      toast.success('Free shipping coupon applied!');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedDiscount(0);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const handleSaveAsDraft = () => {
    toast.success('Order saved as draft');
    navigate('/dashboard');
  };

  const handleProceedToCheckout = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Order submitted successfully!');
      navigate('/track-orders');
    }, 2000);
  };

  const handleExportSummary = () => {
    // Mock export functionality
    const summaryData = {
      orderDate: new Date().toLocaleDateString(),
      ...orderSummary
    };
    
    const dataStr = JSON.stringify(summaryData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'order-summary.json';
    link.click();
    
    toast.success('Summary exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Order Summary & Payment</h1>
          <p className="text-gray-600">Review your order and complete your purchase</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Box Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Gift Boxes ({orderSummary.boxCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Medium Birthday Celebration Boxes</span>
                  <span>${orderSummary.boxPrice.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>• Premium packaging with festive theme</p>
                  <p>• Includes gift wrapping and ribbon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recipients ({orderSummary.boxCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>Recipient {i}</span>
                    <Badge variant="outline" className="text-xs">Standard Delivery</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gifts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Selected Gifts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Premium Coffee Set (x5)</span>
                  <span>$124.95</span>
                </div>
                <div className="flex justify-between">
                  <span>Gourmet Chocolate Box (x3)</span>
                  <span>$119.97</span>
                </div>
                <div className="flex justify-between">
                  <span>Wellness Kit (x1)</span>
                  <span>$79.99</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Gifts Subtotal</span>
                  <span>${orderSummary.giftsTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personalization */}
          <Card>
            <CardHeader>
              <CardTitle>Personalization Add-ons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Ribbon Color (Gold) x5</span>
                  <span>$25.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Personalization Total</span>
                  <span>${orderSummary.personalizationTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <div className="space-y-6 sticky top-6">
            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Discount Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={appliedDiscount > 0}
                  />
                  {appliedDiscount > 0 ? (
                    <Button variant="outline" onClick={removeCoupon} size="sm">
                      Remove
                    </Button>
                  ) : (
                    <Button onClick={applyCoupon} size="sm">
                      Apply
                    </Button>
                  )}
                </div>
                {appliedDiscount > 0 && (
                  <div className="text-sm text-green-600">
                    Discount applied: -${appliedDiscount.toFixed(2)}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  Try: SAVE10 or FREESHIP
                </div>
              </CardContent>
            </Card>

            {/* Final Total */}
            <Card>
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Boxes</span>
                    <span>${orderSummary.boxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gifts</span>
                    <span>${orderSummary.giftsTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Personalization</span>
                    <span>${orderSummary.personalizationTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      Shipping
                    </span>
                    <span>${orderSummary.shipping.toFixed(2)}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${appliedDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Final Total</span>
                  <span className="text-linden-blue">${orderSummary.finalTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleProceedToCheckout}
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
                disabled={isProcessing}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleSaveAsDraft}
                className="w-full"
              >
                Save as Draft
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={handleExportSummary}
                className="w-full text-sm"
                size="sm"
              >
                Export Summary
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalSummary;
