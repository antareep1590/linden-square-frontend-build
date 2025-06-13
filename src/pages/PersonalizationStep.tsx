import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Package, Gift, Users, CreditCard, FileText, MapPin, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const PersonalizationStep = () => {
  const navigate = useNavigate();
  const { selectedBoxes, updateBoxPersonalization } = useCart();
  const [personalizations, setPersonalizations] = useState<{[key: string]: string}>({});

  const handlePersonalizationChange = (boxId: string, field: string, value: string) => {
    const key = `${boxId}-${field}`;
    setPersonalizations(prev => ({
      ...prev,
      [key]: value
    }));
    
    updateBoxPersonalization(boxId, field, value);
  };

  const handleContinue = () => {
    if (selectedBoxes.length === 0) {
      toast.error('Please select at least one gift box');
      return;
    }
    navigate('/customization');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/gift-box-flow')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gift Boxes
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Customize Your Gift Box</h1>
          <p className="text-gray-600">Personalize your selected gift boxes with custom messages and options</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleContinue}
            className="bg-linden-blue hover:bg-linden-blue/90"
          >
            Continue to Customization
          </Button>
        </div>
      </div>

      {selectedBoxes.map((box) => (
        <Card key={box.id} className="mb-6">
          <CardHeader>
            <CardTitle>
              {box.name} - Personalization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`giftMessage-${box.id}`}>Gift Message</Label>
              <Textarea
                id={`giftMessage-${box.id}`}
                placeholder="Add a personal message to include with this gift box..."
                value={personalizations[`${box.id}-giftMessage`] || ''}
                onChange={(e) => handlePersonalizationChange(box.id, 'giftMessage', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`senderName-${box.id}`}>From (Sender Name)</Label>
              <Input
                id={`senderName-${box.id}`}
                placeholder="Your name or company name"
                value={personalizations[`${box.id}-senderName`] || ''}
                onChange={(e) => handlePersonalizationChange(box.id, 'senderName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`specialInstructions-${box.id}`}>Special Instructions</Label>
              <Textarea
                id={`specialInstructions-${box.id}`}
                placeholder="Any special packaging or delivery instructions..."
                value={personalizations[`${box.id}-specialInstructions`] || ''}
                onChange={(e) => handlePersonalizationChange(box.id, 'specialInstructions', e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          className="bg-linden-blue hover:bg-linden-blue/90"
        >
          Continue to Customization
        </Button>
      </div>
    </div>
  );
};

export default PersonalizationStep;
