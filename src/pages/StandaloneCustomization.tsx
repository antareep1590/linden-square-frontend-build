
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Info, Upload, Package, Gift, Save, Sparkles } from 'lucide-react';

const StandaloneCustomization = () => {
  const [brandedNotecard, setBrandedNotecard] = useState({
    enabled: false,
    template: '',
    message: '',
    logo: null as File | null
  });

  const [giftTags, setGiftTags] = useState({
    enabled: false,
    type: 'preset',
    presetMessage: '',
    customMessage: ''
  });

  const [messageCard, setMessageCard] = useState({
    enabled: false,
    message: '',
    senderName: ''
  });

  // Mock gift boxes with proper image handling
  const giftBoxes = [
    {
      id: '1',
      name: 'Premium Coffee Set',
      theme: 'Professional',
      basePrice: 45.00,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
      items: ['Premium Coffee Beans', 'Ceramic Mug', 'Coffee Filter']
    },
    {
      id: '2',
      name: 'Wellness Package',
      theme: 'Health & Wellness',
      basePrice: 35.00,
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop',
      items: ['Herbal Tea', 'Essential Oil', 'Stress Ball']
    },
    {
      id: '3',
      name: 'Tech Starter Kit',
      theme: 'Technology',
      basePrice: 65.00,
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop',
      items: ['Wireless Charger', 'Bluetooth Speaker', 'Phone Stand']
    }
  ];

  const notecardTemplates = [
    { id: 'template1', name: 'Professional Thank You' },
    { id: 'template2', name: 'Holiday Greeting' },
    { id: 'template3', name: 'Welcome Message' }
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
      setBrandedNotecard(prev => ({ ...prev, logo: file }));
    }
  };

  const handleSave = () => {
    console.log('Saving defaults:', { brandedNotecard, giftTags, messageCard });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customization Defaults</h1>
          <p className="text-gray-600">Set default customization options for gift boxes</p>
        </div>
        <Button onClick={handleSave} className="bg-linden-blue hover:bg-linden-blue/90">
          <Save className="h-4 w-4 mr-2" />
          Save Defaults
        </Button>
      </div>

      {/* How This Works Section */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">How This Works</h3>
              <p className="text-sm text-blue-800">
                All customization options set here will auto-fill during the order process. You can still make edits while placing an order.
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
                <Package className="h-5 w-5" />
                Available Gift Boxes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {giftBoxes.map((box) => (
                  <div key={box.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{box.name}</h3>
                        <p className="text-xs text-gray-600 mb-1">${box.basePrice}</p>
                        <Badge variant="outline" className="text-xs">{box.theme}</Badge>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">
                        Items: {box.items.slice(0, 2).join(', ')}
                        {box.items.length > 2 && ` +${box.items.length - 2} more`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Branded Notecards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Default Custom Elements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
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
                      checked={brandedNotecard.enabled}
                      onCheckedChange={(checked) => setBrandedNotecard(prev => ({ ...prev, enabled: checked }))}
                    />
                  </div>
                </div>

                {brandedNotecard.enabled && (
                  <div className="space-y-4">
                    <div>
                      <Label>Choose Template</Label>
                      <Select
                        value={brandedNotecard.template}
                        onValueChange={(value) => setBrandedNotecard(prev => ({ ...prev, template: value }))}
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
                          onChange={handleFileUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            {brandedNotecard.logo 
                              ? brandedNotecard.logo.name 
                              : 'Click to upload logo (PNG, JPG, max 5MB)'
                            }
                          </p>
                        </label>
                      </div>
                    </div>

                    <div>
                      <Label>Default Message</Label>
                      <Textarea
                        placeholder="Enter your default message for notecards..."
                        value={brandedNotecard.message}
                        onChange={(e) => setBrandedNotecard(prev => ({ ...prev, message: e.target.value }))}
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
                      checked={giftTags.enabled}
                      onCheckedChange={(checked) => setGiftTags(prev => ({ ...prev, enabled: checked }))}
                    />
                  </div>
                </div>

                {giftTags.enabled && (
                  <div className="space-y-4">
                    <div>
                      <Label>Tag Type</Label>
                      <Select
                        value={giftTags.type}
                        onValueChange={(value) => setGiftTags(prev => ({ ...prev, type: value }))}
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

                    {giftTags.type === 'preset' && (
                      <div>
                        <Label>Select Preset Message</Label>
                        <Select
                          value={giftTags.presetMessage}
                          onValueChange={(value) => setGiftTags(prev => ({ ...prev, presetMessage: value }))}
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

                    {giftTags.type === 'custom' && (
                      <div>
                        <Label>Default Custom Tag Message</Label>
                        <Input
                          placeholder="Enter your default custom tag message"
                          value={giftTags.customMessage}
                          onChange={(e) => setGiftTags(prev => ({ ...prev, customMessage: e.target.value }))}
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
                      checked={messageCard.enabled}
                      onCheckedChange={(checked) => setMessageCard(prev => ({ ...prev, enabled: checked }))}
                    />
                  </div>
                </div>

                {messageCard.enabled && (
                  <div className="space-y-4">
                    <div>
                      <Label>Default Message</Label>
                      <Textarea
                        placeholder="Enter your default personal message..."
                        value={messageCard.message}
                        onChange={(e) => setMessageCard(prev => ({ ...prev, message: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Default Sender Name</Label>
                      <Input
                        placeholder="Your name or company name"
                        value={messageCard.senderName}
                        onChange={(e) => setMessageCard(prev => ({ ...prev, senderName: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Preview & Summary */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Defaults Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <h4 className="font-medium">Active Customizations:</h4>
                
                {brandedNotecard.enabled && (
                  <div className="flex justify-between">
                    <span>Branded Notecard</span>
                    <span className="text-green-600">+$5.00</span>
                  </div>
                )}
                
                {giftTags.enabled && (
                  <div className="flex justify-between">
                    <span>Gift Tags</span>
                    <span className="text-green-600">+$2.00</span>
                  </div>
                )}
                
                {messageCard.enabled && (
                  <div className="flex justify-between">
                    <span>Message Card</span>
                    <span className="text-green-600">+$3.00</span>
                  </div>
                )}

                {!brandedNotecard.enabled && !giftTags.enabled && !messageCard.enabled && (
                  <p className="text-gray-500 text-center py-4">No customizations enabled</p>
                )}

                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Per Box:</span>
                  <span className="text-green-600">
                    +${(
                      (brandedNotecard.enabled ? 5 : 0) +
                      (giftTags.enabled ? 2 : 0) +
                      (messageCard.enabled ? 3 : 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleSave}
                  className="w-full bg-linden-blue hover:bg-linden-blue/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Defaults
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  These settings will auto-fill for new orders
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StandaloneCustomization;
