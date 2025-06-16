
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Truck, Gift, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const ChooseDeliveryMethod = () => {
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'shipping' | ''>('');

  const handleDeliveryMethodChange = (value: string) => {
    if (value === 'email' || value === 'shipping') {
      setDeliveryMethod(value);
    }
  };

  const handleContinue = () => {
    if (!deliveryMethod) {
      toast.error('Please select a delivery method');
      return;
    }

    if (deliveryMethod === 'email') {
      navigate('/customize-egift');
    } else {
      navigate('/customization');
    }
  };

  const getButtonText = () => {
    if (deliveryMethod === 'email') {
      return 'Continue to E-Gift Setup';
    } else if (deliveryMethod === 'shipping') {
      return 'Continue to Customization';
    }
    return 'Continue';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/box-listing')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gift Boxes
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Choose Delivery Method</h1>
          <p className="text-gray-600">How would you like to send your gifts?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Send Via Email Option */}
        <Card className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
          deliveryMethod === 'email' ? 'ring-2 ring-linden-blue' : ''
        }`}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Send Via Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <RadioGroup value={deliveryMethod} onValueChange={handleDeliveryMethodChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="text-sm font-medium cursor-pointer">
                    Digital Gift Delivery
                  </Label>
                </div>
              </RadioGroup>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">How E-Gifting Works:</h4>
                <p className="text-sm text-blue-800">
                  Recipients will receive a gift notification email where they can redeem and provide their shipping address.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Features Include:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-blue-600" />
                    <span>Message graphic selection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>Send now or schedule delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>Personalization tokens</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Send Via Shipping Option */}
        <Card className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
          deliveryMethod === 'shipping' ? 'ring-2 ring-linden-blue' : ''
        }`}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
              <Truck className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Send Via Shipping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <RadioGroup value={deliveryMethod} onValueChange={handleDeliveryMethodChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="shipping" id="shipping" />
                  <Label htmlFor="shipping" className="text-sm font-medium cursor-pointer">
                    Direct Physical Delivery
                  </Label>
                </div>
              </RadioGroup>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">How Physical Shipping Works:</h4>
                <p className="text-sm text-green-800">
                  You'll collect and manage all shipping details upfront and gifts will be shipped directly to recipients.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Features Include:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>Complete address management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span>Carrier tracking & delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-green-600" />
                    <span>Traditional gift packaging</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-6">
        <Button 
          onClick={handleContinue}
          className="bg-linden-blue hover:bg-linden-blue/90 px-8"
          disabled={!deliveryMethod}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};

export default ChooseDeliveryMethod;
