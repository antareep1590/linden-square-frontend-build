
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Gift, MessageSquare, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const CustomizeEGift = () => {
  const navigate = useNavigate();
  const [messageGraphic, setMessageGraphic] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [usePersonalization, setUsePersonalization] = useState(false);

  const messageGraphics = [
    { id: 'birthday', name: 'Birthday', emoji: '🎂' },
    { id: 'thankyou', name: 'Thank You', emoji: '🙏' },
    { id: 'congratulations', name: 'Congratulations', emoji: '🎉' },
    { id: 'holiday', name: 'Holiday', emoji: '🎄' },
    { id: 'custom', name: 'Custom', emoji: '✨' }
  ];

  const handleContinue = () => {
    if (!messageGraphic) {
      toast.error('Please select a message graphic');
      return;
    }
    navigate('/select-recipients-egift');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/choose-delivery-method')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Delivery Method
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Customize Your E-Gift</h1>
          <p className="text-gray-600">Personalize your digital gift experience</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message Graphic Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Message Graphic Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {messageGraphics.map((graphic) => (
                  <div
                    key={graphic.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      messageGraphic === graphic.id
                        ? 'border-linden-blue bg-linden-blue/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setMessageGraphic(graphic.id)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{graphic.emoji}</div>
                      <div className="text-sm font-medium">{graphic.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gift Message */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Gift Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="giftMessage">Message Text</Label>
                <Textarea
                  id="giftMessage"
                  placeholder="Enter your gift message..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senderName">From (Sender Name)</Label>
                <Input
                  id="senderName"
                  placeholder="Your name or company name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Personalization Tokens Available:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white">{'{{First Name}}'}</Badge>
                  <Badge variant="outline" className="bg-white">{'{{Last Name}}'}</Badge>
                  <Badge variant="outline" className="bg-white">{'{{Company}}'}</Badge>
                </div>
                <p className="text-sm text-blue-800 mt-2">
                  Use these tokens in your message and they'll be replaced with each recipient's information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Individual Customization */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Message Customization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Upload a CSV file to define personalized messages for each recipient.
                </p>
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <Label htmlFor="csv-upload" className="cursor-pointer text-sm font-medium text-linden-blue hover:text-linden-blue/80">
                      Upload CSV File (Optional)
                    </Label>
                    <Input id="csv-upload" type="file" accept=".csv" className="sr-only" />
                    <p className="text-xs text-gray-500 mt-1">CSV with columns: email, custom_message</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Preview */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>E-Gift Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">
                  {messageGraphic ? messageGraphics.find(g => g.id === messageGraphic)?.emoji : '🎁'}
                </div>
                <div className="text-sm font-medium">
                  {messageGraphic ? messageGraphics.find(g => g.id === messageGraphic)?.name : 'Select Graphic'}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Message:</span>
                  <p className="text-gray-600 mt-1">
                    {giftMessage || 'Enter your message...'}
                  </p>
                </div>
                
                <div className="text-sm">
                  <span className="font-medium">From:</span>
                  <p className="text-gray-600">
                    {senderName || 'Enter sender name...'}
                  </p>
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

export default CustomizeEGift;
