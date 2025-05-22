
import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { BellRing, Mail, Palette, Box, Truck, Gift, Settings as SettingsIcon } from "lucide-react";

const AdminSettings = () => {
  // Branding Settings
  const [logoUrl, setLogoUrl] = useState("https://example.com/linden-square-logo.png");
  const [primaryColor, setPrimaryColor] = useState("#4B89DC");
  const [secondaryColor, setSecondaryColor] = useState("#E1E7F2");
  const [emailFooter, setEmailFooter] = useState("© 2025 Linden Square. All rights reserved.");

  // Personalization Settings
  const [maxCharacterLimit, setMaxCharacterLimit] = useState(250);
  const [allowHTMLTags, setAllowHTMLTags] = useState(false);
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(true);
  const [previewEnabled, setPreviewEnabled] = useState(true);

  // Shipping Settings
  const [defaultCarriers, setDefaultCarriers] = useState<string[]>(["UPS", "FedEx", "USPS"]);
  const [selectedCarrier, setSelectedCarrier] = useState("UPS");
  const [internationalShippingEnabled, setInternationalShippingEnabled] = useState(true);
  const [boxSizes, setBoxSizes] = useState([
    { id: 1, name: "Small", dimensions: "8\" x 6\" x 4\"", price: 5.99 },
    { id: 2, name: "Medium", dimensions: "12\" x 10\" x 6\"", price: 8.99 },
    { id: 3, name: "Large", dimensions: "16\" x 12\" x 8\"", price: 12.99 }
  ]);
  
  // Add-on Settings
  const [addOns, setAddOns] = useState([
    { id: 1, name: "Thank You Card", price: 2.99, enabled: true },
    { id: 2, name: "Gift Wrap", price: 4.99, enabled: true },
    { id: 3, name: "Company Brochure", price: 1.99, enabled: true },
    { id: 4, name: "Custom Sticker", price: 0.99, enabled: false }
  ]);

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [lowInventoryThreshold, setLowInventoryThreshold] = useState(25);

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };

  const handleAddCarrier = () => {
    toast.info("Add new carrier functionality to be implemented");
  };

  const handleEditBoxSize = (id: number) => {
    toast.info(`Edit box size ${id} functionality to be implemented`);
  };

  const handleToggleAddOn = (id: number) => {
    setAddOns(addOns.map(addon => 
      addon.id === id ? { ...addon, enabled: !addon.enabled } : addon
    ));
    
    const addon = addOns.find(a => a.id === id);
    toast.success(`${addon?.name} has been ${addon?.enabled ? 'disabled' : 'enabled'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Settings</h1>
      </div>

      <Tabs defaultValue="branding">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="branding">
            <Palette className="h-4 w-4 mr-2" /> Branding
          </TabsTrigger>
          <TabsTrigger value="personalization">
            <Gift className="h-4 w-4 mr-2" /> Personalization
          </TabsTrigger>
          <TabsTrigger value="shipping">
            <Truck className="h-4 w-4 mr-2" /> Shipping
          </TabsTrigger>
          <TabsTrigger value="addons">
            <Box className="h-4 w-4 mr-2" /> Add-ons
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <BellRing className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
        </TabsList>

        {/* Branding Settings */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of the platform for all users.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="logo-url">Company Logo URL</Label>
                <Input 
                  id="logo-url" 
                  value={logoUrl} 
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Recommended size: 200x80 pixels, transparent background
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Brand Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="primary-color" 
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1"
                    />
                    <Input 
                      type="color" 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)} 
                      className="w-12 h-10 p-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Brand Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="secondary-color" 
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1"
                    />
                    <Input 
                      type="color" 
                      value={secondaryColor} 
                      onChange={(e) => setSecondaryColor(e.target.value)} 
                      className="w-12 h-10 p-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-footer">Email Footer Text</Label>
                <Textarea 
                  id="email-footer" 
                  value={emailFooter} 
                  onChange={(e) => setEmailFooter(e.target.value)} 
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSaveSettings}>Save Branding Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Personalization Settings */}
        <TabsContent value="personalization">
          <Card>
            <CardHeader>
              <CardTitle>Personalization Settings</CardTitle>
              <CardDescription>
                Configure personalization options for gifts and messaging.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="max-character-limit">Maximum Character Limit</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="max-character-limit"
                    min={50}
                    max={500}
                    step={10}
                    value={[maxCharacterLimit]}
                    onValueChange={(value) => setMaxCharacterLimit(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-mono">{maxCharacterLimit}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This limit applies to all personalization messages.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-html">Allow HTML Tags</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable limited HTML formatting in personalization messages.
                    </p>
                  </div>
                  <Switch 
                    id="allow-html"
                    checked={allowHTMLTags} 
                    onCheckedChange={setAllowHTMLTags} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="spell-check">Spell Check</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically check spelling in personalization messages.
                    </p>
                  </div>
                  <Switch 
                    id="spell-check"
                    checked={spellCheckEnabled} 
                    onCheckedChange={setSpellCheckEnabled} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="preview">Enable Preview</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to preview personalized items before ordering.
                    </p>
                  </div>
                  <Switch 
                    id="preview"
                    checked={previewEnabled} 
                    onCheckedChange={setPreviewEnabled} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSaveSettings}>Save Personalization Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Delivery Settings</CardTitle>
              <CardDescription>
                Configure shipping carriers, box sizes, and delivery options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default Shipping Carrier</Label>
                <div className="flex gap-2">
                  <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultCarriers.map(carrier => (
                        <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddCarrier}>Add Carrier</Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="international-shipping">International Shipping</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable shipping to international addresses.
                  </p>
                </div>
                <Switch 
                  id="international-shipping"
                  checked={internationalShippingEnabled} 
                  onCheckedChange={setInternationalShippingEnabled} 
                />
              </div>

              <div className="space-y-2">
                <Label>Box Sizes & Pricing</Label>
                <div className="border rounded-md">
                  {boxSizes.map(box => (
                    <div 
                      key={box.id}
                      className="flex items-center justify-between p-3 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{box.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {box.dimensions} - ${box.price.toFixed(2)}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditBoxSize(box.id)}
                      >
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSaveSettings}>Save Shipping Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Add-ons Settings */}
        <TabsContent value="addons">
          <Card>
            <CardHeader>
              <CardTitle>Add-ons & Extras</CardTitle>
              <CardDescription>
                Configure additional items that can be added to gift packages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Available Add-ons</Label>
                <div className="border rounded-md">
                  {addOns.map(addon => (
                    <div 
                      key={addon.id}
                      className="flex items-center justify-between p-3 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{addon.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${addon.price.toFixed(2)}
                        </p>
                      </div>
                      <Switch 
                        checked={addon.enabled} 
                        onCheckedChange={() => handleToggleAddOn(addon.id)} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast.info("Add new add-on functionality to be implemented")}
              >
                + Add New Item
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSaveSettings}>Save Add-on Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email notifications and system alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Accordion type="multiple" defaultValue={["item-1"]}>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Notifications
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 mt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">Enable Email Notifications</Label>
                        <Switch 
                          id="email-notifications"
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Notification Events</Label>
                        <div className="space-y-2">
                          {[
                            { id: "new-order", label: "New Order Placed", checked: true },
                            { id: "shipment", label: "Order Shipped", checked: true },
                            { id: "low-inventory", label: "Low Inventory Alert", checked: true },
                            { id: "payment", label: "Payment Received", checked: false }
                          ].map(event => (
                            <div key={event.id} className="flex items-center justify-between">
                              <Label 
                                htmlFor={event.id}
                                className="text-sm"
                              >
                                {event.label}
                              </Label>
                              <Switch id={event.id} defaultChecked={event.checked} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      System Alerts
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="low-inventory-threshold">Low Inventory Threshold</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="low-inventory-threshold"
                            min={5}
                            max={100}
                            step={5}
                            value={[lowInventoryThreshold]}
                            onValueChange={(value) => setLowInventoryThreshold(value[0])}
                            className="flex-1"
                          />
                          <span className="w-12 text-center font-mono">{lowInventoryThreshold}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Send alerts when inventory falls below this threshold.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>System Alert Types</Label>
                        <div className="space-y-2">
                          {[
                            { id: "in-app", label: "In-App Notifications", checked: true },
                            { id: "email-alerts", label: "Email Alerts", checked: true },
                            { id: "sms-alerts", label: "SMS Alerts", checked: false }
                          ].map(alert => (
                            <div key={alert.id} className="flex items-center justify-between">
                              <Label 
                                htmlFor={`alert-${alert.id}`}
                                className="text-sm"
                              >
                                {alert.label}
                              </Label>
                              <Switch id={`alert-${alert.id}`} defaultChecked={alert.checked} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSaveSettings}>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
