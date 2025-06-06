import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Package, Trash2, Edit } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

// Mock gift catalog
const mockGiftCatalog = [
  { id: 1, name: 'Premium Coffee Set', price: 24.99, category: 'Food & Drink' },
  { id: 2, name: 'Gourmet Chocolate Box', price: 19.99, category: 'Food & Drink' },
  { id: 3, name: 'Scented Candle', price: 15.99, category: 'Home' },
  { id: 4, name: 'Artisan Tea Collection', price: 22.99, category: 'Food & Drink' },
  { id: 5, name: 'Premium Notebook', price: 18.99, category: 'Stationery' },
  { id: 6, name: 'Luxury Bath Set', price: 34.99, category: 'Personal Care' },
];

// Mock gift boxes from inventory
const mockInventoryGiftBoxes = [
  { id: "GB-001", boxName: "Premium Executive Box", size: "Large", unitCost: 125.99 },
  { id: "GB-002", boxName: "Holiday Celebration", size: "Medium", unitCost: 89.99 },
  { id: "GB-003", boxName: "Welcome Package", size: "Small", unitCost: 45.99 },
];

interface PresetBox {
  id: string;
  name: string;
  description: string;
  theme: string;
  size: string;
  basePrice: number;
  gifts: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  status: 'active' | 'inactive';
}

