
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Building2, Shield, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const PaymentMethodPublic = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ach'>('card');
  const [paymentTiming, setPaymentTiming] = useState<'now' | 'later'>('now');
  const [cardDetails, setCardDetails] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [achDetails, setAchDetails] = useState({
    nameOnAccount: '',
    bankName: '',
    routingNumber: '',
    accountNumber: '',
    accountType: ''
  });

  const orderTotal = location.state?.total || 174.25;
  const recipientCount = location.state?.recipients || 2;
  const cardProcessingFee = orderTotal * 0.05; // 5% for card
  const achProcessingFee = 5.00; // $5 flat for ACH
  const tax = orderTotal * 0.08; // 8% tax
  
  const finalTotal = paymentMethod === 'card' 
    ? orderTotal + cardProcessingFee + tax
    : orderTotal + achProcessingFee + tax;

  const handlePayment = () => {
    if (paymentTiming === 'later') {
      toast.success('Order placed! Payment will be processed later as requested.');
      navigate('/');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.nameOnCard || !cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv) {
        toast.error('Please fill in all card details');
        return;
      }
    } else {
      if (!achDetails.nameOnAccount || !achDetails.bankName || !achDetails.routingNumber || !achDetails.accountNumber || !achDetails.accountType) {
        toast.error('Please fill in all bank account details');
        return;
      }
    }

    // Mock payment processing
    toast.success('Payment processed successfully! Your order has been placed.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Payment Method</h1>
              <p className="text-gray-600">Complete your order by choosing a payment method</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Payment Timing */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Timing</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentTiming} onValueChange={(value: 'now' | 'later') => setPaymentTiming(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="now" id="now" />
                    <Label htmlFor="now" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Pay Now
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="later" id="later" />
                    <Label htmlFor="later" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pay Later (Net 30 terms)
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            {paymentTiming === 'now' && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={(value: 'card' | 'ach') => setPaymentMethod(value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Pay by Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ach" id="ach" />
                      <Label htmlFor="ach" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Pay by ACH (Bank Transfer)
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Credit/Debit Card Information</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="nameOnCard">Name on Card</Label>
                          <Input
                            id="nameOnCard"
                            value={cardDetails.nameOnCard}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, nameOnCard: e.target.value }))}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'ach' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Bank Account Information</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="nameOnAccount">Name on Account</Label>
                          <Input
                            id="nameOnAccount"
                            value={achDetails.nameOnAccount}
                            onChange={(e) => setAchDetails(prev => ({ ...prev, nameOnAccount: e.target.value }))}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            value={achDetails.bankName}
                            onChange={(e) => setAchDetails(prev => ({ ...prev, bankName: e.target.value }))}
                            placeholder="Chase Bank"
                          />
                        </div>
                        <div>
                          <Label htmlFor="routingNumber">Routing Number</Label>
                          <Input
                            id="routingNumber"
                            value={achDetails.routingNumber}
                            onChange={(e) => setAchDetails(prev => ({ ...prev, routingNumber: e.target.value }))}
                            placeholder="123456789"
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            value={achDetails.accountNumber}
                            onChange={(e) => setAchDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                            placeholder="9876543210"
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountType">Account Type</Label>
                          <Select value={achDetails.accountType} onValueChange={(value) => setAchDetails(prev => ({ ...prev, accountType: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checking">Checking</SelectItem>
                              <SelectItem value="savings">Savings</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Terms for Pay Later */}
            {paymentTiming === 'later' && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Net 30 Payment Terms</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Payment is due within 30 days of invoice date</li>
                      <li>• Invoice will be sent to your email address</li>
                      <li>• Late payment fees may apply after 30 days</li>
                      <li>• Payment can be made via check, ACH, or credit card</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Gift Boxes & Items</span>
                    <span>$150.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping ({recipientCount} recipients)</span>
                    <span>$24.25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${(orderTotal * 0.08).toFixed(2)}</span>
                  </div>
                  
                  {paymentTiming === 'now' && (
                    <div className="flex justify-between">
                      <span>Processing Fee ({paymentMethod === 'card' ? '5%' : '$5.00'})</span>
                      <span>${(paymentMethod === 'card' ? cardProcessingFee : achProcessingFee).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">
                      ${paymentTiming === 'later' 
                        ? (orderTotal + tax).toFixed(2)
                        : finalTotal.toFixed(2)
                      }
                    </span>
                  </div>
                  
                  {paymentTiming === 'later' && (
                    <p className="text-xs text-gray-500">
                      Processing fees will be added if paying by card later
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Secure Processing</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Your {paymentTiming === 'now' ? 'payment' : 'order'} information is encrypted and secure.
                  </p>
                </div>

                <Button 
                  onClick={handlePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {paymentTiming === 'later' 
                    ? `Place Order - Pay Later` 
                    : `Complete Payment - $${finalTotal.toFixed(2)}`
                  }
                </Button>
                
                <div className="text-xs text-gray-500 text-center">
                  By completing this order, you agree to our terms and conditions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPublic;
