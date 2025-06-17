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
import { Upload, Gift, ArrowLeft, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

const CustomizationPage = () => {
  const navigate = useNavigate();
  const { selectedBoxes } = useCart();
  const [customizationLevel, setCustomizationLevel] = useState<'individual' | 'order'>('individual');

  const selectedGiftBox = selectedBoxes[0]; // Only one gift box can be selected

  // Mock recipients - in real app this would come from context/state
  const recipients = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
    { id: '2', name: 'Michael Chen', email: 'michael.chen@company.com' },
    { id: '3', name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com' }
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
    recipients.forEach(recipient => {
      initial[recipient.id] = {
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
    toast.success('Customization preferences saved for this order');
    navigate('/shipping-fulfillment');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string, recipientId?: string) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'logo') {
        if (customizationLevel === 'order') {
          setOrderLevelCustomization(prev => ({
            ...prev,
            brandedNotecard: { ...prev.brandedNotecard, logo: file }
          }));
        } else if (recipientId) {
          setIndividualCustomizations(prev => ({
            ...prev,
            [recipientId]: {
              ...prev[recipientId],
              brandedNotecard: { ...prev[recipientId].brandedNotecard, logo: file }
            }
          }));
        }
        toast.success('Logo uploaded successfully');
      }
    }
  };

  const toggleCustomization = (type: string, enabled: boolean, recipientId?: string) => {
    if (customizationLevel === 'order') {
      setOrderLevelCustomization(prev => ({
        ...prev,
        [type]: { ...prev[type as keyof typeof prev], enabled }
      }));
    } else if (recipientId) {
      setIndividualCustomizations(prev => ({
        ...prev,
        [recipientId]: {
          ...prev[recipientId],
          [type]: { ...prev[recipientId][type], enabled }
        }
      }));
    }
  };

  const updateCustomization = (type: string, field: string, value: any, recipientId?: string) => {
    if (customizationLevel === 'order') {
      setOrderLevelCustomization(prev => ({
        ...prev,
        [type]: { ...prev[type as keyof typeof prev], [field]: value }
      }));
    } else if (recipientId) {
      setIndividualCustomizations(prev => ({
        ...prev,
        [recipientId]: {
          ...prev[recipientId],
          [type]: { ...prev[recipientId][type], [field]: value }
        }
      }));
    }
  };

  const renderCustomizationForm = (recipientId?: string) => {
    const customization = recipientId ? individualCustomizations[recipientId] : orderLevelCustomization;
    
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
                onCheckedChange={(checked) => toggleCustomization('brandedNotecard', checked, recipientId)}
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
                    onChange={(e) => handleFileUpload(e, 'logo', recipientId)}
                    className="hidden"
                    id={`logo-upload-${recipientId || 'order'}`}
                  />
                  <label htmlFor={`logo-upload-${recipientId || 'order'}`} className="cursor-pointer">
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
                  onChange={(e) => updateCustomization('brandedNotecard', 'message', e.target.value, recipientId)}
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
                onCheckedChange={(checked) => toggleCustomization('giftTags', checked, recipientId)}
              />
            </div>
          </div>

          {customization?.giftTags.enabled && (
            <div className="space-y-4">
              <div>
                <Label>Tag Type</Label>
                <Select
                  value={customization.giftTags.type}
                  onValueChange={(value) => updateCustomization('giftTags', 'type', value, recipientId)}
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
                    onChange={(e) => updateCustomization('giftTags', 'customMessage', e.target.value, recipientId)}
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
                onCheckedChange={(checked) => toggleCustomization('messageCard', checked, recipientId)}
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
                  onChange={(e) => updateCustomization('messageCard', 'message', e.target.value, recipientId)}
                  rows={3}
                />
              </div>
              <div>
                <Label>From (Sender Name)</Label>
                <Input
                  placeholder="Your name or company name"
                  value={customization.messageCard.senderName}
                  onChange={(e) => updateCustomization('messageCard', 'senderName', e.target.value, recipientId)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!selectedGiftBox) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Gift className="h-16 w-16 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-600">No gift box selected</h2>
        <p className="text-gray-500">Please select a gift box first</p>
        <Button onClick={() => navigate('/box-listing')}>
          Select Gift Box
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/recipient-selection')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipients
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Customize Your Order</h1>
          <p className="text-gray-600">Add personalization and branding to your gift box</p>
        </div>
      </div>

      {/* How This Works Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Customization Options</h4>
              <p className="text-blue-700 text-sm">
                Choose how you want to customize your gift box. You can customize individually for each recipient or apply the same customization to all recipients.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Selected Gift Box */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Selected Gift Box
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={selectedGiftBox.image || '/placeholder.svg'} 
                    alt={selectedGiftBox.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{selectedGiftBox.name}</h3>
                  <p className="text-sm text-gray-600">${selectedGiftBox.basePrice}</p>
                  <Badge variant="outline" className="text-xs">{selectedGiftBox.theme}</Badge>
                </div>
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
                    Customize the gift box individually for each recipient with different messages and branding
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
                    All recipients will receive the same customization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle>
                {customizationLevel === 'order' ? 'Order-Level Customization' : 'Individual Recipient Customization'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customizationLevel === 'order' ? (
                renderCustomizationForm()
              ) : (
                <div className="space-y-6">
                  {recipients.map((recipient) => (
                    <div key={recipient.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div>
                          <h3 className="font-medium">{recipient.name}</h3>
                          <p className="text-sm text-gray-600">{recipient.email}</p>
                        </div>
                      </div>
                      {renderCustomizationForm(recipient.id)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Selected Gift Box:</span>
                  <span className="font-medium">{selectedGiftBox.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Recipients:</span>
                  <span className="font-medium">{recipients.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Customization Level:</span>
                  <span className="font-medium">
                    {customizationLevel === 'order' ? 'Order-Level' : 'Individual'}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
                onClick={handleContinue}
              >
                Continue to Shipping
              </Button>

              <div className="text-xs text-gray-500 text-center">
                Next: Configure shipping and fulfillment
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPage;
