
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Users, Plus, Upload, Trash2, AlertTriangle, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface Recipient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  tag: string;
  isDuplicate?: boolean;
  hasErrors?: boolean;
  included: boolean;
}

const RecipientSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock existing recipients
  const [savedRecipients, setSavedRecipients] = useState<Recipient[]>([
    {
      id: 'saved-1',
      name: 'John Smith',
      email: 'john@company.com',
      phone: '+1234567890',
      tag: 'Client',
      included: false
    },
    {
      id: 'saved-2',
      name: 'Sarah Johnson',
      email: 'sarah@partner.com',
      tag: 'Partner',
      included: false
    }
  ]);

  const [newRecipients, setNewRecipients] = useState<Recipient[]>([]);
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    tag: ''
  });
  const [editingRecipient, setEditingRecipient] = useState<string | null>(null);
  const [sendOption, setSendOption] = useState<'now' | 'later'>('now');

  const allRecipients = [...savedRecipients, ...newRecipients];

  const addRecipient = () => {
    if (!newRecipient.name || !newRecipient.email) {
      toast.error('Name and email are required');
      return;
    }

    const isDuplicate = allRecipients.some(r => 
      r.email.toLowerCase() === newRecipient.email.toLowerCase() ||
      r.name.toLowerCase() === newRecipient.name.toLowerCase()
    );

    const recipient: Recipient = {
      id: Date.now().toString(),
      ...newRecipient,
      isDuplicate,
      included: true
    };

    setNewRecipients(prev => [...prev, recipient]);
    setNewRecipient({ name: '', email: '', phone: '', address: '', tag: '' });
    
    if (isDuplicate) {
      toast.warning('Duplicate recipient detected');
    } else {
      toast.success('Recipient added successfully');
    }
  };

  const removeRecipient = (id: string) => {
    setNewRecipients(prev => prev.filter(r => r.id !== id));
    toast.success('Recipient removed');
  };

  const updateRecipient = (id: string, field: string, value: string | boolean) => {
    const savedIndex = savedRecipients.findIndex(r => r.id === id);
    if (savedIndex !== -1) {
      const updated = [...savedRecipients];
      updated[savedIndex] = { ...updated[savedIndex], [field]: value };
      setSavedRecipients(updated);
    } else {
      setNewRecipients(prev => prev.map(r => 
        r.id === id ? { ...r, [field]: value } : r
      ));
    }
  };

  const toggleRecipientInclusion = (id: string, included: boolean) => {
    updateRecipient(id, 'included', included);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      // Mock CSV processing
      const mockRecipients: Recipient[] = [
        {
          id: Date.now().toString(),
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '+1234567890',
          address: '123 Main St, City, State',
          tag: 'Client',
          included: true
        }
      ];
      
      setNewRecipients(prev => [...prev, ...mockRecipients]);
      toast.success('CSV uploaded successfully');
    } else {
      toast.error('Please upload a valid CSV file');
    }
  };

  const handleContinue = () => {
    const selectedRecipients = allRecipients.filter(r => r.included);
    
    if (selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    const validRecipients = selectedRecipients.filter(r => r.name && r.email);
    if (validRecipients.length !== selectedRecipients.length) {
      toast.error('Please fix all recipient errors before continuing');
      return;
    }

    navigate('/final-summary', { 
      state: { 
        ...location.state, 
        recipients: selectedRecipients,
        sendOption 
      }
    });
  };

  const selectedCount = allRecipients.filter(r => r.included).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Select Recipients</h1>
          <p className="text-gray-600">Add recipients for your gift boxes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Recipients */}
        <div className="lg:col-span-2 space-y-6">
          {/* Manual Add */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Recipient Manually
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Full Name *"
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Email Address *"
                  type="email"
                  value={newRecipient.email}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
                />
                <Input
                  placeholder="Phone Number (optional)"
                  value={newRecipient.phone}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, phone: e.target.value }))}
                />
                <Input
                  placeholder="Tag (e.g., Client, Friend)"
                  value={newRecipient.tag}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, tag: e.target.value }))}
                />
              </div>
              <Input
                placeholder="Address (optional)"
                value={newRecipient.address}
                onChange={(e) => setNewRecipient(prev => ({ ...prev, address: e.target.value }))}
              />
              <Button onClick={addRecipient} className="bg-linden-blue hover:bg-linden-blue/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Recipient
              </Button>
            </CardContent>
          </Card>

          {/* CSV Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload CSV File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <label className="cursor-pointer">
                  <span className="text-linden-blue hover:text-linden-blue/80">
                    Click to upload CSV file
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  CSV should include: Name, Email, Phone, Address, Tag
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recipients Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Recipients ({allRecipients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Include</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allRecipients.map((recipient) => (
                    <TableRow key={recipient.id}>
                      <TableCell>
                        <Checkbox
                          checked={recipient.included}
                          onCheckedChange={(checked) => 
                            toggleRecipientInclusion(recipient.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">{recipient.name}</span>
                          {recipient.isDuplicate && (
                            <div className="flex items-center gap-1 text-red-600 text-xs">
                              <AlertTriangle className="h-3 w-3" />
                              Duplicate
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{recipient.email}</TableCell>
                      <TableCell>
                        {recipient.tag && (
                          <Badge variant="secondary" className="text-xs">{recipient.tag}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingRecipient(recipient.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {newRecipients.find(r => r.id === recipient.id) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeRecipient(recipient.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Send Options */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Send Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="sendOption"
                    value="now"
                    checked={sendOption === 'now'}
                    onChange={(e) => setSendOption(e.target.value as 'now' | 'later')}
                  />
                  <span>Send Now</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="sendOption"
                    value="later"
                    checked={sendOption === 'later'}
                    onChange={(e) => setSendOption(e.target.value as 'now' | 'later')}
                  />
                  <span>Schedule for Later</span>
                </label>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Total Recipients:</span>
                    <span>{allRecipients.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selected:</span>
                    <span className="text-green-600">{selectedCount}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleContinue}
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
                disabled={selectedCount === 0}
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

export default RecipientSelection;
