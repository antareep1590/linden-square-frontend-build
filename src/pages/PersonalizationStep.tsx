
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Gift, Heart, Tag, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PersonalizationOption {
  id: string;
  name: string;
  type: 'ribbon' | 'card' | 'wrap' | 'tag';
  price: number;
  options: string[];
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
  const { selectedBoxes, updateBox } = useCart();
  const [personalizations, setPersonalizations] = useState<{ [boxId: string]: any }>({});

  const updatePersonalization = (boxId: string, optionId: string, value: string) => {
    setPersonalizations(prev => {
      const boxPersonalization = prev[boxId] || { selectedOptions: new Map(), cardMessage: '', tagMessage: '' };
      const newOptions = new Map(boxPersonalization.selectedOptions);
      
      if (value) {
        newOptions.set(optionId, value);
      } else {
        newOptions.delete(optionId);
      }
      
      return {
        ...prev,
        [boxId]: {
          ...boxPersonalization,
          selectedOptions: newOptions
        }
      };
    });
  };

  const updatePersonalizationMessage = (boxId: string, field: string, value: string) => {
    setPersonalizations(prev => ({
      ...prev,
      [boxId]: {
        ...prev[boxId] || { selectedOptions: new Map() },
        [field]: value
      }
    }));
  };

  const calculatePersonalizationCost = (boxId: string): number => {
    const boxPersonalization = personalizations[boxId];
    if (!boxPersonalization) return 0;
    
    return Array.from(boxPersonalization.selectedOptions?.keys() || []).reduce((total: number, optionId: string) => {
      const option = personalizationOptions.find(o => o.id === optionId);
      return total + (option?.price || 0);
    }, 0);
  };

  const handleContinue = () => {
    // Update all boxes with their personalization data
    selectedBoxes.forEach(box => {
      const boxPersonalization = personalizations[box.id];
      if (boxPersonalization) {
        const selectedAddOns = Array.from(boxPersonalization.selectedOptions?.entries() || []).map(([optionId, value]) => {
          const option = personalizationOptions.find(o => o.id === optionId);
          return option ? { name: `${option.name}: ${value}`, price: option.price } : null;
        }).filter(Boolean);

        updateBox(box.id, {
          personalization: {
            selectedOptions: boxPersonalization.selectedOptions || new Map(),
            cardMessage: boxPersonalization.cardMessage || '',
            tagMessage: boxPersonalization.tagMessage || '',
            addOnsCost: calculatePersonalizationCost(box.id),
            selectedAddOns
          }
        });
      }
    });

    navigate('/recipient-selection');
  };

  const getBoxPersonalization = (boxId: string) => {
    return personalizations[boxId] || { selectedOptions: new Map(), cardMessage: '', tagMessage: '' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Personalize Your Gift Boxes</h1>
          <p className="text-gray-600">Add special touches to make each gift memorable</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personalization for Each Box */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Your Gift Boxes ({selectedBoxes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {selectedBoxes.map((box) => {
                  const boxPersonalization = getBoxPersonalization(box.id);
                  const personalizationCost = calculatePersonalizationCost(box.id);
                  
                  return (
                    <AccordionItem key={box.id} value={box.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full mr-4">
                          <div className="flex items-center gap-4">
                            <span className="font-medium">{box.name}</span>
                            <Badge variant="outline">{box.size}</Badge>
                            <Badge variant="secondary">{box.theme}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {personalizationCost > 0 && (
                              <Badge variant="outline" className="text-linden-blue">
                                +${personalizationCost}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-6 pt-4">
                          {/* Personalization Options */}
                          {personalizationOptions.map(option => (
                            <div key={option.id} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {option.type === 'ribbon' && <Gift className="h-4 w-4" />}
                                  {option.type === 'card' && <Heart className="h-4 w-4" />}
                                  {option.type === 'wrap' && <Gift className="h-4 w-4" />}
                                  {option.type === 'tag' && <Tag className="h-4 w-4" />}
                                  <span className="font-medium">{option.name}</span>
                                </div>
                                <Badge variant="outline">+${option.price}</Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {option.options.map(optionValue => (
                                  <Button
                                    key={optionValue}
                                    variant={boxPersonalization.selectedOptions?.get(option.id) === optionValue ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                      const currentValue = boxPersonalization.selectedOptions?.get(option.id);
                                      updatePersonalization(box.id, option.id, currentValue === optionValue ? '' : optionValue);
                                    }}
                                    className={
                                      boxPersonalization.selectedOptions?.get(option.id) === optionValue 
                                        ? "bg-linden-blue hover:bg-linden-blue/90" 
                                        : ""
                                    }
                                  >
                                    {optionValue}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}

                          {/* Custom Messages */}
                          <div className="space-y-4 border-t pt-4">
                            <h4 className="font-medium">Custom Messages</h4>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Card Message</label>
                              <Textarea
                                placeholder="Enter your personalized message for the card..."
                                value={boxPersonalization.cardMessage || ''}
                                onChange={(e) => updatePersonalizationMessage(box.id, 'cardMessage', e.target.value)}
                                className="min-h-20"
                              />
                              <p className="text-xs text-gray-500 mt-1">Max 150 characters</p>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium mb-2 block">Gift Tag Message</label>
                              <Input
                                placeholder="Brief message for the gift tag..."
                                value={boxPersonalization.tagMessage || ''}
                                onChange={(e) => updatePersonalizationMessage(box.id, 'tagMessage', e.target.value)}
                              />
                              <p className="text-xs text-gray-500 mt-1">Max 50 characters</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Personalization Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {selectedBoxes.map(box => {
                  const cost = calculatePersonalizationCost(box.id);
                  return cost > 0 ? (
                    <div key={box.id} className="border-b pb-3 last:border-b-0">
                      <div className="font-medium text-sm mb-2">{box.name}</div>
                      <div className="flex justify-between text-sm">
                        <span>Personalization</span>
                        <span className="text-linden-blue">${cost}</span>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total Personalization</span>
                  <span className="text-linden-blue">
                    ${selectedBoxes.reduce((total, box) => total + calculatePersonalizationCost(box.id), 0)}
                  </span>
                </div>
              </div>

              <Button 
                onClick={handleContinue}
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
              >
                Continue to Recipients
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationStep;
