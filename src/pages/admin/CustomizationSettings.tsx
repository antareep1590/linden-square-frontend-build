
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Image } from "lucide-react";
import { toast } from "sonner";

interface MessageGraphic {
  id: string;
  title: string;
  thumbnail?: string;
}

interface PresetMessage {
  id: string;
  message: string;
}

interface PhysicalCustomizationSettings {
  brandedNotecards: {
    enabled: boolean;
    price: number;
  };
  giftTags: {
    enabled: boolean;
    price: number;
    presetMessages: PresetMessage[];
  };
  messageCards: {
    enabled: boolean;
    price: number;
  };
}

const mockMessageGraphics: MessageGraphic[] = [
  { 
    id: '1', 
    title: 'Happy Birthday',
    thumbnail: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=center'
  },
  { 
    id: '2', 
    title: 'Welcome',
    thumbnail: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=100&h=100&fit=crop&crop=center'
  },
  { 
    id: '3', 
    title: 'Congratulations',
    thumbnail: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=100&h=100&fit=crop&crop=center'
  },
];

const AdminCustomizationSettings = () => {
  const [messageGraphics, setMessageGraphics] = useState<MessageGraphic[]>(mockMessageGraphics);
  const [isAddGraphicOpen, setIsAddGraphicOpen] = useState(false);
  const [isEditGraphicOpen, setIsEditGraphicOpen] = useState(false);
  const [editingGraphic, setEditingGraphic] = useState<MessageGraphic | null>(null);
  const [newGraphicTitle, setNewGraphicTitle] = useState('');
  const [isAddPresetOpen, setIsAddPresetOpen] = useState(false);
  const [newPresetMessage, setNewPresetMessage] = useState('');

  const [physicalSettings, setPhysicalSettings] = useState<PhysicalCustomizationSettings>({
    brandedNotecards: { enabled: true, price: 2.50 },
    giftTags: { 
      enabled: true, 
      price: 1.25,
      presetMessages: [
        { id: '1', message: "You're Amazing!" },
        { id: '2', message: "Congrats!" },
        { id: '3', message: "Thank You!" },
      ]
    },
    messageCards: { enabled: false, price: 3.00 },
  });

  const handleAddGraphic = () => {
    if (!newGraphicTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const newGraphic: MessageGraphic = {
      id: (messageGraphics.length + 1).toString(),
      title: newGraphicTitle,
      thumbnail: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&crop=center'
    };

    setMessageGraphics([...messageGraphics, newGraphic]);
    setNewGraphicTitle('');
    setIsAddGraphicOpen(false);
    toast.success('Message graphic added successfully');
  };

  const handleEditGraphic = (graphic: MessageGraphic) => {
    setEditingGraphic(graphic);
    setNewGraphicTitle(graphic.title);
    setIsEditGraphicOpen(true);
  };

  const handleUpdateGraphic = () => {
    if (!editingGraphic || !newGraphicTitle.trim()) return;

    setMessageGraphics(messageGraphics.map(graphic => 
      graphic.id === editingGraphic.id 
        ? { ...graphic, title: newGraphicTitle }
        : graphic
    ));
    setEditingGraphic(null);
    setNewGraphicTitle('');
    setIsEditGraphicOpen(false);
    toast.success('Message graphic updated successfully');
  };

  const handleDeleteGraphic = (id: string) => {
    setMessageGraphics(messageGraphics.filter(graphic => graphic.id !== id));
    toast.success('Message graphic deleted successfully');
  };

  const handleAddPresetMessage = () => {
    if (!newPresetMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const newPreset: PresetMessage = {
      id: (physicalSettings.giftTags.presetMessages.length + 1).toString(),
      message: newPresetMessage,
    };

    setPhysicalSettings({
      ...physicalSettings,
      giftTags: {
        ...physicalSettings.giftTags,
        presetMessages: [...physicalSettings.giftTags.presetMessages, newPreset]
      }
    });
    setNewPresetMessage('');
    setIsAddPresetOpen(false);
    toast.success('Preset message added successfully');
  };

  const handleDeletePresetMessage = (id: string) => {
    setPhysicalSettings({
      ...physicalSettings,
      giftTags: {
        ...physicalSettings.giftTags,
        presetMessages: physicalSettings.giftTags.presetMessages.filter(preset => preset.id !== id)
      }
    });
    toast.success('Preset message deleted successfully');
  };

  const updatePhysicalSetting = (
    section: keyof PhysicalCustomizationSettings,
    field: string,
    value: any
  ) => {
    setPhysicalSettings({
      ...physicalSettings,
      [section]: {
        ...physicalSettings[section],
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customization Settings</h1>
      </div>

      {/* Digital Gift Customization Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Digital Gift Customization Settings</CardTitle>
          <CardDescription>
            Manage message graphics options available for digital gifts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Message Graphic Selection</h3>
            <Button onClick={() => setIsAddGraphicOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Graphic
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messageGraphics.map((graphic) => (
                  <TableRow key={graphic.id}>
                    <TableCell className="font-medium">{graphic.title}</TableCell>
                    <TableCell>
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                        {graphic.thumbnail ? (
                          <img 
                            src={graphic.thumbnail} 
                            alt={graphic.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.setAttribute('style', 'display: flex');
                            }}
                          />
                        ) : null}
                        <Image className="h-6 w-6 text-gray-400" style={{ display: graphic.thumbnail ? 'none' : 'flex' }} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditGraphic(graphic)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGraphic(graphic.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Physical Gift Customization Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Physical Gift Customization Settings</CardTitle>
          <CardDescription>
            Configure customization options for physical gift orders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Branded Notecards */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium">Branded Notecards</h4>
              <Switch
                checked={physicalSettings.brandedNotecards.enabled}
                onCheckedChange={(checked) => 
                  updatePhysicalSetting('brandedNotecards', 'enabled', checked)
                }
              />
            </div>
            {physicalSettings.brandedNotecards.enabled && (
              <div className="space-y-2">
                <Label htmlFor="notecard-price">Price ($)</Label>
                <Input
                  id="notecard-price"
                  type="number"
                  step="0.01"
                  value={physicalSettings.brandedNotecards.price}
                  onChange={(e) => 
                    updatePhysicalSetting('brandedNotecards', 'price', parseFloat(e.target.value))
                  }
                  className="w-32"
                />
              </div>
            )}
          </div>

          {/* Gift Tags */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium">Gift Tags</h4>
              <Switch
                checked={physicalSettings.giftTags.enabled}
                onCheckedChange={(checked) => 
                  updatePhysicalSetting('giftTags', 'enabled', checked)
                }
              />
            </div>
            {physicalSettings.giftTags.enabled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="giftTag-price">Price ($)</Label>
                  <Input
                    id="giftTag-price"
                    type="number"
                    step="0.01"
                    value={physicalSettings.giftTags.price}
                    onChange={(e) => 
                      updatePhysicalSetting('giftTags', 'price', parseFloat(e.target.value))
                    }
                    className="w-32"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Preset Messages</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddPresetOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Message
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {physicalSettings.giftTags.presetMessages.map((preset) => (
                      <div key={preset.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{preset.message}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePresetMessage(preset.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Cards */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium">Message Cards</h4>
              <Switch
                checked={physicalSettings.messageCards.enabled}
                onCheckedChange={(checked) => 
                  updatePhysicalSetting('messageCards', 'enabled', checked)
                }
              />
            </div>
            {physicalSettings.messageCards.enabled && (
              <div className="space-y-2">
                <Label htmlFor="messageCard-price">Price ($)</Label>
                <Input
                  id="messageCard-price"
                  type="number"
                  step="0.01"
                  value={physicalSettings.messageCards.price}
                  onChange={(e) => 
                    updatePhysicalSetting('messageCards', 'price', parseFloat(e.target.value))
                  }
                  className="w-32"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Message Graphic Modal */}
      <Dialog open={isAddGraphicOpen} onOpenChange={setIsAddGraphicOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Message Graphic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="graphic-title">Title</Label>
              <Input
                id="graphic-title"
                value={newGraphicTitle}
                onChange={(e) => setNewGraphicTitle(e.target.value)}
                placeholder="Enter graphic title"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddGraphicOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGraphic}>Add Graphic</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Message Graphic Modal */}
      <Dialog open={isEditGraphicOpen} onOpenChange={setIsEditGraphicOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message Graphic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-graphic-title">Title</Label>
              <Input
                id="edit-graphic-title"
                value={newGraphicTitle}
                onChange={(e) => setNewGraphicTitle(e.target.value)}
                placeholder="Enter graphic title"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditGraphicOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateGraphic}>Update Graphic</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Preset Message Modal */}
      <Dialog open={isAddPresetOpen} onOpenChange={setIsAddPresetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Preset Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preset-message">Message</Label>
              <Input
                id="preset-message"
                value={newPresetMessage}
                onChange={(e) => setNewPresetMessage(e.target.value)}
                placeholder="Enter preset message"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPresetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPresetMessage}>Add Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomizationSettings;
