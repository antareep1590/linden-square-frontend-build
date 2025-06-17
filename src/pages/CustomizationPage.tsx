
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Package, Palette, User, Users, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const CustomizationPage = () => {
  const navigate = useNavigate();
  const { selectedBoxes } = useCart();
  const [customizationType, setCustomizationType] = useState<'order' | 'individual'>('order');
  const [selectedRecipientIndex, setSelectedRecipientIndex] = useState(0);
  
  // Mock recipients data - in real app would come from previous step
  const recipients = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
    { id: 2, name: 'Michael Chen', email: 'michael.chen@company.com' },
    { id: 3, name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com' }
  ];

  const selectedGiftBox = selectedBoxes[0]; // Only one gift box can be selected

  const [orderLevelCustomization, setOrderLevelCustomization] = useState({
    message: '',
    senderName: '',
    packaging: 'standard',
    ribbon: 'blue'
  });

  const [individualCustomizations, setIndividualCustomizations] = useState<{[key: number]: any}>({});

  const handleOrderLevelChange = (field: string, value: string) => {
    setOrderLevelCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIndividualChange = (recipientId: number, field: string, value: string) => {
    setIndividualCustomizations(prev => ({
      ...prev,
      [recipientId]: {
        ...prev[recipientId],
        [field]: value
      }
    }));
  };

  const getCurrentCustomization = (recipientId: number) => {
    return individualCustomizations[recipientId] || {
      message: '',
      senderName: '',
      packaging: 'standard',
      ribbon: 'blue'
    };
  };

  const handleContinue = () => {
    if (customizationType === 'order') {
      if (!orderLevelCustomization.message.trim()) {
        toast.error('Please add a gift message');
        return;
      }
    } else {
      // Check if all recipients have customizations
      const missingCustomizations = recipients.filter(r => 
        !individualCustomizations[r.id]?.message?.trim()
      );
      
      if (missingCustomizations.length > 0) {
        toast.error(`Please add messages for ${missingCustomizations.length} recipient(s)`);
        return;
      }
    }

    toast.success('Customizations saved');
    navigate('/shipping-fulfillment');
  };

  const handlePreviousRecipient = () => {
    if (selectedRecipientIndex > 0) {
      setSelectedRecipientIndex(selectedRecipientIndex - 1);
    }
  };

  const handleNextRecipient = () => {
    if (selectedRecipientIndex < recipients.length - 1) {
      setSelectedRecipientIndex(selectedRecipientIndex + 1);
    }
  };

  if (!selectedGiftBox) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Package className="h-16 w-16 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-600">No gift box selected</h2>
        <p className="text-gray-500">Please select a gift box first</p>
        <Button onClick={() => navigate('/box-listing')}>
          Select Gift Box
        </Button>
      </div>
    );
  }

  const currentRecipient = recipients[selectedRecipientIndex];
  const currentCustomization = getCurrentCustomization(currentRecipient.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/recipient-selection')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipients
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Customize Your Order</h1>
          <p className="text-gray-600">Personalize your gift box with custom messages and packaging</p>
        </div>
        <Button 
          onClick={handleContinue}
          className="bg-linden-blue hover:bg-linden-blue/90"
        >
          Continue to Shipping
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Selected Gift Box */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Selected Gift Box
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={selectedGiftBox.image || '/placeholder.svg'} 
                    alt={selectedGiftBox.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedGiftBox.name}</h3>
                  <p className="text-gray-600">{selectedGiftBox.theme}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{selectedGiftBox.size}</Badge>
                    <Badge variant="outline">${selectedGiftBox.basePrice}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customization Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Customization Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={customizationType} 
                onValueChange={(value: 'order' | 'individual') => setCustomizationType(value)}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="order" id="order" />
                  <Label htmlFor="order" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Order-Level Customization</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      All recipients will receive the same customization
                    </p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Individual Customization</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Customize the gift box differently for each recipient
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Customization Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {customizationType === 'order' ? 'Order Customization' : `Customize for ${currentRecipient.name}`}
              </CardTitle>
              {customizationType === 'individual' && (
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousRecipient}
                    disabled={selectedRecipientIndex === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    {selectedRecipientIndex + 1} of {recipients.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextRecipient}
                    disabled={selectedRecipientIndex === recipients.length - 1}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {customizationType === 'order' ? (
                // Order-level customization form
                <>
                  <div className="space-y-2">
                    <Label htmlFor="order-message">Gift Message</Label>
                    <Textarea
                      id="order-message"
                      placeholder="Enter your gift message for all recipients..."
                      value={orderLevelCustomization.message}
                      onChange={(e) => handleOrderLevelChange('message', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="order-sender">From (Sender Name)</Label>
                    <Input
                      id="order-sender"
                      placeholder="Your name or company name"
                      value={orderLevelCustomization.senderName}
                      onChange={(e) => handleOrderLevelChange('senderName', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Packaging Style</Label>
                      <Select 
                        value={orderLevelCustomization.packaging}
                        onValueChange={(value) => handleOrderLevelChange('packaging', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Box</SelectItem>
                          <SelectItem value="premium">Premium Box</SelectItem>
                          <SelectItem value="eco">Eco-Friendly Box</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Ribbon Color</Label>
                      <Select 
                        value={orderLevelCustomization.ribbon}
                        onValueChange={(value) => handleOrderLevelChange('ribbon', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              ) : (
                // Individual customization form
                <>
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Recipient:</strong> {currentRecipient.name} ({currentRecipient.email})
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="individual-message">Personal Gift Message</Label>
                    <Textarea
                      id="individual-message"
                      placeholder={`Enter a personalized message for ${currentRecipient.name}...`}
                      value={currentCustomization.message}
                      onChange={(e) => handleIndividualChange(currentRecipient.id, 'message', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="individual-sender">From (Sender Name)</Label>
                    <Input
                      id="individual-sender"
                      placeholder="Your name or company name"
                      value={currentCustomization.senderName}
                      onChange={(e) => handleIndividualChange(currentRecipient.id, 'senderName', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Packaging Style</Label>
                      <Select 
                        value={currentCustomization.packaging}
                        onValueChange={(value) => handleIndividualChange(currentRecipient.id, 'packaging', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Box</SelectItem>
                          <SelectItem value="premium">Premium Box</SelectItem>
                          <SelectItem value="eco">Eco-Friendly Box</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Ribbon Color</Label>
                      <Select 
                        value={currentCustomization.ribbon}
                        onValueChange={(value) => handleIndividualChange(currentRecipient.id, 'ribbon', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Customization Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Recipients:</span>
                <span className="font-medium">{recipients.length}</span>
              </div>
              
              {customizationType === 'individual' && (
                <>
                  <div className="flex justify-between text-sm">
                    <span>Completed:</span>
                    <span className="font-medium text-green-600">
                      {Object.keys(individualCustomizations).filter(id => 
                        individualCustomizations[parseInt(id)]?.message?.trim()
                      ).length} of {recipients.length}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(Object.keys(individualCustomizations).filter(id => 
                          individualCustomizations[parseInt(id)]?.message?.trim()
                        ).length / recipients.length) * 100}%`
                      }}
                    />
                  </div>
                </>
              )}
              
              <Button 
                className="w-full bg-linden-blue hover:bg-linden-blue/90 mt-4"
                onClick={handleContinue}
              >
                Continue to Shipping
              </Button>
            </CardContent>
          </Card>

          {/* Individual Recipients List */}
          {customizationType === 'individual' && (
            <Card>
              <CardHeader>
                <CardTitle>Recipients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recipients.map((recipient, index) => (
                    <div
                      key={recipient.id}
                      className={`p-2 rounded-lg cursor-pointer transition-colors ${
                        index === selectedRecipientIndex 
                          ? 'bg-linden-blue text-white' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedRecipientIndex(index)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{recipient.name}</span>
                        {individualCustomizations[recipient.id]?.message?.trim() && (
                          <Badge variant={index === selectedRecipientIndex ? "outline" : "default"} 
                                className={index === selectedRecipientIndex ? "border-white text-white" : "bg-green-100 text-green-800"}>
                            Done
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizationPage;
