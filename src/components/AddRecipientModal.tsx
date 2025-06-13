
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Recipient {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  address: string;
  shippingMode: string;
  status: 'pending' | 'confirmed';
}

interface AddRecipientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRecipient: (recipient: Omit<Recipient, 'id'>) => void;
  editingRecipient?: Recipient | null;
}

const AddRecipientModal = ({ open, onOpenChange, onAddRecipient, editingRecipient }: AddRecipientModalProps) => {
  const [formData, setFormData] = useState({
    name: editingRecipient?.name || '',
    email: editingRecipient?.email || '',
    phone: editingRecipient?.phone || '',
    department: editingRecipient?.department || '',
    address: editingRecipient?.address || '',
    shippingMode: editingRecipient?.shippingMode || ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const shippingModes = [
    'FedEx Standard',
    'FedEx Express',
    'UPS Ground',
    'UPS Express',
    'DHL Express',
    'USPS Priority'
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.shippingMode) newErrors.shippingMode = 'Shipping mode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const recipient = {
      ...formData,
      status: 'confirmed' as const
    };

    onAddRecipient(recipient);
    toast.success(editingRecipient ? 'Recipient updated successfully' : 'Recipient added successfully');
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      address: '',
      shippingMode: ''
    });
    setErrors({});
    onOpenChange(false);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
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
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Enter recipient name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Enter email address"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => updateField('department', e.target.value)}
              placeholder="Enter department"
            />
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Enter full shipping address"
              rows={3}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <div>
            <Label htmlFor="shippingMode">Shipping Mode *</Label>
            <Select
              value={formData.shippingMode}
              onValueChange={(value) => updateField('shippingMode', value)}
            >
              <SelectTrigger className={errors.shippingMode ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select shipping method" />
              </SelectTrigger>
              <SelectContent>
                {shippingModes.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.shippingMode && <p className="text-red-500 text-xs mt-1">{errors.shippingMode}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-linden-blue hover:bg-linden-blue/90">
            {editingRecipient ? 'Update Recipient' : 'Add Recipient'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipientModal;
