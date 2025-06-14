
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface GiftBox {
  id: string;
  name: string;
  theme: string;
}

interface Recipient {
  name: string;
  email: string;
  phone: string;
  department: string;
  address: string;
  status: 'pending' | 'confirmed';
  shippingMode: string;
  source: 'manual' | 'bulk' | 'auto';
  assignedGiftBoxes?: string[];
}

interface AddRecipientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRecipient: (recipient: Recipient) => void;
  editingRecipient?: Recipient & { id: number } | null;
  availableGiftBoxes?: GiftBox[];
}

const AddRecipientModal = ({ 
  open, 
  onOpenChange, 
  onAddRecipient, 
  editingRecipient,
  availableGiftBoxes = []
}: AddRecipientModalProps) => {
  const [formData, setFormData] = useState<Recipient>({
    name: '',
    email: '',
    phone: '',
    department: '',
    address: '',
    status: 'pending',
    shippingMode: '',
    source: 'manual',
    assignedGiftBoxes: []
  });

  const [selectedGiftBoxes, setSelectedGiftBoxes] = useState<string[]>([]);

  useEffect(() => {
    if (editingRecipient) {
      setFormData({
        name: editingRecipient.name,
        email: editingRecipient.email,
        phone: editingRecipient.phone,
        department: editingRecipient.department,
        address: editingRecipient.address,
        status: editingRecipient.status,
        shippingMode: editingRecipient.shippingMode,
        source: editingRecipient.source,
        assignedGiftBoxes: editingRecipient.assignedGiftBoxes || []
      });
      setSelectedGiftBoxes(editingRecipient.assignedGiftBoxes || []);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        address: '',
        status: 'pending',
        shippingMode: '',
        source: 'manual',
        assignedGiftBoxes: []
      });
      setSelectedGiftBoxes([]);
    }
  }, [editingRecipient, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      return;
    }

    // Determine status based on address and gift box assignment
    const hasAddress = formData.address.trim() !== '';
    const hasGiftBoxes = selectedGiftBoxes.length > 0;
    const status = hasAddress && hasGiftBoxes ? 'confirmed' : 'pending';

    const recipientData: Recipient = {
      ...formData,
      assignedGiftBoxes: selectedGiftBoxes,
      status
    };

    onAddRecipient(recipientData);
    onOpenChange(false);
  };

  const handleGiftBoxSelect = (giftBoxId: string) => {
    if (!selectedGiftBoxes.includes(giftBoxId)) {
      setSelectedGiftBoxes(prev => [...prev, giftBoxId]);
    }
  };

  const handleGiftBoxRemove = (giftBoxId: string) => {
    setSelectedGiftBoxes(prev => prev.filter(id => id !== giftBoxId));
  };

  const getGiftBoxDisplayName = (giftBox: GiftBox) => {
    return `${giftBox.name} (${giftBox.theme})`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingRecipient ? 'Edit Recipient' : 'Add New Recipient'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Complete delivery address"
              />
            </div>

            {/* Gift Box Assignment */}
            {availableGiftBoxes.length > 0 && (
              <div className="col-span-2 space-y-2">
                <Label>Gift Box Assignment</Label>
                <Select onValueChange={handleGiftBoxSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gift boxes to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGiftBoxes
                      .filter(box => !selectedGiftBoxes.includes(box.id))
                      .map((giftBox) => (
                        <SelectItem key={giftBox.id} value={giftBox.id}>
                          {getGiftBoxDisplayName(giftBox)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                
                {/* Selected Gift Boxes */}
                {selectedGiftBoxes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedGiftBoxes.map((giftBoxId) => {
                      const giftBox = availableGiftBoxes.find(box => box.id === giftBoxId);
                      if (!giftBox) return null;
                      
                      return (
                        <Badge key={giftBoxId} variant="secondary" className="flex items-center gap-1">
                          {getGiftBoxDisplayName(giftBox)}
                          <button
                            type="button"
                            onClick={() => handleGiftBoxRemove(giftBoxId)}
                            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingRecipient ? 'Update Recipient' : 'Add Recipient'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipientModal;
