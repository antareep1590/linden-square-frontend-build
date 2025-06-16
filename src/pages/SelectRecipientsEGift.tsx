
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Upload, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

interface EGiftRecipient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  company?: string;
  giftMessage?: string;
}

const SelectRecipientsEGift = () => {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState<EGiftRecipient[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    countryCode: 'US',
    company: '',
    giftMessage: ''
  });

  const handleAddRecipient = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('First name, last name, and email are required');
      return;
    }

    const newRecipient: EGiftRecipient = {
      id: Date.now().toString(),
      ...formData
    };

    setRecipients([...recipients, newRecipient]);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      countryCode: 'US',
      company: '',
      giftMessage: ''
    });

    toast.success('Recipient added successfully');
  };

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
    toast.success('Recipient removed');
  };

  const handleContinue = () => {
    if (recipients.length === 0) {
      toast.error('Please add at least one recipient');
      return;
    }
    navigate('/egift-send-options');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Mock CSV processing
    setTimeout(() => {
      const mockRecipients: EGiftRecipient[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          company: 'Acme Corp'
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          company: 'Tech Solutions'
        }
      ];
      
      setRecipients([...recipients, ...mockRecipients]);
      toast.success(`${mockRecipients.length} recipients imported from CSV`);
      event.target.value = '';
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/customize-egift')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customization
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Select E-Gift Recipients</h1>
          <p className="text-gray-600">Add recipients who will receive digital gift notifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Add Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual">
                <TabsList>
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="upload">Upload CSV</TabsTrigger>
                </TabsList>
                
                <TabsContent value="manual" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Acme Corp"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Optional Address Information</h4>
                    <p className="text-sm text-gray-600">
                      Recipients can provide their address during redemption, but you can pre-fill it here if available.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="addressLine1">Address Line 1</Label>
                        <Input
                          id="addressLine1"
                          value={formData.addressLine1}
                          onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
                          placeholder="123 Main St"
                        />
                      </div>
                      <div>
                        <Label htmlFor="addressLine2">Address Line 2</Label>
                        <Input
                          id="addressLine2"
                          value={formData.addressLine2}
                          onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))}
                          placeholder="Apt 4B"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="San Francisco"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="CA"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                          placeholder="94102"
                        />
                      </div>
                      <div>
                        <Label htmlFor="countryCode">Country</Label>
                        <Input
                          id="countryCode"
                          value={formData.countryCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                          placeholder="US"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="giftMessage">Personal Gift Message</Label>
                      <Textarea
                        id="giftMessage"
                        value={formData.giftMessage}
                        onChange={(e) => setFormData(prev => ({ ...prev, giftMessage: e.target.value }))}
                        placeholder="Optional personal message for this recipient..."
                        rows={2}
                      />
                    </div>
                  </div>

                  <Button onClick={handleAddRecipient} className="bg-linden-blue hover:bg-linden-blue/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Recipient
                  </Button>
                </TabsContent>
                
                <TabsContent value="upload" className="space-y-4">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-4">Upload CSV with recipient information</p>
                    <Label htmlFor="csv-upload" className="cursor-pointer">
                      <div className="bg-linden-blue text-white py-2 px-4 rounded-md hover:bg-linden-blue/90">
                        Choose File
                      </div>
                      <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="sr-only" />
                    </Label>
                    <p className="mt-2 text-xs text-gray-500">
                      Required columns: firstName, lastName, email
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Recipients Table */}
          {recipients.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recipients ({recipients.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recipients.map((recipient) => (
                        <TableRow key={recipient.id}>
                          <TableCell>{recipient.firstName} {recipient.lastName}</TableCell>
                          <TableCell>{recipient.email}</TableCell>
                          <TableCell>{recipient.company || '-'}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRecipient(recipient.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-linden-blue">{recipients.length}</div>
                <div className="text-sm text-gray-600">Recipients Added</div>
              </div>

              <Button 
                onClick={handleContinue}
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
                disabled={recipients.length === 0}
              >
                Continue to Send Options
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SelectRecipientsEGift;
