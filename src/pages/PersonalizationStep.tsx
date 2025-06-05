
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Gift, Heart, Tag } from 'lucide-react';

interface PersonalizationOption {
  id: string;
  name: string;
  type: 'ribbon' | 'card' | 'wrap' | 'tag';
  price: number;
  options: string[];
}

interface PersonalizationConfig {
  ribbonColor: string;
  giftWrap: string;
  cardMessage: string;
  tagMessage: string;
  selectedOptions: Map<string, string>;
}

const personalizationOptions: PersonalizationOption[] = [
  {
    id: 'ribbon',
    name: 'Ribbon Color',
    type: 'ribbon',
    price: 5,
    options: ['Red', 'Gold', 'Silver', 'Blue', 'Green', 'Purple']
  },
  {
    id: 'wrap',
    name: 'Gift Wrap Style',
    type: 'wrap',
    price: 8,
    options: ['Classic Brown', 'Elegant White', 'Festive Pattern', 'Luxury Black', 'Floral Design']
  },
  {
    id: 'card',
    name: 'Printed Card',
    type: 'card',
    price: 3,
    options: ['Business Card', 'Thank You Card', 'Birthday Card', 'Holiday Card', 'Custom Message']
  },
  {
    id: 'tag',
    name: 'Gift Tag',
    type: 'tag',
    price: 2,
    options: ['Standard Tag', 'Premium Tag', 'Custom Shape', 'Logo Tag']
  }
];

const PersonalizationStep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [config, setConfig] = useState<PersonalizationConfig>({
    ribbonColor: '',
    giftWrap: '',
    cardMessage: '',
    tagMessage: '',
    selectedOptions: new Map()
  });

  const updateOption = (optionId: string, value: string) => {
    setConfig(prev => {
      const newOptions = new Map(prev.selectedOptions);
      if (value) {
        newOptions.set(optionId, value);
      } else {
        newOptions.delete(optionId);
      }
      return { ...prev, selectedOptions: newOptions };
    });
  };

  const updateMessage = (field: keyof PersonalizationConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const calculatePersonalizationCost = () => {
    return Array.from(config.selectedOptions.keys()).reduce((total, optionId) => {
      const option = personalizationOptions.find(o => o.id === optionId);
      return total + (option?.price || 0);
    }, 0);
  };

  const handleContinue = () => {
    navigate('/final-summary', { 
      state: { 
        ...location.state, 
        personalization: config 
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Personalize Your Gift Box</h1>
          <p className="text-gray-600">Add special touches to make your gift memorable</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personalization Options */}
        <div className="lg:col-span-2 space-y-6">
          {personalizationOptions.map(option => (
            <Card key={option.id}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {option.type === 'ribbon' && <Gift className="h-5 w-5" />}
                    {option.type === 'card' && <Heart className="h-5 w-5" />}
                    {option.type === 'wrap' && <Gift className="h-5 w-5" />}
                    {option.type === 'tag' && <Tag className="h-5 w-5" />}
                    {option.name}
                  </div>
                  <Badge variant="outline">+${option.price}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {option.options.map(optionValue => (
                    <Button
                      key={optionValue}
                      variant={config.selectedOptions.get(option.id) === optionValue ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const currentValue = config.selectedOptions.get(option.id);
                        updateOption(option.id, currentValue === optionValue ? '' : optionValue);
                      }}
                      className={
                        config.selectedOptions.get(option.id) === optionValue 
                          ? "bg-linden-blue hover:bg-linden-blue/90" 
                          : ""
                      }
                    >
                      {optionValue}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Custom Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Custom Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Card Message</label>
                <Textarea
                  placeholder="Enter your personalized message for the card..."
                  value={config.cardMessage}
                  onChange={(e) => updateMessage('cardMessage', e.target.value)}
                  className="min-h-20"
                />
                <p className="text-xs text-gray-500 mt-1">Max 150 characters</p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Gift Tag Message</label>
                <Input
                  placeholder="Brief message for the gift tag..."
                  value={config.tagMessage}
                  onChange={(e) => updateMessage('tagMessage', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Max 50 characters</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview and Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Personalization Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {Array.from(config.selectedOptions.entries()).map(([optionId, value]) => {
                  const option = personalizationOptions.find(o => o.id === optionId);
                  return option ? (
                    <div key={optionId} className="flex justify-between text-sm">
                      <span>{option.name}: {value}</span>
                      <span>${option.price}</span>
                    </div>
                  ) : null;
                })}
                
                {config.cardMessage && (
                  <div className="text-sm">
                    <span className="font-medium">Card Message:</span>
                    <p className="text-gray-600 text-xs mt-1 italic">"{config.cardMessage}"</p>
                  </div>
                )}
                
                {config.tagMessage && (
                  <div className="text-sm">
                    <span className="font-medium">Tag Message:</span>
                    <p className="text-gray-600 text-xs mt-1 italic">"{config.tagMessage}"</p>
                  </div>
                )}
              </div>

              {calculatePersonalizationCost() > 0 && (
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold">
                    <span>Personalization Total</span>
                    <span className="text-linden-blue">${calculatePersonalizationCost()}</span>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleContinue}
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
              >
                Continue to Summary
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationStep;
