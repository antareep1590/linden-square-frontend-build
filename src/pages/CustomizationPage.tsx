
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Upload, Gift, Save, Info } from 'lucide-react';
import { toast } from 'sonner';

const CustomizationPage = () => {
  const navigate = useNavigate();
  const [customizationLevel, setCustomizationLevel] = useState<'individual' | 'order'>('individual');

  // Sample gift boxes with proper image handling
  const giftBoxes = [
    {
      id: '1',
      name: 'Premium Coffee Collection',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02040d0a901?w=400&h=300&fit=crop',
      theme: 'Appreciation',
      basePrice: 49.99,
      items: ['Premium Coffee Beans', 'Coffee Mug', 'Artisan Cookies']
    },
    {
      id: '2',
      name: 'Wellness Package',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop',
      theme: 'Wellness',
      basePrice: 79.99,
      items: ['Essential Oils', 'Aromatherapy Candle', 'Wellness Journal']
    },
    {
      id: '3',
      name: 'Tech Accessories Kit',
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
      theme: 'Professional',
      basePrice: 89.99,
      items: ['Wireless Charger', 'Phone Stand', 'Cable Organizer']
    }
  ];

  const [orderLevelCustomization, setOrderLevelCustomization] = useState({
    brandedNotecard: {
      enabled: false,
      template: '',
      message: '',
      logo: null as File | null
    },
    giftTags: {
      enabled: false,
      type: 'preset',
      presetMessage: '',
      customMessage: ''
    },
    messageCard: {
      enabled: false,
      message: '',
      senderName: ''
    }
  });

  const [individualCustomizations, setIndividualCustomizations] = useState<{[key: string]: any}>(() => {
    const initial: {[key: string]: any} = {};
    giftBoxes.forEach(box => {
      initial[box.id] = {
        brandedNotecard: {
          enabled: false,
          template: '',
          message: '',
          logo: null as File | null
        },
        giftTags: {
          enabled: false,
          type: 'preset',
          presetMessage: '',
          customMessage: ''
        },
        messageCard: {
          enabled: false,
          message: '',
          senderName: ''
        }
      };
    });
    return initial;
  });

  const handleContinue = () => {
    navigate('/recipient-selection');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string, boxId?: string) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'logo') {
        if (customizationLevel === 'order') {
          setOrderLevelCustomization(prev => ({
            ...prev,
            brandedNotecard: { ...prev.brandedNotecard, logo: file }
          }));
        } else if (boxId) {
          setIndividualCustomizations(prev => ({
            ...prev,
            [boxId]: {
              ...prev[boxId],
              brandedNotecard: { ...prev[boxId].brandedNotecard, logo: file }
            }
          }));
        }
        toast.success('Logo uploaded successfully');
      }
    }
  };

  const toggleCustomization = (type: string, enabled: boolean, boxId?: string) => {
    if (customizationLevel === 'order') {
      setOrderLevelCustomization(prev => ({
        ...prev,
        [type]: { ...prev[type as keyof typeof prev], enabled }
      }));
    } else if (boxId) {
      setIndividualCustomizations(prev => ({
        ...prev,
        [boxId]: {
          ...prev[boxId],
          [type]: { ...prev[boxId][type], enabled }
        }
      }));
    }
  };

  const updateCustomization = (type: string, field: string, value: any, boxId?: string) => {
    if (customizationLevel === 'order') {
      setOrderLevelCustomization(prev => ({
        ...prev,
        [type]: { ...prev[type as keyof typeof prev], [field]: value }
      }));
    } else if (boxId) {
      setIndividualCustomizations(prev => ({
        ...prev,
        [boxId]: {
          ...prev[boxId],
          [type]: { ...prev[boxId][type], [field]: value }
        }
      }));
    }
  };

  const renderCustomizationForm = (boxId?: string) => {
    const customization = boxId ? individualCustomizations[boxId] : orderLevelCustomization;
    
    return (
      <div className="space-y-6">
        {/* Branded Notecards */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium">Branded Notecards</h4>
              <p className="text-sm text-gray-600">Add your logo and custom message</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">+$5.00</Badge>
              <Switch
                checked={customization?.brandedNotecard.enabled || false}
                onCheckedChange={(checked) => toggleCustomization('brandedNotecard', checked, boxId)}
              />
            </div>
          </div>

          {customization?.brandedNotecard.enabled && (
            <div className="space-y-4">
              <div>
                <Label>Upload Your Logo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logo', boxId)}
                    className="hidden"
                    id={`logo-upload-${boxId || 'order'}`}
                  />
                  <label htmlFor={`logo-upload-${boxId || 'order'}`} className="cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {customization.brandedNotecard.logo 
                        ? customization.brandedNotecard.logo.name 
                        : 'Click to upload logo (PNG, JPG, max 5MB)'
                      }
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <Label>Custom Message</Label>
                <Textarea
                  placeholder="Enter your message for the notecard..."
                  value={customization.brandedNotecard.message}
                  onChange={(e) => updateCustomization('brandedNotecard', 'message', e.target.value, boxId)}
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        {/* Gift Tags */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium">Gift Tags</h4>
              <p className="text-sm text-gray-600">Add special tags to your gifts</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">+$2.00</Badge>
              <Switch
                checked={customization?.giftTags.enabled || false}
                onCheckedChange={(checked) => toggleCustomization('giftTags', checked, boxId)}
              />
            </div>
          </div>

          {customization?.giftTags.enabled && (
            <div className="space-y-4">
              <div>
                <Label>Tag Type</Label>
                <Select
                  value={customization.giftTags.type}
                  onValueChange={(value) => updateCustomization('giftTags', 'type', value, boxId)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preset">Preset Messages</SelectItem>
                    <SelectItem value="custom">Custom Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {customization.giftTags.type === 'custom' && (
                <div>
                  <Label>Custom Tag Message</Label>
                  <Input
                    placeholder="Enter your custom tag message"
                    value={customization.giftTags.customMessage}
                    onChange={(e) => updateCustomization('giftTags', 'customMessage', e.target.value, boxId)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Message Cards */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium">Message Cards</h4>
              <p className="text-sm text-gray-600">Include a personal message inside the box</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">+$3.00</Badge>
              <Switch
                checked={customization?.messageCard.enabled || false}
                onCheckedChange={(checked) => toggleCustomization('messageCard', checked, boxId)}
              />
            </div>
          </div>

          {customization?.messageCard.enabled && (
            <div className="space-y-4">
              <div>
                <Label>Message</Label>
                <Textarea
                  placeholder="Enter your personal message..."
                  value={customization.messageCard.message}
                  onChange={(e) => updateCustomization('messageCard', 'message', e.target.value, boxId)}
                  rows={3}
                />
              </div>
              <div>
                <Label>From (Sender Name)</Label>
                <Input
                  placeholder="Your name or company name"
                  value={customization.messageCard.senderName}
                  onChange={(e) => updateCustomization('messageCard', 'senderName', e.target.value, boxId)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/choose-delivery-method')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Delivery Method
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Customize Your Gift Boxes</h1>
          <p className="text-gray-600">Add personalization and branding to your shipping gifts</p>
        </div>
      </div>

      {/* How This Works Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Customization for Shipping Gifts</h4>
              <p className="text-blue-700 text-sm">
                Configure how your physical gift boxes will be customized and branded before shipping to recipients.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Available Gift Boxes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Selected Gift Boxes ({giftBoxes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {giftBoxes.map((box) => (
                  <div key={box.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                      <div className="flex-1">
                        <h3 className="font-medium">{box.name}</h3>
                        <p className="text-sm text-gray-600">${box.basePrice}</p>
                        <Badge variant="outline" className="text-xs">{box.theme}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customization Level Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Customization Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    customizationLevel === 'individual'
                      ? 'border-linden-blue bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setCustomizationLevel('individual')}
                >
                  <h4 className="font-medium mb-2">Individual Customization</h4>
                  <p className="text-sm text-gray-600">
                    Customize each gift box individually with different messages and branding
                  </p>
                </div>
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    customizationLevel === 'order'
                      ? 'border-linden-blue bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setCustomizationLevel('order')}
                >
                  <h4 className="font-medium mb-2">Order-Level Customization</h4>
                  <p className="text-sm text-gray-600">
                    Apply the same customization to all gift boxes in an order
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle>
                {customizationLevel === 'order' ? 'Order-Level Customization' : 'Individual Box Customization'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customizationLevel === 'order' ? (
                renderCustomizationForm()
              ) : (
                <div className="space-y-6">
                  {giftBoxes.map((box) => (
                    <div key={box.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                        <div>
                          <h3 className="font-medium">{box.name}</h3>
                          <p className="text-sm text-gray-600">{box.theme}</p>
                        </div>
                      </div>
                      {renderCustomizationForm(box.id)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Navigation */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Customization Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Customization Level:</span>
                  <span className="font-medium">
                    {customizationLevel === 'order' ? 'Order-Level' : 'Individual'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Selected Boxes:</span>
                  <span className="font-medium">{giftBoxes.length}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
                onClick={handleContinue}
              >
                Continue to Select Recipients
              </Button>

              <div className="text-xs text-gray-500 text-center">
                Next: Add recipient details and shipping addresses
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPage;
