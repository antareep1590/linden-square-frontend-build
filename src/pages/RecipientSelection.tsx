
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Edit, Trash2, Users, Mail, Phone, Building2, Upload, Download, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import BulkUploadModal from '@/components/BulkUploadModal';

interface Recipient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  selected?: boolean;
}

interface PreviousOrder {
  id: string;
  date: string;
  giftBoxName: string;
  recipientCount: number;
}

const RecipientSelection = () => {
  const navigate = useNavigate();
  const { selectedBoxes } = useCart();
  
  // Mock previous orders data
  const [previousOrders] = useState<PreviousOrder[]>([
    {
      id: 'ORD-2024-001',
      date: '2024-02-15',
      giftBoxName: 'Premium Coffee Set',
      recipientCount: 25
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-20',
      giftBoxName: 'Wellness Package',
      recipientCount: 15
    },
    {
      id: 'ORD-2023-045',
      date: '2023-12-10',
      giftBoxName: 'Tech Starter Kit',
      recipientCount: 30
    }
  ]);
  
  // Initialize with sample recipients - all pre-selected
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '555-0123',
      department: 'Marketing',
      selected: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '555-0124',
      department: 'Engineering',
      selected: true
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      phone: '555-0125',
      department: 'Sales',
      selected: true
    }
  ]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: ''
  });

  const selectedGiftBox = selectedBoxes[0]; // Only one gift box can be selected

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
      department: formData.department,
      selected: true // Pre-select new recipients
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
    toast.success('Recipient removed');
  };

  const handleBulkUpload = (uploadedRecipients: any[]) => {
    const newRecipients = uploadedRecipients.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      department: r.department,
      selected: true // Pre-select bulk uploaded recipients
    }));
    
    setRecipients(prev => [...prev, ...newRecipients]);
    setIsBulkUploadOpen(false);
  };

  const handleRecipientSelect = (recipientId: number, selected: boolean) => {
    setRecipients(prev => 
      prev.map(r => 
        r.id === recipientId ? { ...r, selected } : r
      )
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setRecipients(prev => prev.map(r => ({ ...r, selected })));
    toast.success(selected ? 'All recipients selected' : 'All recipients deselected');
  };

  const handleContinue = () => {
    if (recipients.length === 0) {
      toast.error('Please add at least one recipient');
      return;
    }

    const selectedRecipients = recipients.filter(r => r.selected);
    if (selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    navigate('/customization');
  };

  const handleDownloadCSV = (orderId: string) => {
    // Mock CSV download - in real app would fetch actual data
    toast.success(`Downloading recipients for order ${orderId}`);
  };

  const getSelectedRecipientCount = () => {
    return recipients.filter(r => r.selected).length;
  };

  const isAllSelected = recipients.length > 0 && recipients.every(r => r.selected);
  const isSomeSelected = recipients.some(r => r.selected);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/choose-delivery-method')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Delivery Method
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Select Recipients</h1>
          <p className="text-gray-600">Manage recipients for your selected gift box</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setIsBulkUploadOpen(true)}
            variant="outline"
            className="border-linden-blue text-linden-blue hover:bg-linden-blue hover:text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          
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
            disabled={recipients.length === 0 || getSelectedRecipientCount() === 0}
            className="bg-linden-blue hover:bg-linden-blue/90"
          >
            Continue to Customization
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Previous Orders Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Previous Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {previousOrders.length > 0 ? (
                <div className="space-y-3">
                  {previousOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-gray-600">{order.date}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{order.giftBoxName}</p>
                            <p className="text-sm text-gray-600">{order.recipientCount} recipients</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadCSV(order.id)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download CSV
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="mx-auto h-8 w-8 mb-2 text-gray-300" />
                  <p>No previous orders found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recipients Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recipients ({recipients.length})
                </div>
                {recipients.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      className="data-[state=checked]:bg-linden-blue data-[state=checked]:border-linden-blue"
                    />
                    <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                      Select All ({getSelectedRecipientCount()}/{recipients.length})
                    </label>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recipients.length > 0 ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                    <div className="col-span-1"></div>
                    <div className="col-span-3">Name</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Phone</div>
                    <div className="col-span-2">Department</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                  {recipients.map((recipient) => (
                    <div key={recipient.id} className="grid grid-cols-12 gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="col-span-1 flex items-center">
                        <Checkbox
                          id={`recipient-${recipient.id}`}
                          checked={recipient.selected || false}
                          onCheckedChange={(checked) => 
                            handleRecipientSelect(recipient.id, checked as boolean)
                          }
                          className="data-[state=checked]:bg-linden-blue data-[state=checked]:border-linden-blue"
                        />
                      </div>
                      <div className="col-span-3 font-medium">{recipient.name}</div>
                      <div className="col-span-3 text-gray-600">{recipient.email}</div>
                      <div className="col-span-2 text-gray-600">{recipient.phone || '-'}</div>
                      <div className="col-span-2 text-gray-600">{recipient.department || '-'}</div>
                      <div className="col-span-1 flex gap-2">
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
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
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
                  <span>Selected Recipients:</span>
                  <span className="font-medium text-linden-blue">{getSelectedRecipientCount()}</span>
                </div>
                {selectedGiftBox && (
                  <div className="flex justify-between">
                    <span>Selected Gift Box:</span>
                    <span className="font-medium">{selectedGiftBox.name}</span>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
                onClick={handleContinue}
                disabled={recipients.length === 0 || getSelectedRecipientCount() === 0}
              >
                Continue to Customization
              </Button>
              
              {(recipients.length === 0 || getSelectedRecipientCount() === 0) && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {recipients.length === 0 ? 'Add recipients to continue' : 'Select recipients to continue'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onUploadSuccess={handleBulkUpload}
      />
    </div>
  );
};

export default RecipientSelection;
