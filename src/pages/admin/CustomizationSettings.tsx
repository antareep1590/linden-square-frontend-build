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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Image, Upload, Save, X } from "lucide-react";
import { toast } from "sonner";

interface MessageGraphic {
  id: string;
  title: string;
  thumbnail?: string;
  imageFile?: File;
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

interface DeliveryFeature {
  id: string;
  text: string;
}

interface DeliveryDisplaySettings {
  digitalGift: {
    howItWorks: string;
    features: DeliveryFeature[];
  };
  physicalDelivery: {
    howItWorks: string;
    features: DeliveryFeature[];
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
  const [newGraphicImage, setNewGraphicImage] = useState<File | null>(null);
  const [isAddPresetOpen, setIsAddPresetOpen] = useState(false);
  const [newPresetMessage, setNewPresetMessage] = useState('');
  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false);
  const [featureType, setFeatureType] = useState<'digital' | 'physical'>('digital');
  const [newFeatureText, setNewFeatureText] = useState('');
  
  // New states for feature editing
  const [editingFeature, setEditingFeature] = useState<{type: 'digital' | 'physical', id: string} | null>(null);
  const [editFeatureText, setEditFeatureText] = useState('');

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

  const [deliveryDisplaySettings, setDeliveryDisplaySettings] = useState<DeliveryDisplaySettings>({
    digitalGift: {
      howItWorks: "Send personalized digital gifts instantly to recipients via email or text. Recipients can access their gift through a secure link and enjoy the experience immediately.",
      features: [
        { id: '1', text: "Instant delivery via email or SMS" },
        { id: '2', text: "Personalized message cards and graphics" },
        { id: '3', text: "No shipping costs or delays" }
      ]
    },
    physicalDelivery: {
      howItWorks: "Curate and ship beautiful gift boxes directly to recipients. Each package is carefully assembled and includes premium packaging with your personalized touches.",
      features: [
        { id: '1', text: "Premium packaging and presentation" },
        { id: '2', text: "Branded notecards and gift tags available" },
        { id: '3', text: "Real-time tracking and delivery confirmation" }
      ]
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (.jpg, .png, .webp)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setNewGraphicImage(file);
      toast.success('Image uploaded successfully');
    }
  };

  const handleAddGraphic = () => {
    if (!newGraphicTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const newGraphic: MessageGraphic = {
      id: (messageGraphics.length + 1).toString(),
      title: newGraphicTitle,
      imageFile: newGraphicImage || undefined,
      thumbnail: newGraphicImage 
        ? URL.createObjectURL(newGraphicImage)
        : 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&crop=center'
    };

    setMessageGraphics([...messageGraphics, newGraphic]);
    setNewGraphicTitle('');
    setNewGraphicImage(null);
    setIsAddGraphicOpen(false);
    toast.success('Message graphic added successfully');
  };

  const handleEditGraphic = (graphic: MessageGraphic) => {
    setEditingGraphic(graphic);
    setNewGraphicTitle(graphic.title);
    setNewGraphicImage(graphic.imageFile || null);
    setIsEditGraphicOpen(true);
  };

  const handleUpdateGraphic = () => {
    if (!editingGraphic || !newGraphicTitle.trim()) return;

    setMessageGraphics(messageGraphics.map(graphic => 
      graphic.id === editingGraphic.id 
        ? { 
            ...graphic, 
            title: newGraphicTitle,
            imageFile: newGraphicImage || graphic.imageFile,
            thumbnail: newGraphicImage 
              ? URL.createObjectURL(newGraphicImage)
              : graphic.thumbnail
          }
        : graphic
    ));
    setEditingGraphic(null);
    setNewGraphicTitle('');
    setNewGraphicImage(null);
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

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) {
      toast.error('Please enter feature text');
      return;
    }

    const currentFeatures = deliveryDisplaySettings[featureType].features;
    if (currentFeatures.length >= 3) {
      toast.error('Maximum 3 features allowed');
      return;
    }

    const newFeature: DeliveryFeature = {
      id: (currentFeatures.length + 1).toString(),
      text: newFeatureText,
    };

    setDeliveryDisplaySettings({
      ...deliveryDisplaySettings,
      [featureType]: {
        ...deliveryDisplaySettings[featureType],
        features: [...currentFeatures, newFeature]
      }
    });

    setNewFeatureText('');
    setIsAddFeatureOpen(false);
    toast.success('Feature added successfully');
  };

  const handleDeleteFeature = (type: 'digital' | 'physical', featureId: string) => {
    setDeliveryDisplaySettings({
      ...deliveryDisplaySettings,
      [type]: {
        ...deliveryDisplaySettings[type],
        features: deliveryDisplaySettings[type].features.filter(feature => feature.id !== featureId)
      }
    });
    toast.success('Feature deleted successfully');
  };

  const updateDeliveryContent = (type: 'digital' | 'physical', content: string) => {
    setDeliveryDisplaySettings({
      ...deliveryDisplaySettings,
      [type === 'digital' ? 'digitalGift' : 'physicalDelivery']: {
        ...deliveryDisplaySettings[type === 'digital' ? 'digitalGift' : 'physicalDelivery'],
        howItWorks: content
      }
    });
  };

  const handleEditFeature = (type: 'digital' | 'physical', featureId: string, currentText: string) => {
    setEditingFeature({ type, id: featureId });
    setEditFeatureText(currentText);
  };

  const handleSaveFeature = () => {
    if (!editingFeature || !editFeatureText.trim()) {
      toast.error('Please enter feature text');
      return;
    }

    const { type, id } = editingFeature;
    const sectionKey = type === 'digital' ? 'digitalGift' : 'physicalDelivery';

    setDeliveryDisplaySettings({
      ...deliveryDisplaySettings,
      [sectionKey]: {
        ...deliveryDisplaySettings[sectionKey],
        features: deliveryDisplaySettings[sectionKey].features.map(feature =>
          feature.id === id ? { ...feature, text: editFeatureText.trim() } : feature
        )
      }
    });

    setEditingFeature(null);
    setEditFeatureText('');
    toast.success('Feature updated successfully');
  };

  const handleCancelEditFeature = () => {
    setEditingFeature(null);
    setEditFeatureText('');
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
                  <TableHead>Graphic Image</TableHead>
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

      {/* Gift Delivery Display Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Gift Delivery Display Customization</CardTitle>
          <CardDescription>
            Manage the display content for delivery options shown to clients during the order flow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Digital Gift Delivery */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="text-lg font-medium">📧 Digital Gift Delivery</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="digital-how-it-works">How E-Gifting Works</Label>
                <Textarea
                  id="digital-how-it-works"
                  value={deliveryDisplaySettings.digitalGift.howItWorks}
                  onChange={(e) => updateDeliveryContent('digital', e.target.value)}
                  placeholder="Explain how the digital gifting process works..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Features Include (Max 3)</Label>
                  {deliveryDisplaySettings.digitalGift.features.length < 3 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFeatureType('digital');
                        setIsAddFeatureOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {deliveryDisplaySettings.digitalGift.features.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      {editingFeature?.type === 'digital' && editingFeature.id === feature.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm">•</span>
                          <Input
                            value={editFeatureText}
                            onChange={(e) => setEditFeatureText(e.target.value)}
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveFeature();
                              if (e.key === 'Escape') handleCancelEditFeature();
                            }}
                            autoFocus
                          />
                          <Button size="sm" onClick={handleSaveFeature}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancelEditFeature}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm">• {feature.text}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditFeature('digital', feature.id, feature.text)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFeature('digital', feature.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Direct Physical Delivery */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="text-lg font-medium">🚚 Direct Physical Delivery</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="physical-how-it-works">How Physical Shipping Works</Label>
                <Textarea
                  id="physical-how-it-works"
                  value={deliveryDisplaySettings.physicalDelivery.howItWorks}
                  onChange={(e) => updateDeliveryContent('physical', e.target.value)}
                  placeholder="Describe the process of managing and shipping physical gifts..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Features Include (Max 3)</Label>
                  {deliveryDisplaySettings.physicalDelivery.features.length < 3 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFeatureType('physical');
                        setIsAddFeatureOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {deliveryDisplaySettings.physicalDelivery.features.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      {editingFeature?.type === 'physical' && editingFeature.id === feature.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm">•</span>
                          <Input
                            value={editFeatureText}
                            onChange={(e) => setEditFeatureText(e.target.value)}
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveFeature();
                              if (e.key === 'Escape') handleCancelEditFeature();
                            }}
                            autoFocus
                          />
                          <Button size="sm" onClick={handleSaveFeature}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancelEditFeature}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm">• {feature.text}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditFeature('physical', feature.id, feature.text)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFeature('physical', feature.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
            
            <div className="space-y-2">
              <Label htmlFor="graphic-image">Graphic Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="graphic-image-upload"
                />
                <label htmlFor="graphic-image-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {newGraphicImage 
                      ? newGraphicImage.name 
                      : 'Click to upload image'
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: .jpg, .png, .webp (Max 5MB)
                  </p>
                  <p className="text-xs text-gray-500">
                    Recommended: 16:9 aspect ratio, minimum 800x450px
                  </p>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddGraphicOpen(false);
              setNewGraphicTitle('');
              setNewGraphicImage(null);
            }}>
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
            
            <div className="space-y-2">
              <Label htmlFor="edit-graphic-image">Graphic Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="edit-graphic-image-upload"
                />
                <label htmlFor="edit-graphic-image-upload" className="cursor-pointer">
                  {newGraphicImage || editingGraphic?.thumbnail ? (
                    <div className="mb-2">
                      <img 
                        src={newGraphicImage ? URL.createObjectURL(newGraphicImage) : editingGraphic?.thumbnail} 
                        alt="Preview"
                        className="mx-auto w-20 h-20 object-cover rounded"
                      />
                    </div>
                  ) : (
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  )}
                  <p className="text-sm text-gray-600">
                    {newGraphicImage 
                      ? newGraphicImage.name 
                      : 'Click to upload new image'
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: .jpg, .png, .webp (Max 5MB)
                  </p>
                  <p className="text-xs text-gray-500">
                    Recommended: 16:9 aspect ratio, minimum 800x450px
                  </p>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditGraphicOpen(false);
              setEditingGraphic(null);
              setNewGraphicTitle('');
              setNewGraphicImage(null);
            }}>
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

      {/* Add Feature Modal */}
      <Dialog open={isAddFeatureOpen} onOpenChange={setIsAddFeatureOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Feature</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feature-text">Feature Text</Label>
              <Input
                id="feature-text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                placeholder="Enter feature description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFeatureOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFeature}>Add Feature</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomizationSettings;
