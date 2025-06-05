import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Users, Plus, Upload, Trash2, AlertTriangle, Edit, Package, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

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
  const { selectedBoxes, updateBox } = useCart();
  
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
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sendOption, setSendOption] = useState<'now' | 'later'>('now');

  const [boxAssignments, setBoxAssignments] = useState<{ [boxId: string]: string[] }>({});

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
    const savedIndex = savedRecipients.findIndex(r => r.id === id);
    if (savedIndex !== -1) {
      setSavedRecipients(prev => prev.filter(r => r.id !== id));
    } else {
      setNewRecipients(prev => prev.filter(r => r.id !== id));
    }
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

  const handleEditRecipient = (recipient: Recipient) => {
    setEditingRecipient({ ...recipient });
    setIsEditModalOpen(true);
  };

  const handleUpdateRecipient = () => {
    if (!editingRecipient) return;

    const savedIndex = savedRecipients.findIndex(r => r.id === editingRecipient.id);
    if (savedIndex !== -1) {
      setSavedRecipients(prev => prev.map(r => 
        r.id === editingRecipient.id ? editingRecipient : r
      ));
    } else {
      setNewRecipients(prev => prev.map(r => 
        r.id === editingRecipient.id ? editingRecipient : r
      ));
    }
    setIsEditModalOpen(false);
    setEditingRecipient(null);
    toast.success('Recipient updated successfully');
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

  const assignRecipientToBox = (boxId: string, recipientId: string, assigned: boolean) => {
    setBoxAssignments(prev => {
      const currentAssignments = prev[boxId] || [];
      if (assigned) {
        return { ...prev, [boxId]: [...currentAssignments.filter(id => id !== recipientId), recipientId] };
      } else {
        return { ...prev, [boxId]: currentAssignments.filter(id => id !== recipientId) };
      }
    });
  };

  const assignAllRecipientsToBox = (boxId: string) => {
    const selectedRecipientIds = allRecipients.filter(r => r.included).map(r => r.id);
    setBoxAssignments(prev => ({ ...prev, [boxId]: selectedRecipientIds }));
    toast.success('All recipients assigned to box');
  };

  const getAssignedRecipients = (boxId: string) => {
    const assignedIds = boxAssignments[boxId] || [];
    return allRecipients.filter(r => assignedIds.includes(r.id));
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

    // Update boxes with assigned recipients
    selectedBoxes.forEach(box => {
      const assignedRecipients = getAssignedRecipients(box.id);
      updateBox(box.id, {
        assignedRecipients: assignedRecipients.map(r => ({
          id: r.id,
          name: r.name,
          email: r.email,
          tag: r.tag
        }))
      });
    });

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
          <p className="text-gray-600">Add recipients and assign them to your gift boxes</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-linden-blue hover:bg-linden-blue/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Recipient
          </Button>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Recipient</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Full Name"
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  value={newRecipient.email}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Phone Number"
                  value={newRecipient.phone}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tag">Tag</Label>
                <Input
                  id="tag"
                  placeholder="e.g., Client, Friend"
                  value={newRecipient.tag}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, tag: e.target.value }))}
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Address"
                  value={newRecipient.address}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => {
                addRecipient();
                setIsAddModalOpen(false);
              }}>
                Add Recipient
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Upload CSV
        </Button>
      </div>

      {/* Helper text for CSV */}
      <p className="text-xs text-gray-500 mb-6">
        Click to upload CSV file. CSV must include: Name, Email, Phone, Address, Tag
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recipients Table and Assignment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recipients Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recipients ({allRecipients.length})
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
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRecipient(recipient)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRecipient(recipient.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Assign Gift Box Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Assign Gift Boxes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedBoxes.map(box => (
                <div key={box.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{box.name}</h4>
                      <Badge variant="outline">{box.size}</Badge>
                      <Badge variant="secondary">{box.theme}</Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => assignAllRecipientsToBox(box.id)}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Assign All
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      Assigned Recipients ({getAssignedRecipients(box.id).length})
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {allRecipients.filter(r => r.included).map(recipient => {
                        const isAssigned = (boxAssignments[box.id] || []).includes(recipient.id);
                        
                        return (
                          <div key={recipient.id} className="flex items-center space-x-2">
                            <Checkbox
                              checked={isAssigned}
                              onCheckedChange={(checked) => 
                                assignRecipientToBox(box.id, recipient.id, checked as boolean)
                              }
                            />
                            <span className="text-sm">{recipient.name}</span>
                            {recipient.tag && (
                              <Badge variant="outline" className="text-xs">{recipient.tag}</Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
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

                <div className="border-t pt-3">
                  <h4 className="font-medium mb-2">Box Assignments</h4>
                  <div className="space-y-2 text-sm">
                    {selectedBoxes.map(box => (
                      <div key={box.id} className="flex justify-between">
                        <span>{box.name}:</span>
                        <span className="text-linden-blue">{getAssignedRecipients(box.id).length} recipients</span>
                      </div>
                    ))}
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

      {/* Edit Recipient Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Recipient</DialogTitle>
          </DialogHeader>
          
          {editingRecipient && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editingRecipient.name}
                  onChange={(e) => setEditingRecipient({ ...editingRecipient, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingRecipient.email}
                  onChange={(e) => setEditingRecipient({ ...editingRecipient, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingRecipient.phone || ''}
                  onChange={(e) => setEditingRecipient({ ...editingRecipient, phone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-tag">Tag</Label>
                <Input
                  id="edit-tag"
                  value={editingRecipient.tag}
                  onChange={(e) => setEditingRecipient({ ...editingRecipient, tag: e.target.value })}
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editingRecipient.address || ''}
                  onChange={(e) => setEditingRecipient({ ...editingRecipient, address: e.target.value })}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateRecipient}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipientSelection;
