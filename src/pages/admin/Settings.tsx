
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
import { Plus, Edit, Trash2, Upload } from "lucide-react";

interface Carrier {
  id: string;
  name: string;
  trackingUrl: string;
  isActive: boolean;
}

interface BoxSize {
  id: string;
  name: string;
  dimensions: string;
  weight: string;
  cost: number;
}

interface AddOnItem {
  id: string;
  name: string;
  type: string;
  price: number;
  image?: string;
}

const mockCarriers: Carrier[] = [
  { id: '1', name: 'FedEx', trackingUrl: 'https://www.fedex.com/tracking', isActive: true },
  { id: '2', name: 'UPS', trackingUrl: 'https://www.ups.com/tracking', isActive: true },
  { id: '3', name: 'USPS', trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction', isActive: true },
  { id: '4', name: 'DHL', trackingUrl: 'https://www.dhl.com/tracking', isActive: false },
];

const mockBoxSizes: BoxSize[] = [
  { id: '1', name: 'Small Box', dimensions: '6" x 4" x 2"', weight: '1 lb', cost: 2.50 },
  { id: '2', name: 'Medium Box', dimensions: '8" x 6" x 4"', weight: '2 lbs', cost: 3.75 },
  { id: '3', name: 'Large Box', dimensions: '12" x 8" x 6"', weight: '3 lbs', cost: 5.00 },
];

const mockAddOns: AddOnItem[] = [
  { id: '1', name: 'Gift Wrapping', type: 'Service', price: 5.00 },
  { id: '2', name: 'Personalized Card', type: 'Item', price: 3.50 },
  { id: '3', name: 'Premium Ribbon', type: 'Accessory', price: 2.00 },
];

const addOnTypes = ['Service', 'Item', 'Accessory', 'Enhancement'];

const Settings = () => {
  const [carriers, setCarriers] = useState<Carrier[]>(mockCarriers);
  const [boxSizes, setBoxSizes] = useState<BoxSize[]>(mockBoxSizes);
  const [addOns, setAddOns] = useState<AddOnItem[]>(mockAddOns);
  
  // Add Carrier Modal State
  const [isAddCarrierOpen, setIsAddCarrierOpen] = useState(false);
  const [newCarrier, setNewCarrier] = useState({ name: '', trackingUrl: '', isActive: true });
  
  // Edit Box Size Modal State
  const [isEditBoxOpen, setIsEditBoxOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<BoxSize | null>(null);
  
  // Add Add-On Modal State
  const [isAddAddOnOpen, setIsAddAddOnOpen] = useState(false);
  const [newAddOn, setNewAddOn] = useState({ name: '', type: '', price: '', image: '' });

  // Carrier Functions
  const handleAddCarrier = () => {
    if (!newCarrier.name || !newCarrier.trackingUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    const carrier: Carrier = {
      id: (carriers.length + 1).toString(),
      ...newCarrier
    };

    setCarriers([...carriers, carrier]);
    setNewCarrier({ name: '', trackingUrl: '', isActive: true });
    setIsAddCarrierOpen(false);
    toast.success("Carrier added successfully");
  };

  const toggleCarrierStatus = (id: string) => {
    setCarriers(carriers.map(carrier => 
      carrier.id === id ? { ...carrier, isActive: !carrier.isActive } : carrier
    ));
    toast.success("Carrier status updated");
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

  // Add-On Functions
  const handleAddAddOn = () => {
    if (!newAddOn.name || !newAddOn.type || !newAddOn.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const addOn: AddOnItem = {
      id: (addOns.length + 1).toString(),
      name: newAddOn.name,
      type: newAddOn.type,
      price: parseFloat(newAddOn.price),
      image: newAddOn.image || undefined
    };

    setAddOns([...addOns, addOn]);
    setNewAddOn({ name: '', type: '', price: '', image: '' });
    setIsAddAddOnOpen(false);
    toast.success("Add-on item added successfully");
  };

  const handleDeleteAddOn = (id: string) => {
    setAddOns(addOns.filter(addOn => addOn.id !== id));
    toast.success("Add-on item deleted successfully");
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
          <TabsTrigger value="addons">Add-Ons</TabsTrigger>
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
                      Manage available shipping carriers
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
                    <div key={carrier.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{carrier.name}</p>
                          <p className="text-sm text-gray-500">{carrier.trackingUrl}</p>
                        </div>
                        <Badge variant={carrier.isActive ? "default" : "secondary"}>
                          {carrier.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={carrier.isActive}
                          onCheckedChange={() => toggleCarrierStatus(carrier.id)}
                        />
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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

        <TabsContent value="addons">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Add-On Items</CardTitle>
                  <CardDescription>
                    Manage additional items and services
                  </CardDescription>
                </div>
                <Dialog open={isAddAddOnOpen} onOpenChange={setIsAddAddOnOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add New Add-On
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Add-On Item</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="addon-name">Item Name</Label>
                        <Input
                          id="addon-name"
                          placeholder="Enter item name"
                          value={newAddOn.name}
                          onChange={(e) => setNewAddOn({ ...newAddOn, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addon-type">Type</Label>
                        <select
                          id="addon-type"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={newAddOn.type}
                          onChange={(e) => setNewAddOn({ ...newAddOn, type: e.target.value })}
                        >
                          <option value="">Select type</option>
                          {addOnTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addon-price">Price ($)</Label>
                        <Input
                          id="addon-price"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={newAddOn.price}
                          onChange={(e) => setNewAddOn({ ...newAddOn, price: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addon-image">Image (Optional)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="addon-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setNewAddOn({ ...newAddOn, image: file.name });
                              }
                            }}
                          />
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddAddOnOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddAddOn}>Add Add-On</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {addOns.map((addOn) => (
                  <div key={addOn.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{addOn.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{addOn.type}</Badge>
                          <span className="text-sm text-gray-500">${addOn.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAddOn(addOn.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
