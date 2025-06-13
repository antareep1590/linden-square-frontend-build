
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, Save, Sparkles, FileText, Tag, Image, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const StandaloneCustomization = () => {
  const [customizationDefaults, setCustomizationDefaults] = useState({
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCustomizationDefaults(prev => ({
        ...prev,
        brandedNotecard: { ...prev.brandedNotecard, logo: file }
      }));
      toast.success('Logo uploaded successfully');
    }
  };

  const toggleCustomization = (type: string, enabled: boolean) => {
    setCustomizationDefaults(prev => ({
      ...prev,
      [type]: { ...prev[type as keyof typeof prev], enabled }
    }));
  };

  const updateCustomization = (type: string, field: string, value: any) => {
    setCustomizationDefaults(prev => ({
      ...prev,
      [type]: { ...prev[type as keyof typeof prev], [field]: value }
    }));
  };

  const handleSaveDefaults = () => {
    // Save customization defaults to local storage or backend
    localStorage.setItem('customizationDefaults', JSON.stringify(customizationDefaults));
    toast.success('Customization defaults saved successfully');
    console.log('Saved customization defaults:', customizationDefaults);
  };

  const handleLoadDefaults = () => {
    // Load customization defaults from local storage or backend
    const saved = localStorage.getItem('customizationDefaults');
    if (saved) {
      setCustomizationDefaults(JSON.parse(saved));
      toast.success('Customization defaults loaded');
    } else {
      toast.info('No saved defaults found');
    }
  };

  const calculateCustomizationCost = () => {
    let cost = 0;
    if (customizationDefaults.brandedNotecard.enabled) cost += 5.00;
    if (customizationDefaults.giftTags.enabled) cost += 2.00;
    if (customizationDefaults.messageCard.enabled) cost += 3.00;
    return cost;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customization Defaults</h1>
          <p className="text-gray-600">Set up default customization options for future gift orders</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleLoadDefaults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Load Saved
          </Button>
          <Badge variant="outline" className="text-linden-blue">
            ${calculateCustomizationCost().toFixed(2)} per order
          </Badge>
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
                <Sparkles className="h-5 w-5" />
                About Customization Defaults
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  Set up your preferred customization options here to streamline future gift orders. 
                  These defaults will automatically populate when you create new orders.
                </p>
                <p>
                  You can always modify or override these settings during the actual order process 
                  if you need different customizations for specific gifts.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    <strong>Tip:</strong> These settings will be applied to all gift boxes in future orders 
                    unless you choose individual customization during the order flow.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branded Notecards */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Branded Notecards
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">+$5.00</Badge>
                  <Switch
                    checked={customizationDefaults.brandedNotecard.enabled}
                    onCheckedChange={(checked) => toggleCustomization('brandedNotecard', checked)}
                  />
                </div>
              </div>
            </CardHeader>
            {customizationDefaults.brandedNotecard.enabled && (
              <CardContent className="space-y-4">
                <div>
                  <Label>Default Template</Label>
                  <Select
                    value={customizationDefaults.brandedNotecard.template}
                    onValueChange={(value) => updateCustomization('brandedNotecard', 'template', value)}
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
                  <Label>Company Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        {customizationDefaults.brandedNotecard.logo 
                          ? customizationDefaults.brandedNotecard.logo.name 
                          : 'Click to upload company logo (PNG, JPG, max 5MB)'
                        }
                      </p>
                    </label>
                  </div>
                </div>

                <div>
                  <Label>Default Message</Label>
                  <Textarea
                    placeholder="Enter your default message for notecards..."
                    value={customizationDefaults.brandedNotecard.message}
                    onChange={(e) => updateCustomization('brandedNotecard', 'message', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Gift Tags */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Gift Tags
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">+$2.00</Badge>
                  <Switch
                    checked={customizationDefaults.giftTags.enabled}
                    onCheckedChange={(checked) => toggleCustomization('giftTags', checked)}
                  />
                </div>
              </div>
            </CardHeader>
            {customizationDefaults.giftTags.enabled && (
              <CardContent className="space-y-4">
                <div>
                  <Label>Tag Type</Label>
                  <Select
                    value={customizationDefaults.giftTags.type}
                    onValueChange={(value) => updateCustomization('giftTags', 'type', value)}
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

                {customizationDefaults.giftTags.type === 'preset' && (
                  <div>
                    <Label>Default Preset Message</Label>
                    <Select
                      value={customizationDefaults.giftTags.presetMessage}
                      onValueChange={(value) => updateCustomization('giftTags', 'presetMessage', value)}
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

                {customizationDefaults.giftTags.type === 'custom' && (
                  <div>
                    <Label>Default Custom Message</Label>
                    <Input
                      placeholder="Enter your default tag message"
                      value={customizationDefaults.giftTags.customMessage}
                      onChange={(e) => updateCustomization('giftTags', 'customMessage', e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Message Cards */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Message Cards
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">+$3.00</Badge>
                  <Switch
                    checked={customizationDefaults.messageCard.enabled}
                    onCheckedChange={(checked) => toggleCustomization('messageCard', checked)}
                  />
                </div>
              </div>
            </CardHeader>
            {customizationDefaults.messageCard.enabled && (
              <CardContent className="space-y-4">
                <div>
                  <Label>Default Message</Label>
                  <Textarea
                    placeholder="Enter your default personal message..."
                    value={customizationDefaults.messageCard.message}
                    onChange={(e) => updateCustomization('messageCard', 'message', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Default Sender Name</Label>
                  <Input
                    placeholder="Your name or company name"
                    value={customizationDefaults.messageCard.senderName}
                    onChange={(e) => updateCustomization('messageCard', 'senderName', e.target.value)}
                  />
                </div>
              </CardContent>
            )}
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
                  <span>Branded Notecards:</span>
                  <span className={customizationDefaults.brandedNotecard.enabled ? 'text-green-600' : 'text-gray-400'}>
                    {customizationDefaults.brandedNotecard.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Gift Tags:</span>
                  <span className={customizationDefaults.giftTags.enabled ? 'text-green-600' : 'text-gray-400'}>
                    {customizationDefaults.giftTags.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Message Cards:</span>
                  <span className={customizationDefaults.messageCard.enabled ? 'text-green-600' : 'text-gray-400'}>
                    {customizationDefaults.messageCard.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Cost per Order:</span>
                    <span>${calculateCustomizationCost().toFixed(2)}</span>
                  </div>
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
                These settings will be applied to future orders automatically
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StandaloneCustomization;
