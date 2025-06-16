import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Package, Palette, Gift } from 'lucide-react';
import { toast } from 'sonner';

const CustomizationPage = () => {
  const navigate = useNavigate();
  const [customizations, setCustomizations] = useState({
    boxType: '',
    wrappingStyle: '',
    ribbonColor: '',
    giftMessage: '',
    senderName: '',
    specialInstructions: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setCustomizations(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = () => {
    // Basic validation
    if (!customizations.boxType) {
      toast.error('Please select a box type');
      return;
    }
    
    toast.success('Customization preferences saved');
    navigate('/recipient-selection');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/choose-delivery-method')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Delivery Method
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Customize Your Gift Boxes</h1>
          <p className="text-gray-600">Set your preferences for packaging and presentation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Box Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="boxType">Box Type</Label>
              <Select value={customizations.boxType} onValueChange={(value) => handleInputChange('boxType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select box type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Gift Box</SelectItem>
                  <SelectItem value="premium">Premium Gift Box</SelectItem>
                  <SelectItem value="eco">Eco-Friendly Box</SelectItem>
                  <SelectItem value="luxury">Luxury Gift Box</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wrappingStyle">Wrapping Style</Label>
              <Select value={customizations.wrappingStyle} onValueChange={(value) => handleInputChange('wrappingStyle', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select wrapping style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic Wrap</SelectItem>
                  <SelectItem value="modern">Modern Minimal</SelectItem>
                  <SelectItem value="festive">Festive Theme</SelectItem>
                  <SelectItem value="corporate">Corporate Style</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ribbonColor">Ribbon Color</Label>
              <Select value={customizations.ribbonColor} onValueChange={(value) => handleInputChange('ribbonColor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ribbon color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Personalization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Personalization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senderName">From (Sender Name)</Label>
              <Input
                id="senderName"
                placeholder="Your name or company name"
                value={customizations.senderName}
                onChange={(e) => handleInputChange('senderName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="giftMessage">Gift Message</Label>
              <Textarea
                id="giftMessage"
                placeholder="Add a personal message to include with your gifts..."
                value={customizations.giftMessage}
                onChange={(e) => handleInputChange('giftMessage', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                placeholder="Any special packaging or delivery instructions..."
                value={customizations.specialInstructions}
                onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Customization Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Box Type:</span>
              <p className="font-medium">{customizations.boxType || 'Not selected'}</p>
            </div>
            <div>
              <span className="text-gray-600">Wrapping:</span>
              <p className="font-medium">{customizations.wrappingStyle || 'Not selected'}</p>
            </div>
            <div>
              <span className="text-gray-600">Ribbon:</span>
              <p className="font-medium">{customizations.ribbonColor || 'Not selected'}</p>
            </div>
          </div>
          {customizations.giftMessage && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 text-sm">Gift Message:</span>
              <p className="text-sm mt-1">{customizations.giftMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center pt-6">
        <Button 
          onClick={handleContinue}
          className="bg-linden-blue hover:bg-linden-blue/90 px-8"
        >
          Continue to Select Recipients
        </Button>
      </div>
    </div>
  );
};

export default CustomizationPage;
