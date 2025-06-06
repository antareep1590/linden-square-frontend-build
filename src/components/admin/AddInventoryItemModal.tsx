
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

const categories = [
  "Food & Beverage",
  "Drinkware",
  "Home & Living",
  "Stationery",
  "Technology",
  "Apparel",
  "Health & Beauty"
];

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  reorderThreshold: number;
  unitCost: number;
  status: 'active' | 'inactive';
  tags?: string;
  lastRefilledDate: Date;
}

interface AddInventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: (item: InventoryItem) => void;
  editingItem?: InventoryItem | null;
}

const AddInventoryItemModal = ({ isOpen, onClose, onItemAdded, editingItem }: AddInventoryItemModalProps) => {
  const [formData, setFormData] = useState({
    name: editingItem?.name || '',
    sku: editingItem?.sku || '',
    category: editingItem?.category || '',
    unitCost: editingItem?.unitCost?.toString() || '',
    quantity: editingItem?.quantity?.toString() || '',
    reorderThreshold: editingItem?.reorderThreshold?.toString() || '',
    status: editingItem?.status || 'active' as const,
    tags: editingItem?.tags || '',
  });

  React.useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        sku: editingItem.sku,
        category: editingItem.category,
        unitCost: editingItem.unitCost.toString(),
        quantity: editingItem.quantity.toString(),
        reorderThreshold: editingItem.reorderThreshold.toString(),
        status: editingItem.status,
        tags: editingItem.tags || '',
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: '',
        unitCost: '',
        quantity: '',
        reorderThreshold: '',
        status: 'active',
        tags: '',
      });
    }
  }, [editingItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sku || !formData.category || !formData.unitCost || !formData.quantity || !formData.reorderThreshold) {
      toast.error('Please fill in all required fields');
      return;
    }

    const itemData: InventoryItem = {
      id: editingItem?.id || `ITEM-${Date.now()}`,
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      unitCost: parseFloat(formData.unitCost),
      quantity: parseInt(formData.quantity),
      reorderThreshold: parseInt(formData.reorderThreshold),
      status: formData.status,
      tags: formData.tags,
      lastRefilledDate: editingItem?.lastRefilledDate || new Date(),
    };

    onItemAdded(itemData);
    toast.success(editingItem ? 'Item updated successfully' : 'Item added successfully');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity On Hand *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
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
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Comma-separated tags"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryItemModal;
