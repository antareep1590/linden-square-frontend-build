
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CreditCard, Building2, Shield } from 'lucide-react';
import { toast } from 'sonner';

const PaymentMethod = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ach'>('card');
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

  const orderTotal = location.state?.total || 150.00;
  
  const finalTotal = orderTotal;

  const handlePayment = () => {
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
    toast.success('Payment processed successfully!');
    navigate('/dashboard');
  };

  const handlePayLater = () => {
    toast.success('We have sent the invoice to your registered email.');
    console.log('Generating invoice for order and sending to client email');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Payment Method</h1>
          <p className="text-gray-600">Choose your preferred payment method</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
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
                  <span>Order Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Final Total</span>
                  <span className="text-linden-blue">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Secure Payment</span>
                </div>
                <p className="text-xs text-gray-500">
                  Your payment information is encrypted and secure. We never store your payment details.
                </p>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handlePayment}
                  className="w-full bg-linden-blue hover:bg-linden-blue/90"
                >
                  Confirm & Buy ${finalTotal.toFixed(2)}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handlePayLater}
                  className="w-full border-linden-gold text-linden-gold hover:bg-linden-gold hover:text-white"
                >
                  Pay Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
