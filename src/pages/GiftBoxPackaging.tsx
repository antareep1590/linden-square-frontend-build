
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Package, Upload } from "lucide-react";

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

const GiftBoxPackaging = () => {
  const [selectedBox, setSelectedBox] = useState<any>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [selectedGiftBoxGifts, setSelectedGiftBoxGifts] = useState<string[]>([]);

  // Calculate total price
  const calculateTotal = () => {
    if (!selectedBox) return 0;

    const boxPrice = selectedBox.price;
    const giftPrice = selectedGifts
      .filter(gift => selectedGiftBoxGifts.includes(gift.id))
      .reduce((sum, gift) => sum + gift.price, 0);
    
    // Add personalization fee if there's a custom message or logo
    const personalizationFee = (customMessage || logoFile) ? 5.99 : 0;
    
    return boxPrice + giftPrice + personalizationFee;
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gift Box & Packaging</h1>
      </div>

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
            
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button>
              Continue to Personalization
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftBoxPackaging;
