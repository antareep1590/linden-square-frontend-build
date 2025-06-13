
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, Upload, Image, FileText, Tag, Sparkles, Eye, Save, Gift, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const CustomizationPage = () => {
  const navigate = useNavigate();
  const { selectedBoxes } = useCart();
  const [customizationLevel, setCustomizationLevel] = useState<'order' | 'individual'>('individual');
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
    selectedBoxes.forEach(box => {
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

  const [expandedBoxes, setExpandedBoxes] = useState<{[key: string]: boolean}>({});

  // Mock templates
  const notecardTemplates = [
    { id: 'template1', name: 'Professional Thank You', preview: '/placeholder.svg' },
    { id: 'template2', name: 'Holiday Greeting', preview: '/placeholder.svg' },
    { id: 'template3', name: 'Welcome Message', preview: '/placeholder.svg' }
  ];

  const presetGiftTags = [
    'Thank You!',
    'Congratulations!',
    'Welcome to the Team!',
    'Happy Holidays!',
    'Great Job!',
    'Appreciation'
  ];

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

  const handleContinue = () => {
    console.log('Saving customization data:', { orderLevelCustomization, individualCustomizations });
    toast.success('Customizations saved successfully');
    navigate('/recipient-selection');
  };

  const calculateCustomizationCost = () => {
    let cost = 0;
    if (customizationLevel === 'order') {
      if (orderLevelCustomization.brandedNotecard.enabled) cost += 5.00;
      if (orderLevelCustomization.giftTags.enabled) cost += 2.00;
      if (orderLevelCustomization.messageCard.enabled) cost += 3.00;
    } else {
      selectedBoxes.forEach(box => {
        const customization = individualCustomizations[box.id];
        if (customization?.brandedNotecard.enabled) cost += 5.00;
        if (customization?.giftTags.enabled) cost += 2.00;
        if (customization?.messageCard.enabled) cost += 3.00;
      });
    }
    return cost;
  };

  const toggleBoxExpansion = (boxId: string) => {
    setExpandedBoxes(prev => ({
      ...prev,
      [boxId]: !prev[boxId]
    }));
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
                <Label>Choose Template</Label>
                <Select
                  value={customization.brandedNotecard.template}
                  onValueChange={(value) => updateCustomization('brandedNotecard', 'template', value, boxId)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {notecardTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

              {customization.giftTags.type === 'preset' && (
                <div>
                  <Label>Select Preset Message</Label>
                  <Select
                    value={customization.giftTags.presetMessage}
                    onValueChange={(value) => updateCustomization('giftTags', 'presetMessage', value, boxId)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a message" />
                    </SelectTrigger>
                    <SelectContent>
                      {presetGiftTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

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
        <Button variant="outline" size="sm" onClick={() => navigate('/box-listing')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back To Gift Boxes
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Customize Your Gift Boxes</h1>
          <p className="text-gray-600">Add personal touches and branding to make your gifts special</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-linden-blue">
            ${calculateCustomizationCost().toFixed(2)} customization cost
          </Badge>
          <Button 
            onClick={handleContinue}
            className="bg-linden-blue hover:bg-linden-blue/90"
          >
            Continue to Recipients
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Selected Gift Boxes Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Selected Gift Boxes ({selectedBoxes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedBoxes.map((box) => (
                  <div key={box.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={box.image || '/placeholder.svg'} 
                          alt={box.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
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
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Customization Level
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Individual Customization</h4>
                  <p className="text-sm text-gray-600">Customize each gift box separately</p>
                </div>
                <Switch
                  checked={customizationLevel === 'individual'}
                  onCheckedChange={(checked) => setCustomizationLevel(checked ? 'individual' : 'order')}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Order-Level Customization</h4>
                  <p className="text-sm text-gray-600">Apply the same customization to all gift boxes</p>
                </div>
                <Switch
                  checked={customizationLevel === 'order'}
                  onCheckedChange={(checked) => setCustomizationLevel(checked ? 'order' : 'individual')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Custom Elements Section */}
          {customizationLevel === 'order' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Custom Gift Elements (Order-Level)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderCustomizationForm()}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Individual Gift Box Customizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedBoxes.map((box) => (
                    <Collapsible 
                      key={box.id} 
                      open={expandedBoxes[box.id]} 
                      onOpenChange={() => toggleBoxExpansion(box.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={box.image || '/placeholder.svg'} 
                                alt={box.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{box.name}</h4>
                              <p className="text-sm text-gray-600">{box.theme}</p>
                            </div>
                          </div>
                          {expandedBoxes[box.id] ? 
                            <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          }
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4">
                        <div className="pl-4 border-l-2 border-gray-100">
                          {renderCustomizationForm(box.id)}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Preview & Summary */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Customization Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 min-h-32 flex items-center justify-center">
                <p className="text-sm text-gray-500 text-center">
                  Preview will appear here based on your selections
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <h4 className="font-medium">Active Customizations:</h4>
                {customizationLevel === 'order' ? (
                  <>
                    {orderLevelCustomization.brandedNotecard.enabled && (
                      <div className="flex justify-between">
                        <span>Branded Notecard</span>
                        <span>+$5.00</span>
                      </div>
                    )}
                    {orderLevelCustomization.giftTags.enabled && (
                      <div className="flex justify-between">
                        <span>Gift Tags</span>
                        <span>+$2.00</span>
                      </div>
                    )}
                    {orderLevelCustomization.messageCard.enabled && (
                      <div className="flex justify-between">
                        <span>Message Card</span>
                        <span>+$3.00</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {selectedBoxes.map(box => {
                      const customization = individualCustomizations[box.id];
                      return (
                        <div key={box.id} className="border-l-2 border-gray-200 pl-2 space-y-1">
                          <p className="text-xs font-medium text-gray-700">{box.name}:</p>
                          {customization?.brandedNotecard.enabled && (
                            <div className="flex justify-between text-xs">
                              <span>Branded Notecard</span>
                              <span>+$5.00</span>
                            </div>
                          )}
                          {customization?.giftTags.enabled && (
                            <div className="flex justify-between text-xs">
                              <span>Gift Tags</span>
                              <span>+$2.00</span>
                            </div>
                          )}
                          {customization?.messageCard.enabled && (
                            <div className="flex justify-between text-xs">
                              <span>Message Card</span>
                              <span>+$3.00</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Customization:</span>
                  <span>+${calculateCustomizationCost().toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full mb-2"
                  onClick={() => toast.success('Customizations saved as draft')}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
                <Button 
                  className="w-full bg-linden-blue hover:bg-linden-blue/90"
                  onClick={handleContinue}
                >
                  Continue to Recipients
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPage;
