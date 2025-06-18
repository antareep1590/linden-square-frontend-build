
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Carrier {
  id: string;
  name: string;
  trackingUrl: string;
  deliveryType: string;
  price: number;
  isActive: boolean;
}

interface BoxSize {
  id: string;
  name: string;
  dimensions: string;
  weight: string;
  cost: number;
}

interface PortalTheme {
  id: string;
  name: string;
  colorPreview: string;
  isActive: boolean;
}

const deliveryTypes = [
  { value: 'express', label: 'Express (2-3 business days)' },
  { value: 'standard', label: 'Standard (3-5 business days)' },
  { value: 'overnight', label: 'Overnight (1 business day)' },
  { value: 'ground', label: 'Ground (5-7 business days)' },
];

const mockCarriers: Carrier[] = [
  { id: '1', name: 'FedEx', trackingUrl: 'https://www.fedex.com/tracking', deliveryType: 'express', price: 10, isActive: true },
  { id: '2', name: 'UPS', trackingUrl: 'https://www.ups.com/tracking', deliveryType: 'standard', price: 5, isActive: true },
  { id: '3', name: 'USPS', trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction', deliveryType: 'ground', price: 3, isActive: true },
  { id: '4', name: 'DHL', trackingUrl: 'https://www.dhl.com/tracking', deliveryType: 'express', price: 12, isActive: false },
];

const mockBoxSizes: BoxSize[] = [
  { id: '1', name: 'Small Box', dimensions: '6" x 4" x 2"', weight: '1 lb', cost: 2.50 },
  { id: '2', name: 'Medium Box', dimensions: '8" x 6" x 4"', weight: '2 lbs', cost: 3.75 },
  { id: '3', name: 'Large Box', dimensions: '12" x 8" x 6"', weight: '3 lbs', cost: 5.00 },
];

const mockPortalThemes: PortalTheme[] = [
  { id: '1', name: 'Professional Blue', colorPreview: '#4285F4', isActive: true },
  { id: '2', name: 'Natural Green', colorPreview: '#34A853', isActive: true },
  { id: '3', name: 'Creative Purple', colorPreview: '#9C27B0', isActive: true },
  { id: '4', name: 'Energetic Orange', colorPreview: '#FF9800', isActive: true },
  { id: '5', name: 'Modern Dark', colorPreview: '#212121', isActive: true },
  { id: '6', name: 'Clean Light', colorPreview: '#F5F5F5', isActive: true },
];

const AdminSettings = () => {
  const [carriers, setCarriers] = useState<Carrier[]>(mockCarriers);
  const [boxSizes, setBoxSizes] = useState<BoxSize[]>(mockBoxSizes);
  const [portalThemes, setPortalThemes] = useState<PortalTheme[]>(mockPortalThemes);
  
  // Add Carrier Modal State
  const [isAddCarrierOpen, setIsAddCarrierOpen] = useState(false);
  const [newCarrier, setNewCarrier] = useState({ name: '', trackingUrl: '', deliveryType: '', price: 0, isActive: true });
  
  // Edit Carrier Modal State
  const [isEditCarrierOpen, setIsEditCarrierOpen] = useState(false);
  const [editingCarrier, setEditingCarrier] = useState<Carrier | null>(null);
  
  // Edit Box Size Modal State
  const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<BoxSize | null>(null);

  // Theme Modal States
  const [isAddThemeOpen, setIsAddThemeOpen] = useState(false);
  const [isEditThemeOpen, setIsEditThemeOpen] = useState(false);
  const [newTheme, setNewTheme] = useState({ name: '', colorPreview: '#4285F4', isActive: true });
  const [editingTheme, setEditingTheme] = useState<PortalTheme | null>(null);

  // Carrier Functions
  const handleAddCarrier = () => {
    if (!newCarrier.name || !newCarrier.trackingUrl || !newCarrier.deliveryType || newCarrier.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const carrier: Carrier = {
      id: (carriers.length + 1).toString(),
      ...newCarrier
    };

    setCarriers([...carriers, carrier]);
    setNewCarrier({ name: '', trackingUrl: '', deliveryType: '', price: 0, isActive: true });
    setIsAddCarrierOpen(false);
    toast.success("Carrier added successfully");
  };

  const handleEditCarrier = (carrier: Carrier) => {
    setEditingCarrier(carrier);
    setIsEditCarrierOpen(true);
  };

  const handleUpdateCarrier = () => {
    if (!editingCarrier || !editingCarrier.name || !editingCarrier.trackingUrl || !editingCarrier.deliveryType || editingCarrier.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCarriers(carriers.map(carrier => 
      carrier.id === editingCarrier.id ? editingCarrier : carrier
    ));
    setIsEditCarrierOpen(false);
    setEditingCarrier(null);
    toast.success("Carrier updated successfully");
  };

  const toggleCarrierStatus = (id: string) => {
    setCarriers(carriers.map(carrier => 
      carrier.id === id ? { ...carrier, isActive: !carrier.isActive } : carrier
    ));
    toast.success("Carrier status updated");
  };

  const getDeliveryTypeLabel = (type: string) => {
    const deliveryType = deliveryTypes.find(dt => dt.value === type);
    return deliveryType ? deliveryType.label : type;
  };

  // Box Size Functions
  const handleEditBox = (box: BoxSize) => {
    setEditingBox(box);
    setIsEditBoxOpen(true);
  };

  const handleUpdateBox = () => {
    if (!editingBox) return;

    setBoxSizes(boxSizes.map(box => 
      box.id === editingBox.id ? editingBox : box
    ));
    setIsEditBoxOpen(false);
    setEditingBox(null);
    toast.success("Box size updated successfully");
  };

  // Theme Functions
  const handleAddTheme = () => {
    if (!newTheme.name) {
      toast.error("Please enter a theme name");
      return;
    }

    const theme: PortalTheme = {
      id: (portalThemes.length + 1).toString(),
      ...newTheme
    };

    setPortalThemes([...portalThemes, theme]);
    setNewTheme({ name: '', colorPreview: '#4285F4', isActive: true });
    setIsAddThemeOpen(false);
    toast.success("Theme added successfully");
  };

  const handleEditTheme = (theme: PortalTheme) => {
    setEditingTheme(theme);
    setNewTheme({
      name: theme.name,
      colorPreview: theme.colorPreview,
      isActive: theme.isActive
    });
    setIsEditThemeOpen(true);
  };

  const handleUpdateTheme = () => {
    if (!editingTheme || !newTheme.name) {
      toast.error("Please enter a theme name");
      return;
    }

    setPortalThemes(portalThemes.map(theme => 
      theme.id === editingTheme.id 
        ? { ...theme, ...newTheme }
        : theme
    ));
    setEditingTheme(null);
    setNewTheme({ name: '', colorPreview: '#4285F4', isActive: true });
    setIsEditThemeOpen(false);
    toast.success("Theme updated successfully");
  };

  const handleDeleteTheme = (id: string) => {
    setPortalThemes(portalThemes.filter(theme => theme.id !== id));
    toast.success("Theme deleted successfully");
  };

  const toggleThemeStatus = (id: string) => {
    setPortalThemes(portalThemes.map(theme => 
      theme.id === id ? { ...theme, isActive: !theme.isActive } : theme
    ));
    toast.success("Theme status updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="themes">Theme Setting</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your application's general configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="Linden Square" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">Company Email</Label>
                <Input id="company-email" type="email" defaultValue="admin@lindensquare.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>UTC-5 (Eastern Time)</option>
                  <option>UTC-6 (Central Time)</option>
                  <option>UTC-7 (Mountain Time)</option>
                  <option>UTC-8 (Pacific Time)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <div className="space-y-6">
            {/* Carriers Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Shipping Carriers</CardTitle>
                    <CardDescription>
                      Manage available shipping carriers with delivery types and pricing
                    </CardDescription>
                  </div>
                  <Dialog open={isAddCarrierOpen} onOpenChange={setIsAddCarrierOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Carrier
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Carrier</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="carrier-name">Carrier Name</Label>
                          <Input
                            id="carrier-name"
                            placeholder="Enter carrier name"
                            value={newCarrier.name}
                            onChange={(e) => setNewCarrier({ ...newCarrier, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tracking-url">Tracking URL</Label>
                          <Input
                            id="tracking-url"
                            placeholder="https://..."
                            value={newCarrier.trackingUrl}
                            onChange={(e) => setNewCarrier({ ...newCarrier, trackingUrl: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="delivery-type">Type of Delivery</Label>
                          <Select value={newCarrier.deliveryType} onValueChange={(value) => setNewCarrier({ ...newCarrier, deliveryType: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select delivery type" />
                            </SelectTrigger>
                            <SelectContent>
                              {deliveryTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="carrier-price">Price ($)</Label>
                          <Input
                            id="carrier-price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={newCarrier.price}
                            onChange={(e) => setNewCarrier({ ...newCarrier, price: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="carrier-active"
                            checked={newCarrier.isActive}
                            onCheckedChange={(checked) => setNewCarrier({ ...newCarrier, isActive: checked })}
                          />
                          <Label htmlFor="carrier-active">Active</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddCarrierOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddCarrier}>Add Carrier</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {carriers.map((carrier) => (
                    <div key={carrier.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-medium text-lg">{carrier.name}</p>
                            <Badge variant={carrier.isActive ? "default" : "secondary"}>
                              {carrier.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{getDeliveryTypeLabel(carrier.deliveryType)}</p>
                          <p className="text-sm font-semibold text-green-600">Price: ${carrier.price}</p>
                          <p className="text-xs text-gray-500">{carrier.trackingUrl}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={carrier.isActive}
                          onCheckedChange={() => toggleCarrierStatus(carrier.id)}
                        />
                        <Button variant="ghost" size="sm" onClick={() => handleEditCarrier(carrier)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Edit Carrier Modal */}
            <Dialog open={isEditCarrierOpen} onOpenChange={setIsEditCarrierOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Carrier</DialogTitle>
                </DialogHeader>
                {editingCarrier && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-carrier-name">Carrier Name</Label>
                      <Input
                        id="edit-carrier-name"
                        value={editingCarrier.name}
                        onChange={(e) => setEditingCarrier({ ...editingCarrier, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-tracking-url">Tracking URL</Label>
                      <Input
                        id="edit-tracking-url"
                        value={editingCarrier.trackingUrl}
                        onChange={(e) => setEditingCarrier({ ...editingCarrier, trackingUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-delivery-type">Type of Delivery</Label>
                      <Select value={editingCarrier.deliveryType} onValueChange={(value) => setEditingCarrier({ ...editingCarrier, deliveryType: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveryTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-carrier-price">Price ($)</Label>
                      <Input
                        id="edit-carrier-price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingCarrier.price}
                        onChange={(e) => setEditingCarrier({ ...editingCarrier, price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-carrier-active"
                        checked={editingCarrier.isActive}
                        onCheckedChange={(checked) => setEditingCarrier({ ...editingCarrier, isActive: checked })}
                      />
                      <Label htmlFor="edit-carrier-active">Active</Label>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditCarrierOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateCarrier}>Update Carrier</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Box Sizes Section */}
            <Card>
              <CardHeader>
                <CardTitle>Box Sizes</CardTitle>
                <CardDescription>
                  Manage available shipping box sizes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {boxSizes.map((box) => (
                    <div key={box.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{box.name}</p>
                        <p className="text-sm text-gray-500">
                          {box.dimensions} • {box.weight} • ${box.cost}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleEditBox(box)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Edit Box Size Modal */}
            <Dialog open={isEditBoxOpen} onOpenChange={setIsEditBoxOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Box Size</DialogTitle>
                </DialogHeader>
                {editingBox && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="box-name">Box Name</Label>
                      <Input
                        id="box-name"
                        value={editingBox.name}
                        onChange={(e) => setEditingBox({ ...editingBox, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="box-dimensions">Dimensions</Label>
                      <Input
                        id="box-dimensions"
                        placeholder='e.g., 8" x 6" x 4"'
                        value={editingBox.dimensions}
                        onChange={(e) => setEditingBox({ ...editingBox, dimensions: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="box-weight">Weight</Label>
                      <Input
                        id="box-weight"
                        placeholder="e.g., 2 lbs"
                        value={editingBox.weight}
                        onChange={(e) => setEditingBox({ ...editingBox, weight: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="box-cost">Cost ($)</Label>
                      <Input
                        id="box-cost"
                        type="number"
                        step="0.01"
                        value={editingBox.cost}
                        onChange={(e) => setEditingBox({ ...editingBox, cost: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditBoxOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateBox}>Update Box Size</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive email updates about orders and inventory
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-gray-500">
                    Get notified when inventory is running low
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Order Updates</Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications about order status changes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="themes">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Portal Theme Settings</CardTitle>
                  <CardDescription>
                    Manage portal themes available to clients
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddThemeOpen(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Theme
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portalThemes.map((theme) => (
                  <div key={theme.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                        style={{ backgroundColor: theme.colorPreview }}
                      />
                      <div>
                        <p className="font-medium">{theme.name}</p>
                        <p className="text-sm text-gray-500">Color: {theme.colorPreview}</p>
                      </div>
                      <Badge variant={theme.isActive ? "default" : "secondary"}>
                        {theme.isActive ? "Available" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={theme.isActive}
                        onCheckedChange={() => toggleThemeStatus(theme.id)}
                      />
                      <Button variant="ghost" size="sm" onClick={() => handleEditTheme(theme)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTheme(theme.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Theme Settings</Button>
            </CardFooter>
          </Card>

          {/* Add Theme Modal */}
          <Dialog open={isAddThemeOpen} onOpenChange={setIsAddThemeOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Theme</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme-name">Theme Name</Label>
                  <Input
                    id="theme-name"
                    placeholder="Enter theme name"
                    value={newTheme.name}
                    onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme-color">Color Preview</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="theme-color"
                      type="color"
                      value={newTheme.colorPreview}
                      onChange={(e) => setNewTheme({ ...newTheme, colorPreview: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      placeholder="#4285F4"
                      value={newTheme.colorPreview}
                      onChange={(e) => setNewTheme({ ...newTheme, colorPreview: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="theme-active"
                    checked={newTheme.isActive}
                    onCheckedChange={(checked) => setNewTheme({ ...newTheme, isActive: checked })}
                  />
                  <Label htmlFor="theme-active">Available to Clients</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddThemeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTheme}>Add Theme</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Theme Modal */}
          <Dialog open={isEditThemeOpen} onOpenChange={setIsEditThemeOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Theme</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-theme-name">Theme Name</Label>
                  <Input
                    id="edit-theme-name"
                    placeholder="Enter theme name"
                    value={newTheme.name}
                    onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-theme-color">Color Preview</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="edit-theme-color"
                      type="color"
                      value={newTheme.colorPreview}
                      onChange={(e) => setNewTheme({ ...newTheme, colorPreview: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      placeholder="#4285F4"
                      value={newTheme.colorPreview}
                      onChange={(e) => setNewTheme({ ...newTheme, colorPreview: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-theme-active"
                    checked={newTheme.isActive}
                    onCheckedChange={(checked) => setNewTheme({ ...newTheme, isActive: checked })}
                  />
                  <Label htmlFor="edit-theme-active">Available to Clients</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditThemeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateTheme}>Update Theme</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
