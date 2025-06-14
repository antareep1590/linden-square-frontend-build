
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CreditCard, Building2, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const PaymentMethod = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedBoxes, getTotalCost } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ach'>('card');
  const [expandedSection, setExpandedSection] = useState<string | null>('boxes');
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

  // Calculate order totals
  const subtotal = getTotalCost();
  const shippingCost = location.state?.shippingCost || 25.00; // Default or from location state
  const customizationCosts = selectedBoxes.reduce((total, box) => {
    return total + (box.personalization?.addOnsCost || 0);
  }, 0);
  
  // Order totals
  const baseOrderTotal = subtotal + shippingCost + customizationCosts;
  const cardProcessingFee = baseOrderTotal * 0.05; // 5% for card
  const achProcessingFee = 5.00; // $5 flat for ACH
  
  const finalTotal = paymentMethod === 'card' 
    ? baseOrderTotal + cardProcessingFee 
    : baseOrderTotal + achProcessingFee;

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

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

        {/* Enhanced Payment Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Gift Boxes Section */}
              <div className="border-b pb-2">
                <Button 
                  variant="ghost" 
                  className="flex justify-between items-center w-full p-2 text-left font-medium"
                  onClick={() => toggleSection('boxes')}
                >
                  <span>Gift Boxes ({selectedBoxes.length})</span>
                  {expandedSection === 'boxes' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Button>
                
                {expandedSection === 'boxes' && (
                  <div className="mt-2 text-sm">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-full">Box</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBoxes.map((box, index) => {
                          // Calculate box cost (base price + gifts)
                          const giftsCost = box.gifts.reduce((total, gift) => 
                            total + (gift.price * gift.quantity), 0
                          );
                          const boxTotal = box.basePrice + giftsCost;
                          
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{box.name}</div>
                                  <div className="text-xs text-muted-foreground">{box.size} - {box.theme}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">${boxTotal.toFixed(2)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    <div className="flex justify-between mt-2 font-medium">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Customizations Section */}
              <div className="border-b pb-2">
                <Button 
                  variant="ghost" 
                  className="flex justify-between items-center w-full p-2 text-left font-medium"
                  onClick={() => toggleSection('customizations')}
                >
                  <span>Customizations</span>
                  {expandedSection === 'customizations' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Button>
                
                {expandedSection === 'customizations' && (
                  <div className="mt-2 text-sm">
                    {customizationCosts > 0 ? (
                      <div className="space-y-2">
                        {selectedBoxes.map((box, index) => {
                          if (!box.personalization || box.personalization.addOnsCost === 0) return null;
                          
                          return (
                            <div key={index} className="flex justify-between items-start">
                              <div>
                                <span className="block">{box.name}</span>
                                {box.personalization?.selectedAddOns?.map((addon, idx) => (
                                  <span key={idx} className="block text-xs text-muted-foreground">
                                    - {addon.name}: ${addon.price.toFixed(2)}
                                  </span>
                                ))}
                              </div>
                              <span>${box.personalization.addOnsCost.toFixed(2)}</span>
                            </div>
                          );
                        })}
                        <div className="flex justify-between pt-2 font-medium">
                          <span>Total Customizations</span>
                          <span>${customizationCosts.toFixed(2)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground italic">No customization costs</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Shipping Charges Section */}
              <div className="border-b pb-2">
                <Button 
                  variant="ghost" 
                  className="flex justify-between items-center w-full p-2 text-left font-medium"
                  onClick={() => toggleSection('shipping')}
                >
                  <span>Shipping Charges</span>
                  {expandedSection === 'shipping' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Button>
                
                {expandedSection === 'shipping' && (
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between">
                      <div>
                        <span className="block">Shipping Fee</span>
                        <span className="text-xs text-muted-foreground">
                          {selectedBoxes.length} {selectedBoxes.length === 1 ? 'box' : 'boxes'}
                        </span>
                      </div>
                      <span>${shippingCost.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Processing Fee Section */}
              <div className="border-b pb-2">
                <div className="flex justify-between items-center p-2">
                  <div>
                    <span className="font-medium">Processing Fee</span>
                    <Badge variant="outline" className="ml-2">
                      {paymentMethod === 'card' ? '5%' : 'Flat $5'}
                    </Badge>
                  </div>
                  <span className="font-medium">
                    ${(paymentMethod === 'card' ? cardProcessingFee : achProcessingFee).toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Final Total */}
              <div className="pt-2">
                <div className="flex justify-between font-bold text-lg">
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

              <Button 
                onClick={handlePayment}
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
              >
                Confirm & Pay ${finalTotal.toFixed(2)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
