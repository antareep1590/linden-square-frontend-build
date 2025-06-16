
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface EGiftRecipient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  company?: string;
  giftMessage?: string;
  assignedBoxes: string[];
}

interface EGiftRecipientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (recipient: Omit<EGiftRecipient, 'id'>) => void;
  availableBoxes: { id: string; name: string }[];
}

const EGiftRecipientModal: React.FC<EGiftRecipientModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  availableBoxes
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    countryCode: 'US',
    company: '',
    giftMessage: '',
    assignedBoxes: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('First name, last name, and email are required');
      return;
    }

    if (formData.assignedBoxes.length === 0) {
      toast.error('Please assign at least one gift box');
      return;
    }

    onAdd(formData);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      countryCode: 'US',
      company: '',
      giftMessage: '',
      assignedBoxes: []
    });
    
    onClose();
  };

  const handleBoxAssignment = (boxId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      assignedBoxes: checked 
        ? [...prev.assignedBoxes, boxId]
        : prev.assignedBoxes.filter(id => id !== boxId)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add E-Gift Recipient</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Gift Box Assignment *</h4>
            <div className="space-y-2">
              {availableBoxes.map((box) => (
                <div key={box.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`box-${box.id}`}
                    checked={formData.assignedBoxes.includes(box.id)}
                    onCheckedChange={(checked) => handleBoxAssignment(box.id, checked as boolean)}
                  />
                  <Label htmlFor={`box-${box.id}`}>{box.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Optional Address Information</h4>
            <p className="text-sm text-gray-600">
              Recipients can provide their address during redemption, but you can pre-fill it here if available.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="countryCode">Country</Label>
                <Input
                  id="countryCode"
                  value={formData.countryCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="giftMessage">Personal Gift Message</Label>
              <Textarea
                id="giftMessage"
                value={formData.giftMessage}
                onChange={(e) => setFormData(prev => ({ ...prev, giftMessage: e.target.value }))}
                placeholder="Optional personal message for this recipient..."
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-linden-blue hover:bg-linden-blue/90">
              Add Recipient
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EGiftRecipientModal;
