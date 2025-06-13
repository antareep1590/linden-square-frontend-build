import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Minus, Package, Gift, Users, CreditCard, FileText, MapPin, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const RecipientSelection = () => {
  const navigate = useNavigate();
  const { selectedBoxes } = useCart();
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientDepartment, setRecipientDepartment] = useState('');

  const addRecipient = () => {
    if (!recipientName || !recipientEmail) {
      toast.error('Please enter recipient name and email');
      return;
    }

    const newRecipient = {
      id: Date.now(),
      name: recipientName,
      email: recipientEmail,
      address: recipientAddress,
      phone: recipientPhone,
      department: recipientDepartment
    };

    setSelectedRecipients([...selectedRecipients, newRecipient]);
    setRecipientName('');
    setRecipientEmail('');
    setRecipientAddress('');
    setRecipientPhone('');
    setRecipientDepartment('');

    toast.success('Recipient added successfully');
  };

  const removeRecipient = (id: number) => {
    setSelectedRecipients(selectedRecipients.filter(recipient => recipient.id !== id));
    toast.success('Recipient removed');
  };

  const handleContinue = () => {
    if (selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }
    navigate('/shipping-fulfillment');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/customization')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customization
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Select Recipients</h1>
          <p className="text-gray-600">Assign gifts to recipients and manage delivery details</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleContinue}
            className="bg-linden-blue hover:bg-linden-blue/90"
          >
            Continue to Shipping
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Recipient Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Recipient</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input
                    type="text"
                    id="recipientName"
                    placeholder="Enter recipient name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="recipientEmail">Recipient Email</Label>
                  <Input
                    type="email"
                    id="recipientEmail"
                    placeholder="Enter recipient email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipientAddress">Recipient Address</Label>
                  <Input
                    type="text"
                    id="recipientAddress"
                    placeholder="Enter recipient address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="recipientPhone">Recipient Phone</Label>
                  <Input
                    type="tel"
                    id="recipientPhone"
                    placeholder="Enter recipient phone"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="recipientDepartment">Recipient Department</Label>
                <Input
                  type="text"
                  id="recipientDepartment"
                  placeholder="Enter recipient department"
                  value={recipientDepartment}
                  onChange={(e) => setRecipientDepartment(e.target.value)}
                />
              </div>
              <Button onClick={addRecipient} className="bg-linden-blue hover:bg-linden-blue/90">
                Add Recipient
              </Button>
            </CardContent>
          </Card>

          {/* Selected Recipients List */}
          <Card>
            <CardHeader>
              <CardTitle>Selected Recipients ({selectedRecipients.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedRecipients.length > 0 ? (
                <ul className="space-y-2">
                  {selectedRecipients.map((recipient) => (
                    <li key={recipient.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{recipient.name}</h4>
                        <p className="text-sm text-gray-600">{recipient.email}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => removeRecipient(recipient.id)} className="text-red-600 hover:text-red-700">
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No recipients selected yet. Add recipients using the form above.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recipient Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Recipients:</span>
                  <span>{selectedRecipients.length}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Estimated Delivery:</span>
                  <span>5-7 business days</span>
                </div>
              </div>
              <Button 
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
                onClick={handleContinue}
                disabled={selectedRecipients.length === 0}
              >
                Continue to Shipping
              </Button>
              {selectedRecipients.length === 0 && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Add recipients to continue
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecipientSelection;
