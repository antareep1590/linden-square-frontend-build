
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Upload, Check, Users, ChevronRight, ChevronLeft } from "lucide-react";

// Gift box mock data
const giftBoxes = [
  {
    id: "1",
    name: "Classic White",
    image: "/placeholder.svg",
    personalization: "Logo & Custom Message",
    price: 12.99,
  },
  {
    id: "2",
    name: "Eco Kraft",
    image: "/placeholder.svg",
    personalization: "Custom Message Only",
    price: 9.99,
  },
  {
    id: "3",
    name: "Premium Black",
    image: "/placeholder.svg",
    personalization: "Logo & Custom Message",
    price: 19.99,
  },
  {
    id: "4",
    name: "Festive Red",
    image: "/placeholder.svg",
    personalization: "Logo & Custom Message",
    price: 14.99,
  },
];

// Mock selected gifts (in a real app, these would come from context/state)
const selectedGifts = [
  { id: "1", name: "Artisan Chocolates", price: 24.99 },
  { id: "2", name: "Coffee Mug", price: 18.50 },
];

// Mock customer data
const mockCustomers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, New York, NY 10001"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
    address: "456 Park Ave, Boston, MA 02115"
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(555) 456-7890",
    address: "789 Oak Rd, Chicago, IL 60007"
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "(555) 234-5678",
    address: "101 Pine St, San Francisco, CA 94111"
  },
];

