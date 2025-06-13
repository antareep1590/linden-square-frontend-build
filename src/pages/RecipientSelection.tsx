
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Upload, Plus, Package, X, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LindenSquareLogo from '@/components/LindenSquareLogo';
import { toast } from 'sonner';

const RecipientSelection = () => {
  const navigate = useNavigate();
  
  // Check if this is a standalone flow (new client)
  const isStandalone = !window.location.pathname.includes('/dashboard');
  
  const [recipients, setRecipients] = useState([
    { id: 1, name: 'John Smith', email: 'john@company.com', department: 'Sales', assignedBox: null, selected: false },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', department: 'Marketing', assignedBox: null, selected: false },
    { id: 3, name: 'Mike Chen', email: 'mike@company.com', department: 'Engineering', assignedBox: null, selected: false },
    { id: 4, name: 'Emily Davis', email: 'emily@company.com', department: 'HR', assignedBox: null, selected: false }
  ]);
  
  const [selectedGiftBoxes] = useState([
    { id: 1, name: 'Executive Appreciation', price: 89.99, image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
    { id: 2, name: 'Team Celebration', price: 45.99, image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }
  ]);

  const [newRecipient, setNewRecipient] = useState({
    name: '',
    email: '',
    department: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleRecipientSelect = (recipientId: number) => {
    setRecipients(prev => prev.map(r => 
      r.id === recipientId ? { ...r, selected: !r.selected } : r
    ));
  };

  const handleAssignGiftBox = (recipientId: number, boxId: number | null) => {
    setRecipients(prev => prev.map(r => 
      r.id === recipientId ? { ...r, assignedBox: boxId } : r
    ));
  };

  const handleAddRecipient = () => {
    if (!newRecipient.name || !newRecipient.email) {
      toast.error('Please fill in name and email');
      return;
    }

    const newId = Math.max(...recipients.map(r => r.id)) + 1;
    setRecipients(prev => [...prev, {
      id: newId,
      name: newRecipient.name,
      email: newRecipient.email,
      department: newRecipient.department,
      assignedBox: null,
      selected: false
    }]);

    setNewRecipient({ name: '', email: '', department: '' });
    setShowAddForm(false);
    toast.success('Recipient added successfully');
  };

  const handleRemoveRecipient = (recipientId: number) => {
    setRecipients(prev => prev.filter(r => r.id !== recipientId));
    toast.success('Recipient removed');
  };

  const handleContinue = () => {
    const selectedRecipients = recipients.filter(r => r.selected);
    if (selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    const recipientsWithoutBoxes = selectedRecipients.filter(r => !r.assignedBox);
    if (recipientsWithoutBoxes.length > 0) {
      toast.error('Please assign gift boxes to all selected recipients');
      return;
    }

    navigate('/summary');
  };

  const handleBack = () => {
    if (isStandalone) {
      navigate('/customize-gift-box');
    } else {
      navigate('/personalization');
    }
  };

  const selectedCount = recipients.filter(r => r.selected).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {isStandalone && (
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <LindenSquareLogo size="medium" />
                <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
                <h1 className="hidden sm:block text-xl font-semibold text-gray-900">Select Recipients</h1>
              </div>
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </header>
      )}

      <div className={`${isStandalone ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : 'space-y-6'}`}>
        {!isStandalone && (
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Select Recipients</h1>
              <p className="text-gray-600">Choose who will receive your gift boxes and assign specific boxes to each recipient</p>
            </div>
          </div>
        )}

        {isStandalone && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Select Your Recipients
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose who will receive your gift boxes and assign specific boxes to each recipient.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Recipients List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recipients ({recipients.length})
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAddForm(!showAddForm)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Recipient
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Add New Recipient Form */}
                {showAddForm && (
                  <Card className="border-dashed">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={newRecipient.name}
                            onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newRecipient.email}
                            onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter email"
                          />
                        </div>
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            value={newRecipient.department}
                            onChange={(e) => setNewRecipient(prev => ({ ...prev, department: e.target.value }))}
                            placeholder="Enter department"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button onClick={handleAddRecipient} size="sm">
                          Add Recipient
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm">
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recipients */}
                {recipients.map((recipient) => (
                  <div key={recipient.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Checkbox
                      checked={recipient.selected}
                      onCheckedChange={() => handleRecipientSelect(recipient.id)}
                    />
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{recipient.name}</h4>
                      <p className="text-sm text-gray-600">{recipient.email}</p>
                      {recipient.department && (
                        <Badge variant="outline" className="mt-1">
                          {recipient.department}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveRecipient(recipient.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Assign Gift Boxes Section */}
            {selectedCount > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Assign Gift Boxes ({selectedCount} recipients selected)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recipients.filter(r => r.selected).map((recipient) => (
                    <div key={recipient.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{recipient.name}</h4>
                        <p className="text-sm text-gray-600">{recipient.email}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Label>Gift Box:</Label>
                        <Select 
                          value={recipient.assignedBox?.toString() || ''} 
                          onValueChange={(value) => handleAssignGiftBox(recipient.id, value ? parseInt(value) : null)}
                        >
                          <SelectTrigger className="w-64">
                            <SelectValue placeholder="Select a gift box" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedGiftBoxes.map((box) => (
                              <SelectItem key={box.id} value={box.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={box.image} 
                                    alt={box.name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                  <span>{box.name} - ${box.price}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Selection Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Recipients:</span>
                    <span className="font-medium">{recipients.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selected:</span>
                    <span className="font-medium text-linden-blue">{selectedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>With Assigned Boxes:</span>
                    <span className="font-medium text-green-600">
                      {recipients.filter(r => r.selected && r.assignedBox).length}
                    </span>
                  </div>
                </div>

                {selectedGiftBoxes.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Available Gift Boxes</h4>
                    <div className="space-y-2">
                      {selectedGiftBoxes.map((box) => (
                        <div key={box.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <img 
                            src={box.image} 
                            alt={box.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{box.name}</p>
                            <p className="text-xs text-gray-600">${box.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-linden-blue hover:bg-linden-blue/90"
                    onClick={handleContinue}
                    disabled={selectedCount === 0}
                  >
                    Continue to Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientSelection;