const PresetGiftBoxSetup = () => {
  const [presetBoxes, setPresetBoxes] = useState<PresetBox[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingBox, setEditingBox] = useState<PresetBox | null>(null);
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const [currentBoxId, setCurrentBoxId] = useState<string>('');
  
  const [newBox, setNewBox] = useState({
    name: '',
    description: '',
    theme: '',
    size: '',
    basePrice: 0,
  });

  const [editBox, setEditBox] = useState({
    name: '',
    description: '',
    theme: '',
    size: '',
    basePrice: 0,
  });

  const handleBoxNameChange = (boxName: string) => {
    const selectedBox = mockInventoryGiftBoxes.find(box => box.boxName === boxName);
    if (selectedBox) {
      setNewBox({
        ...newBox,
        name: boxName,
        size: selectedBox.size,
        basePrice: selectedBox.unitCost,
      });
    }
  };

  const handleEditBoxNameChange = (boxName: string) => {
    const selectedBox = mockInventoryGiftBoxes.find(box => box.boxName === boxName);
    if (selectedBox) {
      setEditBox({
        ...editBox,
        name: boxName,
        size: selectedBox.size,
        basePrice: selectedBox.unitCost,
      });
    }
  };

  const handleCreateBox = () => {
    const box: PresetBox = {
      id: `preset-${Date.now()}`,
      ...newBox,
      gifts: [],
      status: 'active',
    };
    
    setPresetBoxes([...presetBoxes, box]);
    setNewBox({ name: '', description: '', theme: '', size: '', basePrice: 0 });
    setShowCreateDialog(false);
  };

  const handleEditBoxSubmit = () => {
    if (editingBox) {
      const updatedBox: PresetBox = {
        ...editingBox,
        ...editBox,
      };
      
      setPresetBoxes(boxes =>
        boxes.map(box => box.id === editingBox.id ? updatedBox : box)
      );
      setEditingBox(null);
      setEditBox({ name: '', description: '', theme: '', size: '', basePrice: 0 });
      setShowEditDialog(false);
    }
  };

  const handleEditBoxClick = (box: PresetBox) => {
    setEditingBox(box);
    setEditBox({
      name: box.name,
      description: box.description,
      theme: box.theme,
      size: box.size,
      basePrice: box.basePrice,
    });
    setShowEditDialog(true);
  };

  const handleAddGift = (boxId: string, gift: any) => {
    setPresetBoxes(boxes =>
      boxes.map(box => {
        if (box.id === boxId) {
          const existingGift = box.gifts.find(g => g.id === gift.id);
          if (existingGift) {
            return {
              ...box,
              gifts: box.gifts.map(g =>
                g.id === gift.id ? { ...g, quantity: g.quantity + 1 } : g
              )
            };
          } else {
            return {
              ...box,
              gifts: [...box.gifts, { ...gift, quantity: 1 }]
            };
          }
        }
        return box;
      })
    );
  };

  const handleRemoveGift = (boxId: string, giftId: number) => {
    setPresetBoxes(boxes =>
      boxes.map(box => {
        if (box.id === boxId) {
          return {
            ...box,
            gifts: box.gifts.filter(g => g.id !== giftId)
          };
        }
        return box;
      })
    );
  };

  const handleToggleStatus = (boxId: string) => {
    setPresetBoxes(boxes =>
      boxes.map(box => {
        if (box.id === boxId) {
          return {
            ...box,
            status: box.status === 'active' ? 'inactive' : 'active'
          };
        }
        return box;
      })
    );
  };

  const calculateBoxTotal = (box: PresetBox) => {
    const giftsTotal = box.gifts.reduce((sum, gift) => sum + (gift.price * gift.quantity), 0);
    return box.basePrice + giftsTotal;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Preset Gift Box Setup</h1>
          <p className="text-gray-600">Create and manage preset gift boxes for clients to choose from</p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-linden-blue hover:bg-linden-blue/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Preset Box
        </Button>
      </div>

      {/* Preset Boxes List */}
      <div className="space-y-4">
        {presetBoxes.map((box) => (
          <Card key={box.id} className={box.status === 'inactive' ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {box.name}
                    <Badge variant={box.status === 'active' ? 'default' : 'secondary'}>
                      {box.status}
                    </Badge>
                  </CardTitle>
                  <p className="text-gray-600 mt-1">{box.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{box.theme}</Badge>
                    <Badge variant="outline">{box.size}</Badge>
                    <Badge variant="outline">${calculateBoxTotal(box).toFixed(2)}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(box.id)}
                  >
                    {box.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBoxClick(box)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Box
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentBoxId(box.id);
                      setShowGiftSelector(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Add Gifts to Box
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Included Gifts ({box.gifts.length})</h4>
                  {box.gifts.length > 0 ? (
                    <div className="space-y-1">
                      {box.gifts.map((gift, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>{gift.name} (x{gift.quantity})</span>
                          <div className="flex items-center gap-2">
                            <span>${(gift.price * gift.quantity).toFixed(2)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveGift(box.id, gift.id)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No gifts added yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {presetBoxes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No preset boxes created yet</h3>
            <p className="text-gray-500 mb-4">Create your first preset gift box to get started</p>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-linden-blue hover:bg-linden-blue/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Preset Box
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Box Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Preset Box</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Box Name</Label>
              <Select onValueChange={handleBoxNameChange} value={newBox.name}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a gift box" />
                </SelectTrigger>
                <SelectContent>
                  {mockInventoryGiftBoxes.map((box) => (
                    <SelectItem key={box.id} value={box.boxName}>
                      {box.boxName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newBox.description}
                onChange={(e) => setNewBox({ ...newBox, description: e.target.value })}
                placeholder="Describe this preset box..."
              />
            </div>
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Input
                id="theme"
                value={newBox.theme}
                onChange={(e) => setNewBox({ ...newBox, theme: e.target.value })}
                placeholder="e.g., Welcome, Birthday, Corporate"
              />
            </div>
            <div>
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={newBox.size}
                readOnly
                placeholder="Auto-filled based on selected box"
                className="bg-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="basePrice">Base Price ($)</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                value={newBox.basePrice}
                onChange={(e) => setNewBox({ ...newBox, basePrice: parseFloat(e.target.value) || 0 })}
                placeholder="Auto-filled, but can be edited"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateBox}
              disabled={!newBox.name.trim()}
              className="bg-linden-blue hover:bg-linden-blue/90"
            >
              Create Box
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Box Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Preset Box</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editName">Box Name</Label>
              <Select onValueChange={handleEditBoxNameChange} value={editBox.name}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a gift box" />
                </SelectTrigger>
                <SelectContent>
                  {mockInventoryGiftBoxes.map((box) => (
                    <SelectItem key={box.id} value={box.boxName}>
                      {box.boxName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={editBox.description}
                onChange={(e) => setEditBox({ ...editBox, description: e.target.value })}
                placeholder="Describe this preset box..."
              />
            </div>
            <div>
              <Label htmlFor="editTheme">Theme</Label>
              <Input
                id="editTheme"
                value={editBox.theme}
                onChange={(e) => setEditBox({ ...editBox, theme: e.target.value })}
                placeholder="e.g., Welcome, Birthday, Corporate"
              />
            </div>
            <div>
              <Label htmlFor="editSize">Size</Label>
              <Input
                id="editSize"
                value={editBox.size}
                readOnly
                placeholder="Auto-filled based on selected box"
                className="bg-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="editBasePrice">Base Price ($)</Label>
              <Input
                id="editBasePrice"
                type="number"
                step="0.01"
                value={editBox.basePrice}
                onChange={(e) => setEditBox({ ...editBox, basePrice: parseFloat(e.target.value) || 0 })}
                placeholder="Auto-filled, but can be edited"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditBoxSubmit}
              disabled={!editBox.name.trim()}
              className="bg-linden-blue hover:bg-linden-blue/90"
            >
              Update Box
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gift Selector Dialog */}
      <Dialog open={showGiftSelector} onOpenChange={setShowGiftSelector}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Gifts to Box</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {mockGiftCatalog.map((gift) => (
              <div key={gift.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{gift.name}</h4>
                  <p className="text-sm text-gray-600">{gift.category} • ${gift.price}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddGift(currentBoxId, gift)}
                  className="bg-linden-blue hover:bg-linden-blue/90"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowGiftSelector(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PresetGiftBoxSetup;
