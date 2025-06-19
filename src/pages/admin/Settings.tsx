import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ShippingSettings {
  freeShippingThreshold: number;
  defaultShippingCost: number;
  allowInternational: boolean;
}

interface BoxSize {
  id: string;
  name: string;
  dimensions: string;
  maxWeight: string;
}

const AdminSettings = () => {
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    freeShippingThreshold: 50,
    defaultShippingCost: 10,
    allowInternational: true,
  });
  const [boxSizes, setBoxSizes] = useState<BoxSize[]>([
    { id: '1', name: 'Small', dimensions: '8x6x4 in', maxWeight: '5 lbs' },
    { id: '2', name: 'Medium', dimensions: '12x10x6 in', maxWeight: '10 lbs' },
    { id: '3', name: 'Large', dimensions: '16x12x8 in', maxWeight: '15 lbs' },
  ]);
  const [isAddBoxSizeOpen, setIsAddBoxSizeOpen] = useState(false);
  const [isEditBoxSizeOpen, setIsEditBoxSizeOpen] = useState(false);
  const [editingBoxSize, setEditingBoxSize] = useState<BoxSize | null>(null);
  const [newBoxSize, setNewBoxSize] = useState<Omit<BoxSize, 'id'>>({
    name: '',
    dimensions: '',
    maxWeight: '',
  });

  const handleShippingSettingChange = (field: keyof ShippingSettings, value: any) => {
    setShippingSettings({ ...shippingSettings, [field]: value });
  };

  const handleAddBoxSize = () => {
    if (!newBoxSize.name.trim() || !newBoxSize.dimensions.trim() || !newBoxSize.maxWeight.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const newId = (boxSizes.length + 1).toString();
    const newBox: BoxSize = { id: newId, ...newBoxSize };
    setBoxSizes([...boxSizes, newBox]);
    setNewBoxSize({ name: '', dimensions: '', maxWeight: '' });
    setIsAddBoxSizeOpen(false);
    toast.success('Box size added successfully');
  };

  const handleEditBoxSize = (boxSize: BoxSize) => {
    setEditingBoxSize(boxSize);
    setIsEditBoxSizeOpen(true);
  };

  const handleUpdateBoxSize = () => {
    if (!editingBoxSize) return;

    setBoxSizes(boxSizes.map(box =>
      box.id === editingBoxSize.id ? { ...editingBoxSize } : box
    ));
    setEditingBoxSize(null);
    setIsEditBoxSizeOpen(false);
    toast.success('Box size updated successfully');
  };

  const handleDeleteBoxSize = (id: string) => {
    setBoxSizes(boxSizes.filter(box => box.id !== id));
    toast.success('Box size deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Shipping Tab */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Settings</CardTitle>
          <CardDescription>
            Configure shipping options and rates for your store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="free-shipping">Free Shipping Threshold ($)</Label>
            <Input
              id="free-shipping"
              type="number"
              value={shippingSettings.freeShippingThreshold}
              onChange={(e) => handleShippingSettingChange('freeShippingThreshold', parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="default-shipping">Default Shipping Cost ($)</Label>
            <Input
              id="default-shipping"
              type="number"
              value={shippingSettings.defaultShippingCost}
              onChange={(e) => handleShippingSettingChange('defaultShippingCost', parseFloat(e.target.value))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="allow-international"
              checked={shippingSettings.allowInternational}
              onCheckedChange={(checked) => handleShippingSettingChange('allowInternational', checked)}
            />
            <Label htmlFor="allow-international">Allow International Shipping</Label>
          </div>

          {/* Box Sizes Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Box Sizes</h3>
              <Button onClick={() => setIsAddBoxSizeOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Box Size
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {boxSizes.map((boxSize) => (
                <Card key={boxSize.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{boxSize.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {boxSize.dimensions}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBoxSize(boxSize)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBoxSize(boxSize.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Max Weight: {boxSize.maxWeight}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Box Size Modal */}
      <Dialog open={isAddBoxSizeOpen} onOpenChange={setIsAddBoxSizeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Box Size</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="boxsize-name">Name</Label>
              <Input
                id="boxsize-name"
                value={newBoxSize.name}
                onChange={(e) => setNewBoxSize({...newBoxSize, name: e.target.value})}
                placeholder="e.g., Small, Medium, Large"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boxsize-dimensions">Dimensions</Label>
              <Input
                id="boxsize-dimensions"
                value={newBoxSize.dimensions}
                onChange={(e) => setNewBoxSize({...newBoxSize, dimensions: e.target.value})}
                placeholder="e.g., 8x6x4 in"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boxsize-weight">Max Weight</Label>
              <Input
                id="boxsize-weight"
                value={newBoxSize.maxWeight}
                onChange={(e) => setNewBoxSize({...newBoxSize, maxWeight: e.target.value})}
                placeholder="e.g., 5 lbs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBoxSizeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBoxSize}>Add Box Size</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Box Size Modal */}
      <Dialog open={isEditBoxSizeOpen} onOpenChange={setIsEditBoxSizeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Box Size</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-boxsize-name">Name</Label>
              <Input
                id="edit-boxsize-name"
                value={editingBoxSize?.name || ''}
                onChange={(e) => setEditingBoxSize(editingBoxSize ? {...editingBoxSize, name: e.target.value} : null)}
                placeholder="e.g., Small, Medium, Large"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-boxsize-dimensions">Dimensions</Label>
              <Input
                id="edit-boxsize-dimensions"
                value={editingBoxSize?.dimensions || ''}
                onChange={(e) => setEditingBoxSize(editingBoxSize ? {...editingBoxSize, dimensions: e.target.value} : null)}
                placeholder="e.g., 8x6x4 in"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-boxsize-weight">Max Weight</Label>
              <Input
                id="edit-boxsize-weight"
                value={editingBoxSize?.maxWeight || ''}
                onChange={(e) => setEditingBoxSize(editingBoxSize ? {...editingBoxSize, maxWeight: e.target.value} : null)}
                placeholder="e.g., 5 lbs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBoxSizeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBoxSize}>Update Box Size</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSettings;
