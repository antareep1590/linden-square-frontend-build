
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Users, Plus, Upload, Edit2, Trash2, AlertTriangle, Save } from 'lucide-react';
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
}

const RecipientSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    tag: 'Client'
  });
  const [sendOption, setSendOption] = useState<'now' | 'later' | 'draft'>('now');

  const tags = ['Client', 'Team Member', 'Partner', 'Friend', 'Family', 'Other'];

  const addRecipient = () => {
    if (!newRecipient.name || !newRecipient.email) {
      toast.error('Name and email are required');
      return;
    }

    const isDuplicate = recipients.some(r => 
      r.email.toLowerCase() === newRecipient.email.toLowerCase() ||
      r.name.toLowerCase() === newRecipient.name.toLowerCase()
    );

    const recipient: Recipient = {
      id: Date.now().toString(),
      ...newRecipient,
      isDuplicate
    };

    setRecipients(prev => [...prev, recipient]);
    setNewRecipient({ name: '', email: '', phone: '', address: '', tag: 'Client' });
    
    if (isDuplicate) {
      toast.warning('Duplicate recipient detected');
    } else {
      toast.success('Recipient added successfully');
    }
  };

  const removeRecipient = (id: string) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
    toast.success('Recipient removed');
  };

  const updateRecipient = (id: string, field: string, value: string) => {
    setRecipients(prev => prev.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      // Mock CSV processing
      const mockRecipients: Recipient[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          address: '123 Main St, City, State',
          tag: 'Client'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          tag: 'Partner',
          hasErrors: true // Missing phone/address
        }
      ];
      
      setRecipients(prev => [...prev, ...mockRecipients]);
      toast.success('CSV uploaded successfully');
    } else {
      toast.error('Please upload a valid CSV file');
    }
  };

  const handleSaveDraft = () => {
    toast.success('Recipients saved as draft');
    navigate('/dashboard');
  };

  const handleContinue = () => {
    if (recipients.length === 0) {
      toast.error('Please add at least one recipient');
      return;
    }

    const validRecipients = recipients.filter(r => r.name && r.email);
    if (validRecipients.length !== recipients.length) {
      toast.error('Please fix all recipient errors before continuing');
      return;
    }

    navigate('/final-summary', { 
      state: { 
        ...location.state, 
        recipients,
        sendOption 
      }
    });
  };

  const duplicateCount = recipients.filter(r => r.isDuplicate).length;
  const errorCount = recipients.filter(r => r.hasErrors || !r.name || !r.email).length;

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
                <Select value={newRecipient.tag} onValueChange={(value) => 
                  setNewRecipient(prev => ({ ...prev, tag: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

          {/* Recipients List */}
          {recipients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recipients ({recipients.length})
                  </div>
                  {(duplicateCount > 0 || errorCount > 0) && (
                    <div className="flex items-center gap-2">
                      {duplicateCount > 0 && (
                        <Badge variant="destructive">{duplicateCount} Duplicates</Badge>
                      )}
                      {errorCount > 0 && (
                        <Badge variant="destructive">{errorCount} Errors</Badge>
                      )}
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recipients.map((recipient) => (
                    <div 
                      key={recipient.id}
                      className={`border rounded-lg p-4 ${
                        recipient.isDuplicate ? 'border-red-300 bg-red-50' : 
                        recipient.hasErrors ? 'border-yellow-300 bg-yellow-50' : 
                        'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                          <Input
                            placeholder="Name"
                            value={recipient.name}
                            onChange={(e) => updateRecipient(recipient.id, 'name', e.target.value)}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Email"
                            value={recipient.email}
                            onChange={(e) => updateRecipient(recipient.id, 'email', e.target.value)}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Phone"
                            value={recipient.phone || ''}
                            onChange={(e) => updateRecipient(recipient.id, 'phone', e.target.value)}
                            className="text-sm"
                          />
                          <div className="flex items-center gap-2">
                            <Select value={recipient.tag} onValueChange={(value) => 
                              updateRecipient(recipient.id, 'tag', value)
                            }>
                              <SelectTrigger className="text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {tags.map(tag => (
                                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeRecipient(recipient.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {recipient.isDuplicate && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          Potential duplicate detected
                        </div>
                      )}
                      
                      {recipient.hasErrors && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-yellow-600">
                          <AlertTriangle className="h-4 w-4" />
                          Missing required fields
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
                    onChange={(e) => setSendOption(e.target.value as 'now' | 'later' | 'draft')}
                  />
                  <span>Send Now</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="sendOption"
                    value="later"
                    checked={sendOption === 'later'}
                    onChange={(e) => setSendOption(e.target.value as 'now' | 'later' | 'draft')}
                  />
                  <span>Schedule for Later</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="sendOption"
                    value="draft"
                    checked={sendOption === 'draft'}
                    onChange={(e) => setSendOption(e.target.value as 'now' | 'later' | 'draft')}
                  />
                  <span>Save as Draft</span>
                </label>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Recipients:</span>
                    <span>{recipients.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid:</span>
                    <span className="text-green-600">{recipients.length - errorCount}</span>
                  </div>
                  {errorCount > 0 && (
                    <div className="flex justify-between">
                      <span>Errors:</span>
                      <span className="text-red-600">{errorCount}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-linden-blue hover:bg-linden-blue/90"
                  disabled={recipients.length === 0 || errorCount > 0}
                >
                  Continue to Summary
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleSaveDraft}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecipientSelection;
