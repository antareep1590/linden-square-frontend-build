import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Package, Palette, User, Users, Gift, Upload, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const CustomizationPage = () => {
  const navigate = useNavigate();
  const { selectedBoxes } = useCart();
  const [customizationType, setCustomizationType] = useState<'order' | 'individual'>('order');
  const [selectedRecipientIndex, setSelectedRecipientIndex] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState<string>('');

  // Mock recipients data - in real app would come from previous step
  const recipients = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
    { id: 2, name: 'Michael Chen', email: 'michael.chen@company.com' },
    { id: 3, name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com' }
  ];

  const selectedGiftBox = selectedBoxes[0]; // Only one gift box can be selected

  // Message graphic options for digital delivery
  const messageGraphics = [
    { id: 'birthday', name: 'Birthday', icon: '🎂' },
    { id: 'thank-you', name: 'Thank You', icon: '🙏' },
    { id: 'congratulations', name: 'Congratulations', icon: '🎉' },
    { id: 'welcome', name: 'Welcome', icon: '👋' },
    { id: 'holiday', name: 'Holiday', icon: '🎄' },
    { id: 'appreciation', name: 'Appreciation', icon: '⭐' },
    { id: 'celebration', name: 'Celebration', icon: '🥳' },
    { id: 'achievement', name: 'Achievement', icon: '🏆' }
  ];

  // Preset messages for gift tags
  const presetMessages = [
    'Thank you for your hard work!',
    'Congratulations on your achievement!',
    'Welcome to the team!',
    'Happy holidays!',
    'Best wishes from the team',
    'Celebrating your success',
    'You\'re appreciated!',
    'Well done!',
    'Thank you for your dedication',
    'Happy anniversary!'
  ];

  // Digital gift customization state
  const [digitalOrderCustomization, setDigitalOrderCustomization] = useState({
    messageGraphic: '',
    message: '',
    senderName: ''
  });

  const [digitalIndividualCustomizations, setDigitalIndividualCustomizations] = useState<{[key: number]: any}>({});

  // Physical delivery customization state (existing)
  const [orderLevelCustomization, setOrderLevelCustomization] = useState({
    brandedNotecard: {
      enabled: false,
      logo: null as File | null,
      message: ''
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

  const [individualCustomizations, setIndividualCustomizations] = useState<{[key: number]: any}>({});

  // Digital customization handlers
  const handleDigitalOrderChange = (field: string, value: string) => {
    setDigitalOrderCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDigitalIndividualChange = (recipientId: number, field: string, value: string) => {
    setDigitalIndividualCustomizations(prev => ({
      ...prev,
      [recipientId]: {
        ...prev[recipientId],
        [field]: value
      }
    }));
  };

  const getCurrentDigitalCustomization = (recipientId: number) => {
    return digitalIndividualCustomizations[recipientId] || {
      messageGraphic: '',
      message: '',
      senderName: ''
    };
  };

  // Physical delivery customization handlers (existing)
  const handleOrderLevelChange = (type: string, field: string, value: string | boolean | File | null) => {
    setOrderLevelCustomization(prev => ({
      ...prev,
      [type]: {
        ...prev[type as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleIndividualChange = (recipientId: number, type: string, field: string, value: string | boolean | File | null) => {
    setIndividualCustomizations(prev => ({
      ...prev,
      [recipientId]: {
        ...prev[recipientId],
        [type]: {
          ...prev[recipientId]?.[type],
          [field]: value
        }
      }
    }));
  };

  const getCurrentCustomization = (recipientId: number) => {
    return individualCustomizations[recipientId] || {
      brandedNotecard: { enabled: false, logo: null, message: '' },
      giftTags: { enabled: false, type: 'preset', presetMessage: '', customMessage: '' },
      messageCard: { enabled: false, message: '', senderName: '' }
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, recipientId?: number) => {
    const file = event.target.files?.[0];
    if (file) {
      if (recipientId !== undefined) {
        handleIndividualChange(recipientId, 'brandedNotecard', 'logo', file);
      } else {
        handleOrderLevelChange('brandedNotecard', 'logo', file);
      }
      toast.success('Logo uploaded successfully');
    }
  };

  const toggleCustomization = (type: string, enabled: boolean, recipientId?: number) => {
    if (recipientId !== undefined) {
      handleIndividualChange(recipientId, type, 'enabled', enabled);
    } else {
      handleOrderLevelChange(type, 'enabled', enabled);
    }
  };

  const updateCustomization = (type: string, field: string, value: any, recipientId?: number) => {
    if (recipientId !== undefined) {
      handleIndividualChange(recipientId, type, field, value);
    } else {
      handleOrderLevelChange(type, field, value);
    }
  };

  useEffect(() => {
    // Get delivery method from localStorage
    const storedDeliveryMethod = localStorage.getItem('selectedDeliveryMethod');
    if (storedDeliveryMethod) {
      setDeliveryMethod(storedDeliveryMethod);
    }
  }, []);

  const handleContinue = () => {
    // Route based on delivery method
    if (deliveryMethod === 'email') {
      // Digital delivery goes to new E-Gift Send Options page
      navigate('/egift-send-options');
    } else {
      // Physical delivery goes to shipping & fulfillment
      navigate('/shipping-fulfillment');
    }
  };

  const handlePreviousRecipient = () => {
    if (selectedRecipientIndex > 0) {
      setSelectedRecipientIndex(selectedRecipientIndex - 1);
    }
  };

  const handleNextRecipient = () => {
    if (selectedRecipientIndex < recipients.length - 1) {
      setSelectedRecipientIndex(selectedRecipientIndex + 1);
    }
  };

  if (!selectedGiftBox) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Package className="h-16 w-16 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-600">No gift box selected</h2>
        <p className="text-gray-500">Please select a gift box first</p>
        <Button onClick={() => navigate('/box-listing')}>
          Select Gift Box
        </Button>
      </div>
    );
  }

  const currentRecipient = recipients[selectedRecipientIndex];
  const currentCustomization = getCurrentCustomization(currentRecipient.id);
  const currentDigitalCustomization = getCurrentDigitalCustomization(currentRecipient.id);

  const renderDigitalCustomizationOptions = (isIndividual: boolean, recipientId?: number) => {
    const customization = isIndividual ? currentDigitalCustomization : digitalOrderCustomization;
    
    return (
      <div className="space-y-6">
        {/* Message Graphic Selection */}
        <div className="border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium flex items-center gap-2">
              <Image className="h-4 w-4" />
              Message Graphic Selection
            </h4>
            <p className="text-sm text-gray-600">Choose a graphic theme for your digital gift</p>
          </div>

          <Select
            value={customization?.messageGraphic || ''}
            onValueChange={(value) => {
              if (isIndividual && recipientId !== undefined) {
                handleDigitalIndividualChange(recipientId, 'messageGraphic', value);
              } else {
                handleDigitalOrderChange('messageGraphic', value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a message graphic" />
            </SelectTrigger>
            <SelectContent>
              {messageGraphics.map((graphic) => (
                <SelectItem key={graphic.id} value={graphic.id}>
                  <span className="flex items-center gap-2">
                    <span>{graphic.icon}</span>
                    <span>{graphic.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div className="border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium">Message</h4>
            <p className="text-sm text-gray-600">Enter your personal message</p>
          </div>
          <Textarea
            placeholder="Enter your message"
            value={customization?.message || ''}
            onChange={(e) => {
              if (isIndividual && recipientId !== undefined) {
                handleDigitalIndividualChange(recipientId, 'message', e.target.value);
              } else {
                handleDigitalOrderChange('message', e.target.value);
              }
            }}
            rows={4}
          />
        </div>

        {/* Sender Name */}
        <div className="border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium">From (Sender Name)</h4>
            <p className="text-sm text-gray-600">Your name or company name</p>
          </div>
          <Input
            placeholder="Your name or company name"
            value={customization?.senderName || ''}
            onChange={(e) => {
              if (isIndividual && recipientId !== undefined) {
                handleDigitalIndividualChange(recipientId, 'senderName', e.target.value);
              } else {
                handleDigitalOrderChange('senderName', e.target.value);
              }
            }}
          />
        </div>
      </div>
    );
  };

  const renderCustomizationOptions = (isIndividual: boolean, recipientId?: number) => {
    const customization = isIndividual ? currentCustomization : orderLevelCustomization;
    
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
                checked={customization?.brandedNotecard?.enabled || false}
                onCheckedChange={(checked) => toggleCustomization('brandedNotecard', checked, recipientId)}
              />
            </div>
          </div>

          {customization?.brandedNotecard?.enabled && (
            <div className="space-y-4">
              <div>
                <Label>Upload Your Logo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, recipientId)}
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
                  value={customization.brandedNotecard.message || ''}
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
                checked={customization?.giftTags?.enabled || false}
                onCheckedChange={(checked) => toggleCustomization('giftTags', checked, recipientId)}
              />
            </div>
          </div>

          {customization?.giftTags?.enabled && (
            <div className="space-y-4">
              <div>
                <Label>Tag Type</Label>
                <Select
                  value={customization.giftTags?.type || 'preset'}
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

              {customization.giftTags?.type === 'preset' && (
                <div>
                  <Label>Select Preset Message</Label>
                  <Select
                    value={customization.giftTags?.presetMessage || ''}
                    onValueChange={(value) => updateCustomization('giftTags', 'presetMessage', value, recipientId)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a preset message" />
                    </SelectTrigger>
                    <SelectContent>
                      {presetMessages.map((message, index) => (
                        <SelectItem key={index} value={message}>
                          {message}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {customization.giftTags?.type === 'custom' && (
                <div>
                  <Label>Custom Tag Message</Label>
                  <Input
                    placeholder="Enter your custom tag message"
                    value={customization.giftTags?.customMessage || ''}
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
                checked={customization?.messageCard?.enabled || false}
                onCheckedChange={(checked) => toggleCustomization('messageCard', checked, recipientId)}
              />
            </div>
          </div>

          {customization?.messageCard?.enabled && (
            <div className="space-y-4">
              <div>
                <Label>Message</Label>
                <Textarea
                  placeholder="Enter your personal message..."
                  value={customization.messageCard?.message || ''}
                  onChange={(e) => updateCustomization('messageCard', 'message', e.target.value, recipientId)}
                  rows={3}
                />
              </div>
              <div>
                <Label>From (Sender Name)</Label>
                <Input
                  placeholder="Your name or company name"
                  value={customization.messageCard?.senderName || ''}
                  onChange={(e) => updateCustomization('messageCard', 'senderName', e.target.value, recipientId)}
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
        <Button variant="outline" size="sm" onClick={() => navigate('/recipient-selection')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipients
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Customize Your Order</h1>
          <p className="text-gray-600">
            {deliveryMethod === 'email' 
              ? 'Personalize your digital gift with custom messages and graphics (optional)'
              : 'Personalize your gift box with custom messages and branding (optional)'
            }
          </p>
        </div>
        <Button 
          onClick={handleContinue}
          className="bg-linden-blue hover:bg-linden-blue/90"
        >
          {deliveryMethod === 'email' ? 'Continue to Digital Gift Settings' : 'Continue to Shipping'}
        </Button>
      </div>

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
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={selectedGiftBox.image || '/placeholder.svg'} 
                    alt={selectedGiftBox.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedGiftBox.name}</h3>
                  <p className="text-gray-600">{selectedGiftBox.theme}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{selectedGiftBox.size}</Badge>
                    <Badge variant="outline">${selectedGiftBox.basePrice}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customization Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Customization Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={customizationType} 
                onValueChange={(value: 'order' | 'individual') => setCustomizationType(value)}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="order" id="order" />
                  <Label htmlFor="order" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Order-Level Customization</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      All recipients will receive the same customization
                    </p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Individual Customization</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Customize the gift box differently for each recipient
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Customization Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {customizationType === 'order' ? 'Order Customization' : `Customize for ${currentRecipient.name}`}
              </CardTitle>
              {customizationType === 'individual' && (
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousRecipient}
                    disabled={selectedRecipientIndex === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    {selectedRecipientIndex + 1} of {recipients.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextRecipient}
                    disabled={selectedRecipientIndex === recipients.length - 1}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {customizationType === 'individual' && (
                <div className="bg-blue-50 p-3 rounded-lg mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Recipient:</strong> {currentRecipient.name} ({currentRecipient.email})
                  </p>
                </div>
              )}
              
              {deliveryMethod === 'email' ? (
                renderDigitalCustomizationOptions(
                  customizationType === 'individual', 
                  customizationType === 'individual' ? currentRecipient.id : undefined
                )
              ) : (
                renderCustomizationOptions(
                  customizationType === 'individual', 
                  customizationType === 'individual' ? currentRecipient.id : undefined
                )
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Customization Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Recipients:</span>
                <span className="font-medium">{recipients.length}</span>
              </div>
              
              <Button 
                className="w-full bg-linden-blue hover:bg-linden-blue/90 mt-4"
                onClick={handleContinue}
              >
                {deliveryMethod === 'email' ? 'Continue to Digital Gift Settings' : 'Continue to Shipping'}
              </Button>

              <div className="text-xs text-gray-500 mt-4">
                <p>
                  Customizations are optional. You can proceed without any customizations or add them to personalize your gift boxes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Individual Recipients List */}
          {customizationType === 'individual' && (
            <Card>
              <CardHeader>
                <CardTitle>Recipients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recipients.map((recipient, index) => {
                    const hasCustomization = deliveryMethod === 'email' 
                      ? digitalIndividualCustomizations[recipient.id] && (
                          digitalIndividualCustomizations[recipient.id].messageGraphic ||
                          digitalIndividualCustomizations[recipient.id].message?.trim() ||
                          digitalIndividualCustomizations[recipient.id].senderName?.trim()
                        )
                      : individualCustomizations[recipient.id] && (
                          (individualCustomizations[recipient.id].brandedNotecard?.enabled && individualCustomizations[recipient.id].brandedNotecard?.message?.trim()) ||
                          (individualCustomizations[recipient.id].giftTags?.enabled && (individualCustomizations[recipient.id].giftTags?.presetMessage || individualCustomizations[recipient.id].giftTags?.customMessage)) ||
                          (individualCustomizations[recipient.id].messageCard?.enabled && individualCustomizations[recipient.id].messageCard?.message?.trim())
                        );
                    
                    return (
                      <div
                        key={recipient.id}
                        className={`p-2 rounded-lg cursor-pointer transition-colors ${
                          index === selectedRecipientIndex 
                            ? 'bg-linden-blue text-white' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedRecipientIndex(index)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{recipient.name}</span>
                          {hasCustomization && (
                            <Badge variant={index === selectedRecipientIndex ? "outline" : "default"} 
                                  className={index === selectedRecipientIndex ? "border-white text-white" : "bg-green-100 text-green-800"}>
                              Done
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizationPage;