const GiftBoxPackaging = () => {
  const [selectedBox, setSelectedBox] = useState<any>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [selectedGiftBoxGifts, setSelectedGiftBoxGifts] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [showCustomersModal, setShowCustomersModal] = useState(false);
  const [addOns, setAddOns] = useState({
    trackingEmail: false,
    requireSignature: false,
    thankYouNote: false,
    promotional: false,
  });
  
  // Calculate progress based on current step
  const progressPercentage = currentStep === 1 ? 50 : 100;

  // Calculate total price
  const calculateTotal = () => {
    if (!selectedBox) return 0;

    const boxPrice = selectedBox.price;
    const giftPrice = selectedGifts
      .filter(gift => selectedGiftBoxGifts.includes(gift.id))
      .reduce((sum, gift) => sum + gift.price, 0);
    
    // Add personalization fee if there's a custom message or logo
    const personalizationFee = (customMessage || logoFile) ? 5.99 : 0;
    
    // Add delivery add-ons fees
    const addOnsTotal = 
      (addOns.trackingEmail ? 0 : 0) + 
      (addOns.requireSignature ? 5 : 0) + 
      (addOns.thankYouNote ? 3 : 0) + 
      (addOns.promotional ? 7 : 0);
    
    return boxPrice + giftPrice + personalizationFee + addOnsTotal;
  };

  const handleBoxSelection = (box: any) => {
    setSelectedBox(box);
    setIsPersonalizeOpen(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGiftToggle = (giftId: string) => {
    setSelectedGiftBoxGifts(prev => {
      if (prev.includes(giftId)) {
        return prev.filter(id => id !== giftId);
      } else {
        return [...prev, giftId];
      }
    });
  };
  
  const handleAddOnToggle = (key: keyof typeof addOns) => {
    setAddOns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomer(customerId);
    setShowCustomersModal(false);
  };
  
  const getSelectedCustomer = () => {
    return mockCustomers.find(c => c.id === selectedCustomer) || null;
  };
  
  const goToNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Packaging & Delivery</h1>
      </div>
      
      {/* Progress Tracker */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <div className="flex items-center">
            <div className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              {currentStep > 1 ? <Check size={16} /> : 1}
            </div>
            <span className={`ml-2 ${currentStep >= 1 ? 'font-medium' : 'text-gray-500'}`}>Package Gifts</span>
          </div>
          <div className="flex-1 mx-4 mt-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <div className="flex items-center">
            <div className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
            <span className={`ml-2 ${currentStep === 2 ? 'font-medium' : 'text-gray-500'}`}>Assign Delivery</span>
          </div>
        </div>
      </div>

      {/* Step 1: Package Gifts */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select a Gift Box</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {giftBoxes.map((box) => (
              <Card key={box.id} className={`overflow-hidden ${selectedBox?.id === box.id ? 'border-2 border-primary' : ''}`}>
                <div className="aspect-square relative bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package size={64} className="text-muted-foreground" />
                  </div>
                  <img
                    src={box.image}
                    alt={box.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{box.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Personalization:</span>
                      <span className="text-sm">{box.personalization}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Price:</span>
                      <span>${box.price.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleBoxSelection(box)}
                    variant={selectedBox?.id === box.id ? "secondary" : "default"}
                  >
                    {selectedBox?.id === box.id ? "Selected" : "Select Box"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Personalization Sheet */}
      <Sheet open={isPersonalizeOpen} onOpenChange={setIsPersonalizeOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg">
          <SheetHeader>
            <SheetTitle>Personalize Your {selectedBox?.name}</SheetTitle>
            <SheetDescription>
              Add a custom message or logo to your gift box.
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-6 py-4">
            {/* Custom Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Custom Message</Label>
              <Textarea 
                id="message" 
                placeholder="Enter your custom message..." 
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>
            
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo">Upload Logo (optional)</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> Choose File
                </Button>
                <Input 
                  type="file" 
                  id="logo-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                <span className="text-sm text-muted-foreground">
                  {logoFile ? logoFile.name : "No file chosen"}
                </span>
              </div>
              
              {/* Logo Preview */}
              {logoPreview && (
                <div className="mt-2 border rounded-md p-2 max-w-[200px]">
                  <p className="text-sm text-muted-foreground mb-1">Logo Preview:</p>
                  <img 
                    src={logoPreview} 
                    alt="Logo Preview" 
                    className="max-h-[100px] max-w-full" 
                  />
                </div>
              )}
            </div>
            
            {/* Select Gifts */}
            <div className="space-y-2">
              <Label>Select Gifts for this Box</Label>
              <div className="border rounded-md p-4 space-y-2">
                {selectedGifts.map(gift => (
                  <div key={gift.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`gift-${gift.id}`} 
                      checked={selectedGiftBoxGifts.includes(gift.id)}
                      onCheckedChange={() => handleGiftToggle(gift.id)}
                    />
                    <Label htmlFor={`gift-${gift.id}`} className="flex-1 cursor-pointer">
                      {gift.name}
                    </Label>
                    <span className="text-sm">${gift.price.toFixed(2)}</span>
                  </div>
                ))}
                
                {selectedGifts.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No gifts selected yet. Please go to "Select Gifts" first.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={() => setIsPersonalizeOpen(false)}>
              Save Personalization
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Step 2: Assign Delivery */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Recipient Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Recipient for Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select onValueChange={setSelectedCustomer} value={selectedCustomer || undefined}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Search for a recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCustomers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setShowCustomersModal(true)}>
                  <Users size={16} className="mr-2" />
                  View All Customers
                </Button>
              </div>

              {/* Selected customer details */}
              {selectedCustomer && (
                <div className="mt-4 border rounded-md p-4 bg-muted/20">
                  <h3 className="text-lg font-semibold mb-2">Recipient Details</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Name:</p>
                        <p className="font-medium">{getSelectedCustomer()?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone:</p>
                        <p className="font-medium">{getSelectedCustomer()?.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Email:</p>
                        <p className="font-medium">{getSelectedCustomer()?.email}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Shipping Address:</p>
                        <p className="font-medium">{getSelectedCustomer()?.address}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm">
                        Edit Address
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Enter specific delivery instructions (e.g., 'Leave at reception', 'Only deliver between 10-12 AM')" 
                className="min-h-[100px]"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Delivery Add-ons */}
          <Card>
            <CardHeader>
              <CardTitle>Optional Delivery Add-ons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tracking-email" 
                    checked={addOns.trackingEmail}
                    onCheckedChange={() => handleAddOnToggle('trackingEmail')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="tracking-email" className="flex-1 cursor-pointer">
                      Send Tracking Email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically send tracking information to recipient
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="require-signature" 
                    checked={addOns.requireSignature}
                    onCheckedChange={() => handleAddOnToggle('requireSignature')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="require-signature" className="flex-1 cursor-pointer">
                      Require Signature ($5.00)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Delivery requires recipient signature for completion
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="thank-you-note" 
                    checked={addOns.thankYouNote}
                    onCheckedChange={() => handleAddOnToggle('thankYouNote')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="thank-you-note" className="flex-1 cursor-pointer">
                      Add Printed Thank-You Note ($3.00)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Include a professionally printed thank-you card
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="promotional-item" 
                    checked={addOns.promotional}
                    onCheckedChange={() => handleAddOnToggle('promotional')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="promotional-item" className="flex-1 cursor-pointer">
                      Include Promotional Item or Swag ($7.00)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add a branded promotional item to the package
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customers Modal */}
      <Dialog open={showCustomersModal} onOpenChange={setShowCustomersModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select a Customer</DialogTitle>
            <DialogDescription>
              Choose a customer to assign as the recipient for this delivery.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Phone</th>
                  <th className="text-left p-2">Address</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {mockCustomers.map(customer => (
                  <tr key={customer.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{customer.name}</td>
                    <td className="p-2">{customer.email}</td>
                    <td className="p-2">{customer.phone}</td>
                    <td className="p-2 max-w-[200px] truncate">{customer.address}</td>
                    <td className="p-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleCustomerSelect(customer.id)}
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomersModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary Panel */}
      {selectedBox && (
        <div className="mt-8 border rounded-lg p-6 bg-muted/20">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between pb-2 border-b">
              <span className="font-medium">Selected Box:</span>
              <span>{selectedBox.name} - ${selectedBox.price.toFixed(2)}</span>
            </div>
            
            {(customMessage || logoFile) && (
              <div className="flex justify-between pb-2 border-b">
                <span className="font-medium">Personalization:</span>
                <div className="text-right">
                  {customMessage && <p className="text-sm">Custom Message</p>}
                  {logoFile && <p className="text-sm">Custom Logo</p>}
                  <span>$5.99</span>
                </div>
              </div>
            )}
            
            {selectedGiftBoxGifts.length > 0 && (
              <div className="pb-2 border-b">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Selected Gifts:</span>
                  <span>
                    $
                    {selectedGifts
                      .filter(gift => selectedGiftBoxGifts.includes(gift.id))
                      .reduce((sum, gift) => sum + gift.price, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="pl-4 space-y-1">
                  {selectedGifts
                    .filter(gift => selectedGiftBoxGifts.includes(gift.id))
                    .map(gift => (
                      <div key={gift.id} className="flex justify-between text-sm">
                        <span>{gift.name}</span>
                        <span>${gift.price.toFixed(2)}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Delivery Add-ons */}
            {currentStep === 2 && (addOns.requireSignature || addOns.thankYouNote || addOns.promotional) && (
              <div className="pb-2 border-b">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Delivery Add-ons:</span>
                  <span>
                    $
                    {(
                      (addOns.requireSignature ? 5 : 0) + 
                      (addOns.thankYouNote ? 3 : 0) + 
                      (addOns.promotional ? 7 : 0)
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="pl-4 space-y-1">
                  {addOns.requireSignature && (
                    <div className="flex justify-between text-sm">
                      <span>Require Signature</span>
                      <span>$5.00</span>
                    </div>
                  )}
                  {addOns.thankYouNote && (
                    <div className="flex justify-between text-sm">
                      <span>Thank-You Note</span>
                      <span>$3.00</span>
                    </div>
                  )}
                  {addOns.promotional && (
                    <div className="flex justify-between text-sm">
                      <span>Promotional Item</span>
                      <span>$7.00</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <Button variant="outline" onClick={goToPreviousStep}>
                <ChevronLeft size={16} className="mr-1" /> Back to Packaging
              </Button>
            )}
            {currentStep === 1 ? (
              <Button className="ml-auto" onClick={goToNextStep} disabled={!selectedBox || selectedGiftBoxGifts.length === 0}>
                Continue to Delivery <ChevronRight size={16} className="ml-1" />
              </Button>
            ) : (
              <Button className="ml-auto" disabled={!selectedCustomer}>
                Confirm & Dispatch
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftBoxPackaging;
