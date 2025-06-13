
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Plus, Package, X, Gift, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LindenSquareLogo from '@/components/LindenSquareLogo';
import { toast } from 'sonner';

const RecipientSelection = () => {
  const navigate = useNavigate();
  
  // Check if this is a standalone flow (new client)
  const isStandalone = !window.location.pathname.includes('/dashboard');
  
  const [recipients, setRecipients] = useState([
    { id: 1, name: 'John Smith', email: 'john@company.com', department: 'Sales' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', department: 'Marketing' },
    { id: 3, name: 'Mike Chen', email: 'mike@company.com', department: 'Engineering' },
    { id: 4, name: 'Emily Davis', email: 'emily@company.com', department: 'HR' }
  ]);
  
  const [selectedGiftBoxes] = useState([
    { id: 1, name: 'Executive Appreciation', price: 89.99, image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
    { id: 2, name: 'Team Celebration', price: 45.99, image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }
  ]);

  // Track which recipients are assigned to which gift boxes
  const [giftBoxAssignments, setGiftBoxAssignments] = useState<{[key: number]: number[]}>({});
  
  // Track which gift boxes are expanded in the assignment view
  const [expandedBoxes, setExpandedBoxes] = useState<number[]>([]);

  const [newRecipient, setNewRecipient] = useState({
    name: '',
    email: '',
    department: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

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
      department: newRecipient.department
    }]);

    setNewRecipient({ name: '', email: '', department: '' });
    setShowAddForm(false);
    toast.success('Recipient added successfully');
  };

  const handleRemoveRecipient = (recipientId: number) => {
    setRecipients(prev => prev.filter(r => r.id !== recipientId));
    // Remove from any gift box assignments
    setGiftBoxAssignments(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(boxId => {
        updated[parseInt(boxId)] = updated[parseInt(boxId)].filter(id => id !== recipientId);
      });
      return updated;
    });
    toast.success('Recipient removed');
  };

  const handleAssignRecipientToBox = (boxId: number, recipientId: number, isAssigned: boolean) => {
    setGiftBoxAssignments(prev => {
      const updated = { ...prev };
      if (!updated[boxId]) updated[boxId] = [];
      
      if (isAssigned) {
        if (!updated[boxId].includes(recipientId)) {
          updated[boxId] = [...updated[boxId], recipientId];
        }
      } else {
        updated[boxId] = updated[boxId].filter(id => id !== recipientId);
      }
      
      return updated;
    });
  };

  const toggleBoxExpansion = (boxId: number) => {
    setExpandedBoxes(prev => 
      prev.includes(boxId) 
        ? prev.filter(id => id !== boxId)
        : [...prev, boxId]
    );
  };

  const handleContinue = () => {
    const totalAssignedRecipients = Object.values(giftBoxAssignments).flat().length;
    if (totalAssignedRecipients === 0) {
      toast.error('Please assign at least one recipient to a gift box');
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

  const getTotalAssignedRecipients = () => {
    return Object.values(giftBoxAssignments).flat().length;
  };

  const getAssignedRecipientsForBox = (boxId: number) => {
    return giftBoxAssignments[boxId] || [];
  };

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
              <p className="text-gray-600">Assign recipients to each gift box</p>
            </div>
          </div>
        )}

        {isStandalone && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Assign Recipients to Gift Boxes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose who will receive each gift box. Each box can be sent to multiple recipients.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Recipients Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recipients ({recipients.length})
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Recipient
                  </Button>
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

                {/* Recipients List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{recipient.name}</h4>
                        <p className="text-sm text-gray-600">{recipient.email}</p>
                        {recipient.department && (
                          <Badge variant="outline" className="mt-1">
                            {recipient.department}
                          </Badge>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveRecipient(recipient.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gift Box Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Assign Recipients to Gift Boxes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedGiftBoxes.map((box) => {
                  const assignedRecipients = getAssignedRecipientsForBox(box.id);
                  const isExpanded = expandedBoxes.includes(box.id);
                  
                  return (
                    <div key={box.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <img 
                          src={box.image} 
                          alt={box.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{box.name}</h3>
                          <p className="text-linden-blue font-semibold">${box.price}</p>
                          <p className="text-sm text-gray-600">
                            {assignedRecipients.length} recipient{assignedRecipients.length !== 1 ? 's' : ''} assigned
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleBoxExpansion(box.id)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          {isExpanded ? 'Hide' : 'Assign'} Recipients
                        </Button>
                      </div>

                      {isExpanded && (
                        <div className="border-t pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {recipients.map((recipient) => {
                              const isAssigned = assignedRecipients.includes(recipient.id);
                              
                              return (
                                <div key={recipient.id} className="flex items-center gap-3 p-3 border rounded">
                                  <Checkbox
                                    checked={isAssigned}
                                    onCheckedChange={(checked) => 
                                      handleAssignRecipientToBox(box.id, recipient.id, checked as boolean)
                                    }
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium">{recipient.name}</p>
                                    <p className="text-sm text-gray-600">{recipient.email}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Assignment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Recipients:</span>
                    <span className="font-medium">{recipients.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Recipients:</span>
                    <span className="font-medium text-linden-blue">{getTotalAssignedRecipients()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gift Boxes:</span>
                    <span className="font-medium text-green-600">{selectedGiftBoxes.length}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Assignment Details</h4>
                  <div className="space-y-2">
                    {selectedGiftBoxes.map((box) => {
                      const assignedCount = getAssignedRecipientsForBox(box.id).length;
                      return (
                        <div key={box.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <img 
                            src={box.image} 
                            alt={box.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{box.name}</p>
                            <p className="text-xs text-gray-600">{assignedCount} recipients</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-linden-blue hover:bg-linden-blue/90"
                    onClick={handleContinue}
                    disabled={getTotalAssignedRecipients() === 0}
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
