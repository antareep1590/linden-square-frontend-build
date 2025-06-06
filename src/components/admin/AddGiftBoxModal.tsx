
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface GiftBox {
  id: string;
  boxName: string;
  sku: string;
  qtyInHand: number;
  reorderThreshold: number;
  unitCost: number;
  size: string;
  lastRefilledDate: Date;
}

interface AddGiftBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBoxAdded: (box: GiftBox) => void;
  editingBox?: GiftBox | null;
}

const AddGiftBoxModal = ({ isOpen, onClose, onBoxAdded, editingBox }: AddGiftBoxModalProps) => {
  const [formData, setFormData] = useState({
    boxName: '',
    sku: '',
    qtyInHand: '',
    reorderThreshold: '',
    unitCost: '',
    size: 'Medium',
  });

  React.useEffect(() => {
    if (editingBox) {
      setFormData({
        boxName: editingBox.boxName,
        sku: editingBox.sku,
        qtyInHand: editingBox.qtyInHand.toString(),
        reorderThreshold: editingBox.reorderThreshold.toString(),
        unitCost: editingBox.unitCost.toString(),
        size: editingBox.size,
      });
    } else {
      setFormData({
        boxName: '',
        sku: '',
        qtyInHand: '',
        reorderThreshold: '',
        unitCost: '',
        size: 'Medium',
      });
    }
  }, [editingBox, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.boxName || !formData.sku || !formData.qtyInHand || !formData.reorderThreshold || !formData.unitCost) {
      toast.error('Please fill in all required fields');
      return;
    }

    const boxData: GiftBox = {
      id: editingBox?.id || `GB-${Date.now()}`,
      boxName: formData.boxName,
      sku: formData.sku,
      qtyInHand: parseInt(formData.qtyInHand),
      reorderThreshold: parseInt(formData.reorderThreshold),
      unitCost: parseFloat(formData.unitCost),
      size: formData.size,
      lastRefilledDate: editingBox?.lastRefilledDate || new Date(),
    };

    onBoxAdded(boxData);
    toast.success(editingBox ? 'Gift box updated successfully' : 'Gift box added successfully');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingBox ? 'Edit Gift Box' : 'Add New Gift Box'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="boxName">Box Name *</Label>
              <Input
                id="boxName"
                value={formData.boxName}
                onChange={(e) => setFormData({ ...formData, boxName: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qtyInHand">Qty In Hand *</Label>
              <Input
                id="qtyInHand"
                type="number"
                value={formData.qtyInHand}
                onChange={(e) => setFormData({ ...formData, qtyInHand: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reorderThreshold">Reorder Threshold *</Label>
              <Input
                id="reorderThreshold"
                type="number"
                value={formData.reorderThreshold}
                onChange={(e) => setFormData({ ...formData, reorderThreshold: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unitCost">Unit Cost *</Label>
              <Input
                id="unitCost"
                type="number"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="size">Size *</Label>
            <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Small">Small</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingBox ? 'Update Gift Box' : 'Add Gift Box'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGiftBoxModal;
