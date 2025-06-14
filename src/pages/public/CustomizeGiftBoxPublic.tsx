
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Minus, Package, Gift, Trash2, ShoppingCart, Settings, Eye, Upload, FileText, Tag, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CustomizationPreview from '@/components/CustomizationPreview';

const CustomizeGiftBoxPublic = () => {
  const navigate = useNavigate();
  
  // Sample selected boxes (would come from previous selection in real app)
  const [selectedBoxes] = useState([
    {
      id: '1',
      name: 'Executive Appreciation Box',
      theme: 'Professional',
      type: 'curated',
      size: 'Large',
      basePrice: 89.99,
      gifts: [
        { id: '1', name: 'Premium Leather Notebook', price: 25.00, quantity: 1 },
        { id: '2', name: 'Artisan Coffee Selection', price: 18.00, quantity: 1 },
        { id: '3', name: 'Elegant Pen Set', price: 35.00, quantity: 1 }
      ]
    }
  ]);

  const [selectedBoxIndex, setSelectedBoxIndex] = useState(0);
  const [orderLevelCustomization, setOrderLevelCustomization] = useState(false);
  const [orderLevelSettings, setOrderLevelSettings] = useState({
    brandedNotecard: { enabled: false, template: '', message: '', logo: null as File | null },
    giftTags: { enabled: false, type: 'preset', presetMessage: '', customMessage: '' },
    messageCard: { enabled: false, message: '', senderName: '' }
  });
  const [individualSettings, setIndividualSettings] = useState<{[key: string]: any}>({});

  const currentBox = selectedBoxes[selectedBoxIndex];

  const updateGiftQuantity = (giftId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    // Gift quantity update logic would go here
    toast.success('Gift quantity updated');
  };

  const removeGift = (giftId: string) => {
    // Remove gift logic would go here
    toast.success('Gift removed from box');
  };

  const calculateBoxTotal = () => {
    return currentBox.gifts.reduce((total, gift) => 
      total + (gift.price * gift.quantity), 0
    );
  };

  const getCurrentPreviewData = () => {
    if (orderLevelCustomization) {
      return orderLevelSettings;
    } else {
      return individualSettings[currentBox.id] || {};
    }
  };

  const handleOrderLevelToggle = (enabled: boolean) => {
    setOrderLevelCustomization(enabled);
    if (enabled) {
      // Load saved order-level defaults from localStorage
      const savedDefaults = localStorage.getItem('customizationDefaults');
      if (savedDefaults) {
        const defaults = JSON.parse(savedDefaults);
        setOrderLevelSettings(defaults);
      }
    }
  };

  const updateOrderLevelSetting = (category: string, field: string, value: any) => {
    setOrderLevelSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const updateIndividualSetting = (category: string, field: string, value: any) => {
    setIndividualSettings(prev => ({
      ...prev,
      [currentBox.id]: {
        ...prev[currentBox.id],
        [category]: {
          ...prev[currentBox.id]?.[category],
          [field]: value
        }
      }
    }));
  };

  const handleContinueToRecipients = () => {
    navigate('/public/select-recipients');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Customize Your Gift Box</h1>
              <p className="text-gray-600">Personalize your selection and add custom touches</p>
            </div>
            <Button 
              onClick={handleContinueToRecipients}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue to Recipients
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customization Level Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Customization Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Apply customization to all gift boxes</h4>
                    <p className="text-sm text-gray-600">
                      When enabled, these customizations will apply to all gift boxes in your order
                    </p>
                  </div>
                  <Switch
                    checked={orderLevelCustomization}
                    onCheckedChange={handleOrderLevelToggle}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Box Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{currentBox.name}</span>
                  <Badge variant="outline">{currentBox.size}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Theme:</span>
                    <span className="ml-2 font-medium">{currentBox.theme}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 font-medium capitalize">{currentBox.type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gift Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Gift Items ({currentBox.gifts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentBox.gifts.map((gift) => (
                  <div key={gift.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{gift.name}</h4>
                      <p className="text-sm text-gray-600">${gift.price.toFixed(2)} each</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateGiftQuantity(gift.id, gift.quantity - 1)}
                        disabled={gift.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{gift.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateGiftQuantity(gift.id, gift.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">${(gift.price * gift.quantity).toFixed(2)}</p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeGift(gift.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Branded Notecard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Branded Notecard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Include branded notecard</span>
                  <Switch
                    checked={getCurrentPreviewData().brandedNotecard?.enabled || false}
                    onCheckedChange={(checked) => {
                      if (orderLevelCustomization) {
                        updateOrderLevelSetting('brandedNotecard', 'enabled', checked);
                      } else {
                        updateIndividualSetting('brandedNotecard', 'enabled', checked);
                      }
                    }}
                  />
                </div>
                
                {getCurrentPreviewData().brandedNotecard?.enabled && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="template">Template</Label>
                      <Select
                        value={getCurrentPreviewData().brandedNotecard?.template || ''}
                        onValueChange={(value) => {
                          if (orderLevelCustomization) {
                            updateOrderLevelSetting('brandedNotecard', 'template', value);
                          } else {
                            updateIndividualSetting('brandedNotecard', 'template', value);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="warm">Warm & Personal</SelectItem>
                          <SelectItem value="festive">Festive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Custom Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Enter your custom message..."
                        value={getCurrentPreviewData().brandedNotecard?.message || ''}
                        onChange={(e) => {
                          if (orderLevelCustomization) {
                            updateOrderLevelSetting('brandedNotecard', 'message', e.target.value);
                          } else {
                            updateIndividualSetting('brandedNotecard', 'message', e.target.value);
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="logo">Upload Logo</Label>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (orderLevelCustomization) {
                            updateOrderLevelSetting('brandedNotecard', 'logo', file);
                          } else {
                            updateIndividualSetting('brandedNotecard', 'logo', file);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gift Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Gift Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Include gift tags</span>
                  <Switch
                    checked={getCurrentPreviewData().giftTags?.enabled || false}
                    onCheckedChange={(checked) => {
                      if (orderLevelCustomization) {
                        updateOrderLevelSetting('giftTags', 'enabled', checked);
                      } else {
                        updateIndividualSetting('giftTags', 'enabled', checked);
                      }
                    }}
                  />
                </div>
                
                {getCurrentPreviewData().giftTags?.enabled && (
                  <div className="space-y-4">
                    <div>
                      <Label>Tag Type</Label>
                      <Select
                        value={getCurrentPreviewData().giftTags?.type || 'preset'}
                        onValueChange={(value) => {
                          if (orderLevelCustomization) {
                            updateOrderLevelSetting('giftTags', 'type', value);
                          } else {
                            updateIndividualSetting('giftTags', 'type', value);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="preset">Preset Message</SelectItem>
                          <SelectItem value="custom">Custom Message</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {getCurrentPreviewData().giftTags?.type === 'preset' ? (
                      <div>
                        <Label>Preset Message</Label>
                        <Select
                          value={getCurrentPreviewData().giftTags?.presetMessage || ''}
                          onValueChange={(value) => {
                            if (orderLevelCustomization) {
                              updateOrderLevelSetting('giftTags', 'presetMessage', value);
                            } else {
                              updateIndividualSetting('giftTags', 'presetMessage', value);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose preset message" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="thank-you">Thank You</SelectItem>
                            <SelectItem value="appreciation">With Appreciation</SelectItem>
                            <SelectItem value="congratulations">Congratulations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="customTag">Custom Message</Label>
                        <Input
                          id="customTag"
                          placeholder="Enter custom tag message"
                          value={getCurrentPreviewData().giftTags?.customMessage || ''}
                          onChange={(e) => {
                            if (orderLevelCustomization) {
                              updateOrderLevelSetting('giftTags', 'customMessage', e.target.value);
                            } else {
                              updateIndividualSetting('giftTags', 'customMessage', e.target.value);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Message Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Message Card
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Include message card</span>
                  <Switch
                    checked={getCurrentPreviewData().messageCard?.enabled || false}
                    onCheckedChange={(checked) => {
                      if (orderLevelCustomization) {
                        updateOrderLevelSetting('messageCard', 'enabled', checked);
                      } else {
                        updateIndividualSetting('messageCard', 'enabled', checked);
                      }
                    }}
                  />
                </div>
                
                {getCurrentPreviewData().messageCard?.enabled && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="messageContent">Message</Label>
                      <Textarea
                        id="messageContent"
                        placeholder="Enter your personal message..."
                        value={getCurrentPreviewData().messageCard?.message || ''}
                        onChange={(e) => {
                          if (orderLevelCustomization) {
                            updateOrderLevelSetting('messageCard', 'message', e.target.value);
                          } else {
                            updateIndividualSetting('messageCard', 'message', e.target.value);
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="senderName">Sender Name</Label>
                      <Input
                        id="senderName"
                        placeholder="Your name"
                        value={getCurrentPreviewData().messageCard?.senderName || ''}
                        onChange={(e) => {
                          if (orderLevelCustomization) {
                            updateOrderLevelSetting('messageCard', 'senderName', e.target.value);
                          } else {
                            updateIndividualSetting('messageCard', 'senderName', e.target.value);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Summary & Preview */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateBoxTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Customization:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping:</span>
                    <span>Calculated later</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${calculateBoxTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleContinueToRecipients}
                >
                  Continue to Recipients
                </Button>
              </CardContent>
            </Card>

            {/* Customization Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Customization Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CustomizationPreview 
                  customization={getCurrentPreviewData()}
                  boxName={currentBox.name}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeGiftBoxPublic;
