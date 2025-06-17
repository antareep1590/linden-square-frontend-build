
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Edit, Trash2, Users, Gift, Upload, Download } from 'lucide-react';
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
  isAssigned: boolean;
}

interface PreviousOrder {
  id: string;
  orderNumber: string;
  date: string;
  recipientCount: number;
  giftBox: string;
}

const RecipientSelection = () => {
  const navigate = useNavigate();
  const { selectedBoxes } = useCart();
  
  // Mock previous orders
  const [previousOrders] = useState<PreviousOrder[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      recipientCount: 25,
      giftBox: 'Premium Coffee Collection'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-02-20',
      recipientCount: 18,
      giftBox: 'Wellness Package'
    }
  ]);

  // Initialize with sample recipients, all pre-assigned to the selected gift box
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '555-0123',
      department: 'Marketing',
      isAssigned: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '555-0124',
      department: 'Engineering',
      isAssigned: true
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      phone: '555-0125',
      department: 'Sales',
      isAssigned: true
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
      isAssigned: true // Auto-assign to the selected gift box
    };

    setRecipients([...recipients, newRecipient]);
    resetForm();
    setIsAddModalOpen(false);
    toast.success('Recipient added and assigned to gift box');
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
      isAssigned: true // Auto-assign all uploaded recipients
    }));
    
    setRecipients(prev => [...prev, ...newRecipients]);
    setIsBulkUploadOpen(false);
    toast.success(`${newRecipients.length} recipients added and assigned to gift box`);
  };

  const handleRecipientToggle = (recipientId: number) => {
    setRecipients(prev => 
      prev.map(r => 
        r.id === recipientId 
          ? { ...r, isAssigned: !r.isAssigned }
          : r
      )
    );
  };

  const handleContinue = () => {
    const assignedRecipients = recipients.filter(r => r.isAssigned);
    if (assignedRecipients.length === 0) {
      toast.error('Please assign at least one recipient to the gift box');
      return;
    }

    navigate('/customization');
  };

  const handleDownloadCSV = (order: PreviousOrder) => {
    // Mock CSV download functionality
    toast.success(`Downloading recipient list for ${order.orderNumber}`);
    // In a real app, this would trigger an actual CSV download
  };

  const getAssignedCount = () => recipients.filter(r => r.isAssigned).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/box-listing')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gift Boxes
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Select Recipients</h1>
          <p className="text-gray-600">Manage recipients and assign them to your selected gift box</p>
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
            disabled={getAssignedCount() === 0}
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
                <Gift className="h-5 w-5" />
                Previous Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {previousOrders.length > 0 ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                    <div className="col-span-3">Order Number</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Recipients</div>
                    <div className="col-span-3">Gift Box</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  {previousOrders.map((order) => (
                    <div key={order.id} className="grid grid-cols-12 gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="col-span-3 font-medium">{order.orderNumber}</div>
                      <div className="col-span-2 text-gray-600">{order.date}</div>
                      <div className="col-span-2 text-gray-600">{order.recipientCount}</div>
                      <div className="col-span-3 text-gray-600">{order.giftBox}</div>
                      <div className="col-span-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadCSV(order)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          CSV
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Gift className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                  <p>No previous orders found</p>
                </div>
              )}
            </CardContent>
          </Card>

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

          {/* Gift Box Assignment */}
          {selectedGiftBox && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Assign Recipients to Gift Box
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                      <div>
                        <h3 className="font-medium">{selectedGiftBox.name}</h3>
                        <p className="text-sm text-gray-600">{selectedGiftBox.theme}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {getAssignedCount()} of {recipients.length} assigned
                    </Badge>
                  </div>
                  
                  {recipients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {recipients.map((recipient) => (
                        <div key={recipient.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                          <Checkbox
                            id={`recipient-${recipient.id}`}
                            checked={recipient.isAssigned}
                            onCheckedChange={() => handleRecipientToggle(recipient.id)}
                          />
                          <label 
                            htmlFor={`recipient-${recipient.id}`} 
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
              </CardContent>
            </Card>
          )}
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
                  <span>Assigned Recipients:</span>
                  <span className="font-medium">{getAssignedCount()}</span>
                </div>
                {selectedGiftBox && (
                  <div className="flex justify-between">
                    <span>Selected Gift Box:</span>
                    <span className="font-medium text-sm">{selectedGiftBox.name}</span>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full bg-linden-blue hover:bg-linden-blue/90"
                onClick={handleContinue}
                disabled={getAssignedCount() === 0}
              >
                Continue to Customization
              </Button>
              
              {getAssignedCount() === 0 && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Assign recipients to continue
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
