
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Save, Info, Truck, MapPin, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

const StandaloneShipping = () => {
  const [shippingDefaults, setShippingDefaults] = useState({
    defaultCarrier: 'fedex',
    priorityShipping: false,
    signatureRequired: false,
    trackingNotifications: true,
    defaultAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    defaultRecipient: {
      name: '',
      email: '',
      phone: '',
      department: ''
    },
    deliveryInstructions: ''
  });

  const carriers = [
    { id: 'fedex', name: 'FedEx', estimatedDays: '2-3 business days' },
    { id: 'ups', name: 'UPS', estimatedDays: '2-4 business days' },
    { id: 'usps', name: 'USPS', estimatedDays: '3-5 business days' },
    { id: 'dhl', name: 'DHL', estimatedDays: '1-3 business days' }
  ];

  const handleSaveDefaults = () => {
    localStorage.setItem('shippingDefaults', JSON.stringify({
      ...shippingDefaults,
      savedAt: new Date().toISOString()
    }));
    toast.success('Shipping defaults saved successfully');
    console.log('Saved shipping defaults:', shippingDefaults);
  };

  const updateShippingDefault = (field: string, value: any) => {
    setShippingDefaults(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAddressField = (field: string, value: string) => {
    setShippingDefaults(prev => ({
      ...prev,
      defaultAddress: {
        ...prev.defaultAddress,
        [field]: value
      }
    }));
  };

  const updateRecipientField = (field: string, value: string) => {
    setShippingDefaults(prev => ({
      ...prev,
      defaultRecipient: {
        ...prev.defaultRecipient,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Shipping & Fulfillment Defaults</h1>
          <p className="text-gray-600">Set up default shipping preferences and recipient information</p>
        </div>
        <Button 
          onClick={handleSaveDefaults}
          className="bg-linden-blue hover:bg-linden-blue/90"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Defaults
        </Button>
      </div>

      {/* Helper Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-800 text-sm">
                <strong>How this works:</strong> All shipping preferences and recipient data added here will auto-fill during the order process. 
                You can still make edits while placing an order.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Default Shipping Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Preferred Carrier</Label>
              <Select 
                value={shippingDefaults.defaultCarrier} 
                onValueChange={(value) => updateShippingDefault('defaultCarrier', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {carriers.map(carrier => (
                    <SelectItem key={carrier.id} value={carrier.id}>
                      <div>
                        <div className="font-medium">{carrier.name}</div>
                        <div className="text-sm text-gray-500">{carrier.estimatedDays}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Priority Shipping</Label>
                  <p className="text-sm text-gray-600">Expedited delivery when available</p>
                </div>
                <Switch
                  checked={shippingDefaults.priorityShipping}
                  onCheckedChange={(checked) => updateShippingDefault('priorityShipping', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Signature Required</Label>
                  <p className="text-sm text-gray-600">Require signature on delivery</p>
                </div>
                <Switch
                  checked={shippingDefaults.signatureRequired}
                  onCheckedChange={(checked) => updateShippingDefault('signatureRequired', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Tracking Notifications</Label>
                  <p className="text-sm text-gray-600">Send tracking updates to recipients</p>
                </div>
                <Switch
                  checked={shippingDefaults.trackingNotifications}
                  onCheckedChange={(checked) => updateShippingDefault('trackingNotifications', checked)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Default Delivery Instructions</Label>
              <Textarea
                placeholder="Enter default delivery instructions..."
                value={shippingDefaults.deliveryInstructions}
                onChange={(e) => updateShippingDefault('deliveryInstructions', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Default Address & Recipient */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Default Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Street Address</Label>
                <Input
                  placeholder="123 Main Street"
                  value={shippingDefaults.defaultAddress.street}
                  onChange={(e) => updateAddressField('street', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    placeholder="City"
                    value={shippingDefaults.defaultAddress.city}
                    onChange={(e) => updateAddressField('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    placeholder="State"
                    value={shippingDefaults.defaultAddress.state}
                    onChange={(e) => updateAddressField('state', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ZIP Code</Label>
                  <Input
                    placeholder="12345"
                    value={shippingDefaults.defaultAddress.zipCode}
                    onChange={(e) => updateAddressField('zipCode', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select 
                    value={shippingDefaults.defaultAddress.country} 
                    onValueChange={(value) => updateAddressField('country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="MX">Mexico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Default Recipient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="John Doe"
                  value={shippingDefaults.defaultRecipient.name}
                  onChange={(e) => updateRecipientField('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="john@company.com"
                  value={shippingDefaults.defaultRecipient.email}
                  onChange={(e) => updateRecipientField('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="(555) 123-4567"
                  value={shippingDefaults.defaultRecipient.phone}
                  onChange={(e) => updateRecipientField('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  placeholder="Sales"
                  value={shippingDefaults.defaultRecipient.department}
                  onChange={(e) => updateRecipientField('department', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StandaloneShipping;
