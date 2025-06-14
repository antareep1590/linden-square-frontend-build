
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Upload, Image, Gift, ChevronDown, ChevronUp, Save, Info, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import CustomizationPreview from '@/components/CustomizationPreview';

const CustomizationPage = () => {
  const navigate = useNavigate();
  const { selectedBoxes } = useCart();
  const [customizationLevel, setCustomizationLevel] = useState<'individual' | 'order'>('individual');
  const [defaultsLoaded, setDefaultsLoaded] = useState(false);
  
  // Fallback gift boxes if cart is empty
  const boxesToUse = selectedBoxes.length > 0 ? selectedBoxes : [
    {
      id: '1',
      name: 'Premium Coffee Collection',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02040d0a901?w=400&h=300&fit=crop',
      theme: 'Appreciation',
      basePrice: 49.99
    },
    {
      id: '2',
      name: 'Wellness Package',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop',
      theme: 'Wellness',
      basePrice: 79.99
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

  const [individualCustomizations, setIndividualCustomizations] = useState<{[key: string]: any}>({});

  const [expandedBoxes, setExpandedBoxes] = useState<{[key: string]: boolean}>({});

  // Load defaults from localStorage on component mount
  useEffect(() => {
    const savedDefaults = localStorage.getItem('customizationDefaults');
    if (savedDefaults) {
      try {
        const defaults = JSON.parse(savedDefaults);
        console.log('Loading customization defaults:', defaults);
        
        // Set the customization level from defaults
        if (defaults.customizationLevel) {
          setCustomizationLevel(defaults.customizationLevel);
        }
        
        // Load order-level customization defaults - this is the key enhancement
        if (defaults.orderLevelCustomization) {
          console.log('Loading order-level defaults:', defaults.orderLevelCustomization);
          setOrderLevelCustomization(defaults.orderLevelCustomization);
        }
        
        // Load individual customizations and initialize for current boxes
        const loadedIndividualCustomizations: {[key: string]: any} = {};
        boxesToUse.forEach(box => {
          if (defaults.individualCustomizations && defaults.individualCustomizations[box.id]) {
            // Use saved customization for this box
            loadedIndividualCustomizations[box.id] = defaults.individualCustomizations[box.id];
          } else {
            // Initialize with default structure
            loadedIndividualCustomizations[box.id] = {
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
          }
        });
        setIndividualCustomizations(loadedIndividualCustomizations);
        
        // Expand first box by default for individual customization
        if (boxesToUse.length > 0 && defaults.customizationLevel === 'individual') {
          setExpandedBoxes({ [boxesToUse[0].id]: true });
        }
        
        setDefaultsLoaded(true);
        toast.success('Loaded your customization defaults');
      } catch (error) {
        console.error('Error loading customization defaults:', error);
        // Initialize with default structure if loading fails
        initializeDefaultCustomizations();
      }
    } else {
      // Initialize with default structure if no saved defaults
      initializeDefaultCustomizations();
    }
  }, []);

  const initializeDefaultCustomizations = () => {
    const initial: {[key: string]: any} = {};
    boxesToUse.forEach(box => {
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
    setIndividualCustomizations(initial);
    
    // Expand first box by default for individual customization
    if (boxesToUse.length > 0) {
      setExpandedBoxes({ [boxesToUse[0].id]: true });
    }
  };

  // Mock templates (exactly like in StandaloneCustomization)
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
    console.log('Saving customization data:', { 
      customizationLevel,
      orderLevelCustomization, 
      individualCustomizations 
    });
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
      boxesToUse.forEach(box => {
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

  const getCurrentPreviewData = () => {
    if (customizationLevel === 'order') {
      return orderLevelCustomization;
    } else {
      // Find the first expanded box or first box
      const expandedBoxId = Object.keys(expandedBoxes).find(id => expandedBoxes[id]) || boxesToUse[0]?.id;
      if (expandedBoxId && individualCustomizations[expandedBoxId]) {
        return individualCustomizations[expandedBoxId];
      }
      // Return empty object with proper structure if no data found
      return {
        brandedNotecard: { enabled: false, template: '', message: '', logo: null },
        giftTags: { enabled: false, type: 'preset', presetMessage: '', customMessage: '' },
        messageCard: { enabled: false, message: '', senderName: '' }
      };
    }
  };

  const getCurrentBoxName = () => {
    if (customizationLevel === 'order') return undefined;
    const expandedBoxId = Object.keys(expandedBoxes).find(id => expandedBoxes[id]);
    return expandedBoxId ? boxesToUse.find(box => box.id === expandedBoxId)?.name : boxesToUse[0]?.name;
  };

  // Render customization form exactly like in StandaloneCustomization
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
        <Button variant="outline" size="sm" onClick={() => navigate('/gift-box-flow')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gift Theme Selection
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Customize Your Gift Boxes</h1>
          <p className="text-gray-600">Add personalized touches to make your gifts special</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-linden-blue">
            ${calculateCustomizationCost().toFixed(2)} total
          </Badge>
          <Button 
            onClick={handleContinue}
            className="bg-linden-blue hover:bg-linden-blue/90"
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Defaults Loaded Notification */}
      {defaultsLoaded && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-800 text-sm">
                  <strong>Defaults loaded:</strong> Your saved customization preferences have been applied. 
                  You can edit any of these settings below.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Selected Gift Boxes Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Selected Gift Boxes ({boxesToUse.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {boxesToUse.map((box) => (
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
                    Apply the same customization to all gift boxes in this order
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
                  {boxesToUse.map((box) => (
                    <Collapsible
                      key={box.id}
                      open={expandedBoxes[box.id]}
                      onOpenChange={() => toggleBoxExpansion(box.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
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
                                  loading="lazy"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium">{box.name}</h3>
                                <p className="text-sm text-gray-600">{box.theme}</p>
                              </div>
                            </div>
                            {expandedBoxes[box.id] ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-4 pl-4 pr-4 pb-4">
                          {renderCustomizationForm(box.id)}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Live Preview */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Live Preview
                {getCurrentBoxName() && (
                  <Badge variant="outline" className="text-xs">
                    {getCurrentBoxName()}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomizationPreview
                customization={getCurrentPreviewData()}
                boxName={getCurrentBoxName()}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPage;
