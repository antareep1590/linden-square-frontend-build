import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Download, Users, CheckCircle, AlertCircle, Plus, Edit, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BulkUploadModal from '@/components/BulkUploadModal';
import AddRecipientModal from '@/components/AddRecipientModal';

interface Recipient {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  address: string;
  status: 'pending' | 'confirmed';
  assignedGiftBoxes?: string[];
  shippingMode?: string;
  source?: string;
}

const SelectRecipientsPublic = () => {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);

  // Sample gift boxes for assignment
  const availableGiftBoxes = [
    { id: '1', name: 'Executive Appreciation Box', theme: 'Professional' },
    { id: '2', name: 'Wellness Package', theme: 'Wellness' },
    { id: '3', name: 'Tech Accessories Kit', theme: 'Professional' }
  ];

  const handleAddRecipient = (recipientData: Omit<Recipient, 'id'>) => {
    if (editingRecipient) {
      setRecipients(prev => prev.map(r => 
        r.id === editingRecipient.id 
          ? { ...recipientData, id: editingRecipient.id }
          : r
      ));
      setEditingRecipient(null);
    } else {
      const newRecipient: Recipient = {
        ...recipientData,
        id: Math.max(...recipients.map(r => r.id), 0) + 1,
        shippingMode: '',
        source: 'manual'
      };
      setRecipients(prev => [...prev, newRecipient]);
    }
    toast.success(editingRecipient ? 'Recipient updated' : 'Recipient added');
  };

  const handleEditRecipient = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setShowAddRecipient(true);
  };

  const handleDeleteRecipient = (id: number) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
    setSelectedRecipients(prev => prev.filter(selectedId => selectedId !== id));
    toast.success('Recipient removed');
  };

  const handleSelectRecipient = (id: number) => {
    setSelectedRecipients(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecipients.length === recipients.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(recipients.map(r => r.id));
    }
  };

  const handleGiftBoxAssignment = (recipientId: number, giftBoxIds: string[]) => {
    setRecipients(prev => prev.map(r => {
      if (r.id === recipientId) {
        const hasAddress = r.address.trim() !== '';
        const hasGiftBoxes = giftBoxIds.length > 0;
        const newStatus = hasAddress && hasGiftBoxes ? 'confirmed' : 'pending';
        
        return {
          ...r,
          assignedGiftBoxes: giftBoxIds,
          status: newStatus
        };
      }
      return r;
    }));
  };

  const handleBulkUploadSuccess = (newRecipients: any[]) => {
    const formattedRecipients: Recipient[] = newRecipients.map((r, index) => ({
      id: Math.max(...recipients.map(r => r.id), 0) + index + 1,
      name: r.name,
      email: r.email,
      phone: r.phone || '',
      department: r.department || '',
      address: r.address || '',
      status: (r.address && r.assignedGiftBoxes?.length > 0) ? 'confirmed' : 'pending',
      assignedGiftBoxes: r.assignedGiftBoxes || [],
      shippingMode: '',
      source: 'bulk'
    }));
    
    setRecipients(prev => [...prev, ...formattedRecipients]);
    setShowBulkUpload(false);
    toast.success(`${newRecipients.length} recipients added`);
  };

  const handleContinueToShipping = () => {
    if (recipients.length === 0) {
      toast.error('Please add at least one recipient');
      return;
    }
    
    const confirmedRecipients = recipients.filter(r => r.status === 'confirmed');
    if (confirmedRecipients.length === 0) {
      toast.error('Please ensure at least one recipient has both an address and gift box assigned');
      return;
    }
    
    navigate('/public/shipping-fulfillment');
  };

  const downloadTemplate = () => {
    toast.success('CSV template downloaded');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Select Recipients</h1>
              <p className="text-gray-600">Add recipients and assign gift boxes to complete your order</p>
            </div>
            <Button 
              onClick={handleContinueToShipping}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={recipients.filter(r => r.status === 'confirmed').length === 0}
            >
              Continue to Shipping
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bulk Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Bulk Upload Recipients
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV Template
                  </Button>
                  <span className="text-sm text-gray-600">
                    Use our template to ensure proper formatting
                  </span>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Upload CSV File
                    </p>
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop your CSV file here
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => setShowBulkUpload(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Bulk Upload
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recipients Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recipients ({recipients.length})
                  </CardTitle>
                  <Button
                    onClick={() => setShowAddRecipient(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Recipient
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recipients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="mx-auto h-12 w-12 mb-4" />
                    <p>No recipients added yet. Add recipients to get started!</p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedRecipients.length === recipients.length && recipients.length > 0}
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Gift Box Assignment</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recipients.map((recipient) => (
                          <TableRow key={recipient.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedRecipients.includes(recipient.id)}
                                onCheckedChange={() => handleSelectRecipient(recipient.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{recipient.name}</p>
                                <p className="text-sm text-gray-600">{recipient.email}</p>
                                {recipient.department && (
                                  <p className="text-xs text-gray-500">{recipient.department}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-48">
                              <p className="text-sm truncate">{recipient.address || 'Not provided'}</p>
                            </TableCell>
                            <TableCell className="max-w-64">
                              <div className="space-y-1">
                                <Select
                                  onValueChange={(value) => {
                                    const currentBoxes = recipient.assignedGiftBoxes || [];
                                    if (!currentBoxes.includes(value)) {
                                      handleGiftBoxAssignment(recipient.id, [...currentBoxes, value]);
                                    }
                                  }}
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Assign gift box" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableGiftBoxes
                                      .filter(box => !recipient.assignedGiftBoxes?.includes(box.id))
                                      .map((giftBox) => (
                                        <SelectItem key={giftBox.id} value={giftBox.id} className="text-xs">
                                          {giftBox.name} ({giftBox.theme})
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                                
                                {/* Display assigned gift boxes */}
                                {recipient.assignedGiftBoxes && recipient.assignedGiftBoxes.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {recipient.assignedGiftBoxes.map((giftBoxId) => (
                                      <Badge key={giftBoxId} variant="secondary" className="text-xs flex items-center gap-1">
                                        {availableGiftBoxes.find(box => box.id === giftBoxId)?.name || 'Unknown'}
                                        <button
                                          onClick={() => {
                                            const updatedBoxes = recipient.assignedGiftBoxes?.filter(id => id !== giftBoxId) || [];
                                            handleGiftBoxAssignment(recipient.id, updatedBoxes);
                                          }}
                                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                        >
                                          <X className="h-2 w-2" />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {recipient.status === 'confirmed' ? (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Confirmed
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                  <AlertCircle className="mr-1 h-3 w-3" />
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditRecipient(recipient)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteRecipient(recipient.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {selectedRecipients.length > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mt-4">
                    <span className="text-sm font-medium">
                      {selectedRecipients.length} recipient(s) selected
                    </span>
                    <Button variant="outline" size="sm">
                      Assign Gift Box
                    </Button>
                    <Button variant="outline" size="sm">
                      Export Selected
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Recipients Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Total Recipients:</span>
                    <span className="font-medium">{recipients.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Confirmed:</span>
                    <span className="font-medium text-green-600">
                      {recipients.filter(r => r.status === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending:</span>
                    <span className="font-medium text-orange-600">
                      {recipients.filter(r => r.status === 'pending').length}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleContinueToShipping}
                    disabled={recipients.filter(r => r.status === 'confirmed').length === 0}
                  >
                    Continue to Shipping
                  </Button>
                  
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {recipients.filter(r => r.status === 'confirmed').length === 0 
                      ? 'Add recipients with addresses and gift boxes to continue'
                      : `${recipients.filter(r => r.status === 'confirmed').length} recipient(s) ready for shipping`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onUploadSuccess={handleBulkUploadSuccess}
      />

      <AddRecipientModal
        open={showAddRecipient}
        onOpenChange={(open) => {
          setShowAddRecipient(open);
          if (!open) setEditingRecipient(null);
        }}
        onAddRecipient={handleAddRecipient}
        editingRecipient={editingRecipient}
        availableGiftBoxes={availableGiftBoxes}
      />
    </div>
  );
};

export default SelectRecipientsPublic;
