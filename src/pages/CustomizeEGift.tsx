
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Gift, MessageSquare, Upload, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const CustomizeEGift = () => {
  const navigate = useNavigate();
  const [messageGraphic, setMessageGraphic] = useState('');
  const [customizationType, setCustomizationType] = useState('order-level');
  const [orderLevelMessage, setOrderLevelMessage] = useState('');
  const [senderName, setSenderName] = useState('');

  // Updated gift boxes with proper image handling
  const selectedGiftBoxes = [
    {
      id: '1',
      name: 'Wellness Collection',
      theme: 'Health & Wellness',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02040d0a901?w=400&h=300&fit=crop',
      description: 'A curated collection of wellness products'
    },
    {
      id: '2',
      name: 'Gourmet Treats',
      theme: 'Food & Beverages',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop',
      description: 'Premium snacks and gourmet delights'
    }
  ];

  const messageGraphics = [
    { id: 'birthday', name: 'Birthday', emoji: '🎂' },
    { id: 'thankyou', name: 'Thank You', emoji: '🙏' },
    { id: 'congratulations', name: 'Congratulations', emoji: '🎉' },
    { id: 'holiday', name: 'Holiday', emoji: '🎄' },
    { id: 'custom', name: 'Custom', emoji: '✨' }
  ];

  const handleContinue = () => {
    if (!messageGraphic) {
      toast.error('Please select a message graphic');
      return;
    }
    
    if (customizationType === 'order-level' && !orderLevelMessage.trim()) {
      toast.error('Please enter a gift message');
      return;
    }
    
    navigate('/select-recipients-egift');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    toast.success('CSV file uploaded successfully');
    event.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/choose-delivery-method')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Delivery Method
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Customize Your E-Gift</h1>
          <p className="text-gray-600">Personalize your digital gift experience</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Gift Boxes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Selected Gift Boxes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedGiftBoxes.map((box) => (
                  <div key={box.id} className="border rounded-lg p-4">
                    <div className="aspect-video bg-gray-100 rounded-md mb-3 overflow-hidden">
                      <img 
                        src={box.image} 
                        alt={box.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-medium">{box.name}</h3>
                    <Badge variant="outline" className="mt-1">{box.theme}</Badge>
                    <p className="text-sm text-gray-600 mt-2">{box.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Message Graphic Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Message Graphic Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {messageGraphics.map((graphic) => (
                  <div
                    key={graphic.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      messageGraphic === graphic.id
                        ? 'border-linden-blue bg-linden-blue/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setMessageGraphic(graphic.id)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{graphic.emoji}</div>
                      <div className="text-sm font-medium">{graphic.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customization Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Message Customization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={customizationType} 
                onValueChange={setCustomizationType}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="order-level" id="order-level" />
                  <Label htmlFor="order-level" className="font-medium">Order-Level Customization</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="font-medium">Individual Customization (CSV Upload)</Label>
                </div>
              </RadioGroup>

              {customizationType === 'order-level' && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    <Label htmlFor="orderMessage">Default Gift Message</Label>
                    <Textarea
                      id="orderMessage"
                      placeholder="Enter your gift message..."
                      value={orderLevelMessage}
                      onChange={(e) => setOrderLevelMessage(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senderName">From (Sender Name)</Label>
                    <Input
                      id="senderName"
                      placeholder="Your name or company name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                    />
                  </div>

                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Available Personalization Tokens:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-white">{'{{First Name}}'}</Badge>
                      <Badge variant="outline" className="bg-white">{'{{Last Name}}'}</Badge>
                    </div>
                    <p className="text-sm text-blue-800 mt-2">
                      Use these tokens in your message and they'll be replaced with each recipient's information.
                    </p>
                  </div>
                </div>
              )}

              {customizationType === 'individual' && (
                <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    Upload a CSV file to define personalized messages for each recipient.
                  </p>
                  <div className="flex items-center justify-center border-2 border-dashed border-green-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-green-600 mb-2" />
                      <Label htmlFor="csv-upload" className="cursor-pointer text-sm font-medium text-green-700 hover:text-green-800">
                        Upload CSV File
                      </Label>
                      <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="sr-only" />
                      <p className="text-xs text-green-600 mt-1">CSV with columns: email, custom_message</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Preview */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>E-Gift Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">
                  {messageGraphic ? messageGraphics.find(g => g.id === messageGraphic)?.emoji : '🎁'}
                </div>
                <div className="text-sm font-medium">
                  {messageGraphic ? messageGraphics.find(g => g.id === messageGraphic)?.name : 'Select Graphic'}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Gift Boxes:</span>
                  <p className="text-gray-600 mt-1">
                    {selectedGiftBoxes.length} box(es) selected
                  </p>
                </div>
                
                <div className="text-sm">
                  <span className="font-medium">Customization:</span>
                  <p className="text-gray-600">
                    {customizationType === 'order-level' ? 'Order-level message' : 'Individual CSV messages'}
                  </p>
                </div>
                
                {customizationType === 'order-level' && orderLevelMessage && (
                  <div className="text-sm">
                    <span className="font-medium">Message Preview:</span>
                    <p className="text-gray-600 mt-1 text-xs bg-gray-100 p-2 rounded">
                      {orderLevelMessage.length > 50 ? `${orderLevelMessage.substring(0, 50)}...` : orderLevelMessage}
                    </p>
                  </div>
                )}
                
                {senderName && (
                  <div className="text-sm">
                    <span className="font-medium">From:</span>
                    <p className="text-gray-600">{senderName}</p>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleContinue}
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
              >
                Continue to Recipients
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomizeEGift;
