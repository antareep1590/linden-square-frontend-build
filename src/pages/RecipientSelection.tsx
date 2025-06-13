import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Edit, Trash2, Users, Gift, Mail, Phone, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface Recipient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  department?: string;
}

interface GiftBoxAssignment {
  [boxId: string]: string[];
}

const RecipientSelection = () => {
  const navigate = useNavigate();
  const { selectedBoxes } = useCart();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [giftBoxAssignments, setGiftBoxAssignments] = useState<GiftBoxAssignment>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: ''
    });
  };

  const handleAddRecipient = () => {
    if (!formData.name || !formData.email) {
      toast.error('Please enter recipient name and email');
      return;
    }

    const newRecipient: Recipient = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department
    };

    setRecipients([...recipients, newRecipient]);
    resetForm();
    setIsAddModalOpen(false);
    toast.success('Recipient added successfully');
  };

  const handleEditRecipient = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setFormData({
      name: recipient.name,
      email: recipient.email,
      phone: recipient.phone || '',
      department: recipient.department || ''
    });
    setIsAddModalOpen(true);
  };

  const handleUpdateRecipient = () => {
    if (!formData.name || !formData.email || !editingRecipient) {
      toast.error('Please enter recipient name and email');
      return;
    }

    const updatedRecipients = recipients.map(r => 
      r.id === editingRecipient.id 
        ? { ...r, ...formData }
        : r
    );

    setRecipients(updatedRecipients);
    resetForm();
    setEditingRecipient(null);
    setIsAddModalOpen(false);
    toast.success('Recipient updated successfully');
  };

  const handleDeleteRecipient = (id: number) => {
    setRecipients(recipients.filter(r => r.id !== id));
    
    // Remove from all gift box assignments
    const updatedAssignments = { ...giftBoxAssignments };
    Object.keys(updatedAssignments).forEach(boxId => {
      updatedAssignments[boxId] = updatedAssignments[boxId].filter(recipientId => recipientId !== id.toString());
    });
    setGiftBoxAssignments(updatedAssignments);
    
    toast.success('Recipient removed');
  };

  const handleRecipientAssignment = (boxId: string, recipientId: string, assigned: boolean) => {
    setGiftBoxAssignments(prev => {
      const currentAssignments = prev[boxId] || [];
      
      if (assigned) {
        return {
          ...prev,
          [boxId]: [...currentAssignments, recipientId]
        };
      } else {
        return {
          ...prev,
          [boxId]: currentAssignments.filter(id => id !== recipientId)
        };
      }
    });
  };

  const handleAssignAllToBox = (boxId: string) => {
    setGiftBoxAssignments(prev => ({
      ...prev,
      [boxId]: recipients.map(r => r.id.toString())
    }));
    toast.success('All recipients assigned to this gift box');
  };

  const handleContinue = () => {
    if (recipients.length === 0) {
      toast.error('Please add at least one recipient');
      return;
    }

    const hasAssignments = Object.values(giftBoxAssignments).some(assignments => assignments.length > 0);
    if (!hasAssignments) {
      toast.error('Please assign recipients to at least one gift box');
      return;
    }

    navigate('/shipping-fulfillment');
  };

  const getAssignedRecipientCount = (boxId: string) => {
    return giftBoxAssignments[boxId]?.length || 0;
  };

  const isRecipientAssigned = (boxId: string, recipientId: string) => {
    return giftBoxAssignments[boxId]?.includes(recipientId) || false;
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
          <p className="text-gray-600">Manage recipients and assign them to gift boxes</p>
        </div>
        <div className="flex items-center gap-4">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  resetForm();
                  setEditingRecipient(null);
                }}
                className="bg-linden-blue hover:bg-linden-blue/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Recipient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingRecipient ? 'Edit Recipient' : 'Add New Recipient'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter recipient name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter recipient email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter recipient phone"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="Enter recipient department"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={editingRecipient ? handleUpdateRecipient : handleAddRecipient}
                    className="flex-1 bg-linden-blue hover:bg-linden-blue/90"
                  >
                    {editingRecipient ? 'Update Recipient' : 'Add Recipient'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                      setEditingRecipient(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={handleContinue}
            disabled={recipients.length === 0}
            className="bg-linden-blue hover:bg-linden-blue/90"
          >
            Continue to Shipping
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recipients Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recipients ({recipients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recipients.length > 0 ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                    <div className="col-span-3">Name</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Phone</div>
                    <div className="col-span-2">Department</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  {recipients.map((recipient) => (
                    <div key={recipient.id} className="grid grid-cols-12 gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="col-span-3 font-medium">{recipient.name}</div>
                      <div className="col-span-3 text-gray-600">{recipient.email}</div>
                      <div className="col-span-2 text-gray-600">{recipient.phone || '-'}</div>
                      <div className="col-span-2 text-gray-600">{recipient.department || '-'}</div>
                      <div className="col-span-2 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRecipient(recipient)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRecipient(recipient.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                  <p>No recipients added yet</p>
                  <p className="text-sm">Click "Add New Recipient" to get started</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gift Box Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Assign Recipients to Gift Boxes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBoxes.length > 0 ? (
                <div className="space-y-6">
                  {selectedBoxes.map((box) => (
                    <div key={box.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={box.image || '/placeholder.svg'} 
                              alt={box.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{box.name}</h3>
                            <p className="text-sm text-gray-600">{box.theme}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {getAssignedRecipientCount(box.id)} of {recipients.length} assigned
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignAllToBox(box.id)}
                            disabled={recipients.length === 0}
                          >
                            Assign All
                          </Button>
                        </div>
                      </div>
                      
                      {recipients.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {recipients.map((recipient) => (
                            <div key={recipient.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                              <Checkbox
                                id={`${box.id}-${recipient.id}`}
                                checked={isRecipientAssigned(box.id, recipient.id.toString())}
                                onCheckedChange={(checked) => 
                                  handleRecipientAssignment(box.id, recipient.id.toString(), checked as boolean)
                                }
                              />
                              <label 
                                htmlFor={`${box.id}-${recipient.id}`} 
                                className="text-sm cursor-pointer flex-1"
                              >
                                {recipient.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Add recipients to assign them to this gift box
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No gift boxes selected
                </p>
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
                  <span>Gift Boxes:</span>
                  <span className="font-medium">{selectedBoxes.length}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Gift Box Assignments:</h4>
                <div className="space-y-2">
                  {selectedBoxes.map(box => (
                    <div key={box.id} className="flex justify-between text-sm">
                      <span className="truncate">{box.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {getAssignedRecipientCount(box.id)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
                onClick={handleContinue}
                disabled={recipients.length === 0}
              >
                Continue to Shipping
              </Button>
              
              {recipients.length === 0 && (
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
