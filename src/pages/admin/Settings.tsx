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
import { Plus, Edit, Trash2, Upload, X, Truck, Package } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

interface Carrier {
  id: string;
  name: string;
  trackingUrl: string;
  deliveryType: string;
  boxSize: string;
  isActive: boolean;
}

interface DeliveryType {
  id: string;
  name: string;
  duration: string;
  pricing: { [key: string]: number }; // Box size to price mapping
  isActive: boolean;
}

interface BoxSize {
  id: string;
  name: string;
  dimensions: string;
  weight: string;
}

interface PortalTheme {
  id: string;
  name: string;
  colorPreview: string;
  themeType: 'primary' | 'secondary';
  isActive: boolean;
}

const deliveryTypeOptions = [
  { value: 'express', label: 'Express Delivery (1-2 business days)' },
  { value: 'normal', label: 'Normal Delivery (2-3 business days)' },
  { value: 'slow', label: 'Slow Delivery (3-5 business days)' }
];

const boxSizeOptions = [
  { value: 'small', label: 'Small', dimensions: '8x6x4 in' },
  { value: 'medium', label: 'Medium', dimensions: '12x10x5 in' },
  { value: 'large', label: 'Large', dimensions: '16x14x8 in' }
];

const mockCarriers: Carrier[] = [
  { id: '1', name: 'FedEx', trackingUrl: 'https://www.fedex.com/tracking', deliveryType: 'express', boxSize: 'medium', isActive: true },
  { id: '2', name: 'UPS', trackingUrl: 'https://www.ups.com/tracking', deliveryType: 'normal', boxSize: 'large', isActive: true },
  { id: '3', name: 'USPS', trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction', deliveryType: 'slow', boxSize: 'small', isActive: true },
  { id: '4', name: 'DHL', trackingUrl: 'https://www.dhl.com/tracking', deliveryType: 'express', boxSize: 'medium', isActive: false },
];

const mockDeliveryTypes: DeliveryType[] = [
  { 
    id: 'express', 
    name: 'Express Delivery', 
    duration: '1-2 business days', 
    pricing: { small: 12.00, medium: 15.00, large: 18.00 },
    isActive: true 
  },
  { 
    id: 'normal', 
    name: 'Normal Delivery', 
    duration: '2-3 business days', 
    pricing: { small: 8.00, medium: 11.00, large: 14.00 },
    isActive: true 
  },
  { 
    id: 'slow', 
    name: 'Slow Delivery', 
    duration: '3-5 business days', 
    pricing: { small: 5.00, medium: 8.00, large: 11.00 },
    isActive: true 
  }
];

const mockBoxSizes: BoxSize[] = [
  { id: '1', name: 'Small Box', dimensions: '8x6x4 in', weight: '1 lb' },
  { id: '2', name: 'Medium Box', dimensions: '12x10x5 in', weight: '2 lbs' },
  { id: '3', name: 'Large Box', dimensions: '16x14x8 in', weight: '3 lbs' },
];

const mockPortalThemes: PortalTheme[] = [
  { id: '1', name: 'Professional Blue', colorPreview: '#4285F4', themeType: 'primary', isActive: true },
  { id: '2', name: 'Natural Green', colorPreview: '#34A853', themeType: 'primary', isActive: true },
  { id: '3', name: 'Creative Purple', colorPreview: '#9C27B0', themeType: 'secondary', isActive: true },
  { id: '4', name: 'Energetic Orange', colorPreview: '#FF9800', themeType: 'secondary', isActive: true },
  { id: '5', name: 'Modern Dark', colorPreview: '#212121', themeType: 'primary', isActive: true },
  { id: '6', name: 'Clean Light', colorPreview: '#F5F5F5', themeType: 'secondary', isActive: true },
];

const AdminSettings = () => {
  const [carriers, setCarriers] = useState<Carrier[]>(mockCarriers);
  const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>(mockDeliveryTypes);
  const [boxSizes, setBoxSizes] = useState<BoxSize[]>(mockBoxSizes);
  const [portalThemes, setPortalThemes] = useState<PortalTheme[]>(mockPortalThemes);
  
  // Add Carrier Modal State
  const [isAddCarrierOpen, setIsAddCarrierOpen] = useState(false);
  const [newCarrier, setNewCarrier] = useState({ name: '', trackingUrl: '', deliveryType: '', boxSize: '', isActive: true });
  
  // Edit Carrier Modal State
  const [isEditCarrierOpen, setIsEditCarrierOpen] = useState(false);
  const [editingCarrier, setEditingCarrier] = useState<Carrier | null>(null);
  
  // Edit Box Size Modal State
  const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<BoxSize | null>(null);

  // Theme Modal States
  const [isAddThemeOpen, setIsAddThemeOpen] = useState(false);
  const [isEditThemeOpen, setIsEditThemeOpen] = useState(false);
  const [newTheme, setNewTheme] = useState({ name: '', colorPreview: '#4285F4', themeType: 'primary' as 'primary' | 'secondary', isActive: true });
  const [editingTheme, setEditingTheme] = useState<PortalTheme | null>(null);

  // Delivery Type Pricing Modal
  const [isEditDeliveryPricingOpen, setIsEditDeliveryPricingOpen] = useState(false);
  const [editingDeliveryType, setEditingDeliveryType] = useState<DeliveryType | null>(null);

  // Carrier Functions
  const handleAddCarrier = () => {
    if (!newCarrier.name || !newCarrier.trackingUrl || !newCarrier.deliveryType || !newCarrier.boxSize) {
      toast.error("Please fill in all required fields");
      return;
    }

    const carrier: Carrier = {
      id: (carriers.length + 1).toString(),
      ...newCarrier
    };

    setCarriers([...carriers, carrier]);
    setNewCarrier({ name: '', trackingUrl: '', deliveryType: '', boxSize: '', isActive: true });
    setIsAddCarrierOpen(false);
    toast.success("Carrier added successfully");
  };

  const handleEditCarrier = (carrier: Carrier) => {
    setEditingCarrier(carrier);
    setIsEditCarrierOpen(true);
  };

  const handleUpdateCarrier = () => {
    if (!editingCarrier || !editingCarrier.name || !editingCarrier.trackingUrl || !editingCarrier.deliveryType || !editingCarrier.boxSize) {
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
    const deliveryType = deliveryTypeOptions.find(dt => dt.value === type);
    return deliveryType ? deliveryType.label : type;
  };

  const getBoxSizeLabel = (size: string) => {
    const boxSize = boxSizeOptions.find(bs => bs.value === size);
    return boxSize ? `${boxSize.label} (${boxSize.dimensions})` : size;
  };

  // Delivery Type Functions
  const handleEditDeliveryPricing = (deliveryType: DeliveryType) => {
    setEditingDeliveryType(deliveryType);
    setIsEditDeliveryPricingOpen(true);
  };

  const handleUpdateDeliveryPricing = () => {
    if (!editingDeliveryType) return;

    setDeliveryTypes(deliveryTypes.map(dt => 
      dt.id === editingDeliveryType.id ? editingDeliveryType : dt
    ));
    setIsEditDeliveryPricingOpen(false);
    setEditingDeliveryType(null);
    toast.success("Delivery type pricing updated successfully");
  };

  const toggleDeliveryTypeStatus = (id: string) => {
    setDeliveryTypes(deliveryTypes.map(dt => 
      dt.id === id ? { ...dt, isActive: !dt.isActive } : dt
    ));
    toast.success("Delivery type status updated");
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
    setNewTheme({ name: '', colorPreview: '#4285F4', themeType: 'primary', isActive: true });
    setIsAddThemeOpen(false);
    toast.success("Theme added successfully");
  };

  const handleEditTheme = (theme: PortalTheme) => {
    setEditingTheme(theme);
    setNewTheme({
      name: theme.name,
      colorPreview: theme.colorPreview,
      themeType: theme.themeType,
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
    setNewTheme({ name: '', colorPreview: '#4285F4', themeType: 'primary', isActive: true });
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
                      Manage available shipping carriers with delivery types and box sizes
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
                              {deliveryTypeOptions.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="box-size">Box Size</Label>
                          <Select value={newCarrier.boxSize} onValueChange={(value) => setNewCarrier({ ...newCarrier, boxSize: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select box size" />
                            </SelectTrigger>
                            <SelectContent>
                              {boxSizeOptions.map((size) => (
                                <SelectItem key={size.value} value={size.value}>
                                  {size.label} ({size.dimensions})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Truck className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-medium text-lg">{carrier.name}</p>
                            <Badge variant={carrier.isActive ? "default" : "secondary"}>
                              {carrier.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{getDeliveryTypeLabel(carrier.deliveryType)}</p>
                          <p className="text-sm text-gray-600 mb-1">Box Size: {getBoxSizeLabel(carrier.boxSize)}</p>
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
                          {deliveryTypeOptions.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-box-size">Box Size</Label>
                      <Select value={editingCarrier.boxSize} onValueChange={(value) => setEditingCarrier({ ...editingCarrier, boxSize: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {boxSizeOptions.map((size) => (
                            <SelectItem key={size.value} value={size.value}>
                              {size.label} ({size.dimensions})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

            {/* Delivery Types Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Delivery Types
                </CardTitle>
                <CardDescription>
                  Manage delivery type pricing by box size and availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveryTypes.map((deliveryType) => (
                    <div key={deliveryType.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{deliveryType.name}</h3>
                            <Badge variant={deliveryType.isActive ? "default" : "secondary"}>
                              {deliveryType.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">({deliveryType.duration})</p>
                          <div className="space-y-1">
                            {Object.entries(deliveryType.pricing).map(([size, price]) => (
                              <div key={size} className="text-sm text-gray-600">
                                • {getBoxSizeLabel(size)}: ${price.toFixed(2)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditDeliveryPricing(deliveryType)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Pricing
                        </Button>
                        <Switch
                          checked={deliveryType.isActive}
                          onCheckedChange={() => toggleDeliveryTypeStatus(deliveryType.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Edit Delivery Type Pricing Modal */}
            <Dialog open={isEditDeliveryPricingOpen} onOpenChange={setIsEditDeliveryPricingOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Delivery Type Pricing</DialogTitle>
                </DialogHeader>
                {editingDeliveryType && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="font-medium">{editingDeliveryType.name}</h3>
                      <p className="text-sm text-gray-600">{editingDeliveryType.duration}</p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Box Size Pricing</h4>
                      {boxSizeOptions.map((boxSize) => (
                        <div key={boxSize.value} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{boxSize.label}</p>
                            <p className="text-sm text-gray-500">{boxSize.dimensions}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">$</span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={editingDeliveryType.pricing[boxSize.value] || 0}
                              onChange={(e) => setEditingDeliveryType({
                                ...editingDeliveryType,
                                pricing: {
                                  ...editingDeliveryType.pricing,
                                  [boxSize.value]: parseFloat(e.target.value) || 0
                                }
                              })}
                              className="w-20 h-8"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDeliveryPricingOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateDeliveryPricing}>Update Pricing</Button>
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
                          {box.dimensions} • {box.weight}
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
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{theme.name}</p>
                          <Badge variant={theme.themeType === 'primary' ? 'default' : 'secondary'}>
                            {theme.themeType === 'primary' ? 'Primary' : 'Secondary'}
                          </Badge>
                        </div>
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
                <div className="space-y-3">
                  <Label>Theme Type</Label>
                  <RadioGroup 
                    value={newTheme.themeType} 
                    onValueChange={(value: 'primary' | 'secondary') => setNewTheme({ ...newTheme, themeType: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="primary" id="primary" />
                      <Label htmlFor="primary">Primary</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="secondary" id="secondary" />
                      <Label htmlFor="secondary">Secondary</Label>
                    </div>
                  </RadioGroup>
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
                <div className="space-y-3">
                  <Label>Theme Type</Label>
                  <RadioGroup 
                    value={newTheme.themeType} 
                    onValueChange={(value: 'primary' | 'secondary') => setNewTheme({ ...newTheme, themeType: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="primary" id="edit-primary" />
                      <Label htmlFor="edit-primary">Primary</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="secondary" id="edit-secondary" />
                      <Label htmlFor="edit-secondary">Secondary</Label>
                    </div>
                  </RadioGroup>
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
