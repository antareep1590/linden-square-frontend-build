
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Upload, Save, Palette, Package, Truck, Gift, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const StandaloneCustomization = () => {
  const [orderLevelCustomization, setOrderLevelCustomization] = useState(true);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [logoUploaded, setLogoUploaded] = useState(false);

  // Mock gift boxes
  const giftBoxes = [
    {
      id: '1',
      name: 'Premium Coffee Collection',
      image: '/placeholder.svg',
      items: ['Colombian Coffee', 'French Roast', 'Organic Blend'],
      selected: true
    },
    {
      id: '2',
      name: 'Wellness Package',
      image: '/placeholder.svg',
      items: ['Essential Oils', 'Herbal Tea', 'Aromatherapy Candle'],
      selected: true
    }
  ];

  // Mock shipping carriers data
  const carriers = [
    {
      id: 'fedex',
      name: 'FedEx',
      services: ['Standard', 'Express', 'Overnight'],
      estimatedCost: '$12.50',
      estimatedDays: '2-3 business days'
    },
    {
      id: 'ups',
      name: 'UPS',
      services: ['Ground', 'Express', 'Next Day'],
      estimatedCost: '$11.75',
      estimatedDays: '3-5 business days'
    },
    {
      id: 'dhl',
      name: 'DHL',
      services: ['Standard', 'Express', 'Priority'],
      estimatedCost: '$15.20',
      estimatedDays: '2-4 business days'
    },
    {
      id: 'usps',
      name: 'USPS',
      services: ['Priority', 'Express', 'Ground'],
      estimatedCost: '$9.99',
      estimatedDays: '3-5 business days'
    }
  ];

  const handleSaveDefaults = () => {
    const customizationDefaults = {
      orderLevelCustomization,
      customMessage,
      selectedCarrier,
      logoUploaded,
      giftBoxes: giftBoxes.filter(box => box.selected)
    };
    localStorage.setItem('customizationDefaults', JSON.stringify(customizationDefaults));
    toast.success('Customization defaults saved successfully');
    console.log('Saved customization defaults:', customizationDefaults);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoUploaded(true);
      toast.success('Logo uploaded successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customization Defaults</h1>
          <p className="text-gray-600">Set up default personalization preferences for your gift boxes</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleSaveDefaults}
            className="bg-linden-blue hover:bg-linden-blue/90"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Defaults
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                About Customization Defaults
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  Configure your default customization preferences here. These settings will 
                  automatically populate when you create new gift orders.
                </p>
                <p>
                  Set up default messages, branding, and personalization options to streamline 
                  your order creation process.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    <strong>Tip:</strong> These defaults can always be modified during the order 
                    creation process, giving you flexibility while saving time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Gift Boxes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Your Selected Gift Boxes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {giftBoxes.filter(box => box.selected).map((box) => (
                  <div key={box.id} className="border rounded-lg p-4">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="font-medium mb-2">{box.name}</h4>
                    <div className="space-y-1">
                      {box.items.map((item, index) => (
                        <Badge key={index} variant="secondary" className="mr-1 mb-1">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customization Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Default Customization Level
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Order-Level Customization</h4>
                  <p className="text-sm text-gray-600">
                    Apply the same customization to all recipients in an order
                  </p>
                </div>
                <Switch
                  checked={orderLevelCustomization}
                  onCheckedChange={setOrderLevelCustomization}
                />
              </div>
              
              {!orderLevelCustomization && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    When disabled, you'll be able to customize each recipient individually during order creation.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Default Message */}
          <Card>
            <CardHeader>
              <CardTitle>Default Custom Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customMessage">Message Template</Label>
                <Textarea
                  id="customMessage"
                  placeholder="Enter your default message template..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-sm text-gray-600 mt-2">
                  This message will be pre-filled in new orders and can be customized per order.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Default Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {logoUploaded ? 'Logo Uploaded' : 'Upload Company Logo'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {logoUploaded 
                      ? 'Click to change your default logo'
                      : 'Upload your logo to include in gift boxes by default'
                    }
                  </p>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Choose Default Shipping Carrier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Choose Default Shipping Carrier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {carriers.map((carrier) => (
                  <div
                    key={carrier.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedCarrier === carrier.id
                        ? 'border-linden-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCarrier(carrier.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Truck className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{carrier.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {carrier.services.join(', ')}
                        </p>
                        <div className="flex items-center gap-4 text-xs">
                          <span>{carrier.estimatedCost}</span>
                          <span>{carrier.estimatedDays}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Defaults Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Customization Level:</span>
                  <span className="font-medium">
                    {orderLevelCustomization ? 'Order-Level' : 'Individual'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Default Message:</span>
                  <span className={customMessage ? 'text-green-600' : 'text-gray-400'}>
                    {customMessage ? 'Set' : 'Not Set'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Company Logo:</span>
                  <span className={logoUploaded ? 'text-green-600' : 'text-gray-400'}>
                    {logoUploaded ? 'Uploaded' : 'Not Uploaded'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Default Carrier:</span>
                  <span className={selectedCarrier ? 'text-green-600' : 'text-gray-400'}>
                    {selectedCarrier ? carriers.find(c => c.id === selectedCarrier)?.name : 'Not Selected'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Gift Boxes:</span>
                  <span className="font-medium text-green-600">
                    {giftBoxes.filter(box => box.selected).length} Selected
                  </span>
                </div>
              </div>

              <Button 
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
                onClick={handleSaveDefaults}
              >
                <Save className="h-4 w-4 mr-2" />
                Save These Defaults
              </Button>

              <div className="text-xs text-gray-500 text-center">
                These settings will be used as defaults in future orders
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StandaloneCustomization;
