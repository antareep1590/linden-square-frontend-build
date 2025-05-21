
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Plus, Utensils, Shirt, Heart, Briefcase } from "lucide-react";

// Define gift types and interfaces
interface Gift {
  id: string;
  name: string;
  price: number;
  category: "Food" | "Apparel" | "Wellness" | "Office";
  image: string;
  tags: string[];
}

interface GiftBox {
  id: string;
  name: string;
  price: number;
  image: string;
  personalizationOptions: {
    customMessage: boolean;
    logo: boolean;
  };
}

const sampleGifts: Gift[] = [
  {
    id: "1",
    name: "Gourmet Chocolate Box",
    price: 25,
    category: "Food",
    image: "/placeholder.svg",
    tags: ["Premium", "Eco-Friendly"],
  },
  {
    id: "2",
    name: "Artisan Coffee Set",
    price: 35,
    category: "Food",
    image: "/placeholder.svg",
    tags: ["Premium"],
  },
  {
    id: "3",
    name: "Cotton Tote Bag",
    price: 15,
    category: "Apparel",
    image: "/placeholder.svg",
    tags: ["Eco-Friendly"],
  },
  {
    id: "4",
    name: "Self-Care Kit",
    price: 40,
    category: "Wellness",
    image: "/placeholder.svg",
    tags: ["Premium"],
  },
  {
    id: "5",
    name: "Desk Organizer",
    price: 20,
    category: "Office",
    image: "/placeholder.svg",
    tags: ["Eco-Friendly"],
  },
  {
    id: "6",
    name: "Premium Notepad Set",
    price: 18,
    category: "Office",
    image: "/placeholder.svg",
    tags: ["Premium", "Eco-Friendly"],
  },
];

const sampleGiftBoxes: GiftBox[] = [
  {
    id: "1",
    name: "Classic White",
    price: 10,
    image: "/placeholder.svg",
    personalizationOptions: {
      customMessage: true,
      logo: true,
    },
  },
  {
    id: "2",
    name: "Eco Kraft",
    price: 8,
    image: "/placeholder.svg",
    personalizationOptions: {
      customMessage: true,
      logo: false,
    },
  },
  {
    id: "3",
    name: "Premium Black",
    price: 15,
    image: "/placeholder.svg",
    personalizationOptions: {
      customMessage: true,
      logo: true,
    },
  },
];

const SelectGifts = () => {
  const { toast } = useToast();
  const [selectedGifts, setSelectedGifts] = useState<Gift[]>([]);
  const [selectedBox, setSelectedBox] = useState<GiftBox | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [boxModalOpen, setBoxModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 50],
    category: "all",
    tag: "all",
  });

  // Filter gifts based on selected criteria
  const filteredGifts = sampleGifts.filter((gift) => {
    const inPriceRange = gift.price >= filters.priceRange[0] && gift.price <= filters.priceRange[1];
    const matchesCategory = filters.category === "all" || gift.category.toLowerCase() === filters.category;
    const matchesTag = filters.tag === "all" || gift.tags.includes(filters.tag);
    return inPriceRange && matchesCategory && matchesTag;
  });

  // Handle adding a gift to the selection
  const handleAddGift = (gift: Gift) => {
    if (!selectedGifts.some(g => g.id === gift.id)) {
      setSelectedGifts([...selectedGifts, gift]);
      toast({
        title: "Gift added",
        description: `${gift.name} has been added to your selection.`,
      });
    } else {
      toast({
        title: "Gift already added",
        description: `${gift.name} is already in your selection.`,
        variant: "destructive",
      });
    }
  };

  // Handle removing a gift from the selection
  const handleRemoveGift = (giftId: string) => {
    setSelectedGifts(selectedGifts.filter(g => g.id !== giftId));
    toast({
      title: "Gift removed",
      description: "The gift has been removed from your selection.",
    });
  };

  // Handle selecting a gift box
  const handleSelectBox = (box: GiftBox) => {
    setSelectedBox(box);
    setBoxModalOpen(true);
  };

  // Handle uploading a logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoUploaded(true);
      toast({
        title: "Logo uploaded",
        description: "Your logo has been uploaded successfully.",
      });
    }
  };

  // Handle saving the box selection
  const handleSaveBoxSelection = () => {
    if (!selectedBox) return;
    
    toast({
      title: "Box selected",
      description: `${selectedBox.name} has been selected for your gifts.`,
    });
    setBoxModalOpen(false);
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const giftsPrice = selectedGifts.reduce((total, gift) => total + gift.price, 0);
    const boxPrice = selectedBox ? selectedBox.price : 0;
    // Add personalization fee if applicable (e.g., $5 for custom message, $10 for logo)
    const personalizationFee = (customMessage ? 5 : 0) + (logoUploaded ? 10 : 0);
    return giftsPrice + boxPrice + personalizationFee;
  };

  // Get the appropriate icon for a category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Food":
        return <Utensils className="h-4 w-4" />;
      case "Apparel":
        return <Shirt className="h-4 w-4" />;
      case "Wellness":
        return <Heart className="h-4 w-4" />;
      case "Office":
        return <Briefcase className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Select Gifts</h1>
        <p className="text-gray-500">Choose gifts to include in your gift box.</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <Label>Price Range</Label>
            <div className="flex items-center gap-4">
              <div className="w-48">
                <Slider 
                  defaultValue={[filters.priceRange[0], filters.priceRange[1]]} 
                  min={0} 
                  max={50} 
                  step={1} 
                  onValueChange={(value) => setFilters({...filters, priceRange: value})}
                />
              </div>
              <span className="text-sm text-gray-500">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-48">
              <Label htmlFor="category-select" className="mb-2 block">Category</Label>
              <Select 
                onValueChange={(value) => setFilters({...filters, category: value})} 
                defaultValue={filters.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="apparel">Apparel</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-48">
              <Label htmlFor="tag-select" className="mb-2 block">Tag</Label>
              <Select 
                onValueChange={(value) => setFilters({...filters, tag: value})} 
                defaultValue={filters.tag}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Eco-Friendly">Eco-Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gifts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGifts.map((gift) => (
          <Card key={gift.id} className="hover:shadow-md transition-shadow">
            <div className="aspect-square overflow-hidden">
              <img 
                src={gift.image} 
                alt={gift.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-lg">{gift.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">${gift.price}</p>
                <div className="flex items-center space-x-1">
                  {getCategoryIcon(gift.category)}
                  <span className="text-sm">{gift.category}</span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {gift.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                className="w-full" 
                onClick={() => handleAddGift(gift)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add to Order
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {selectedGifts.length > 0 && (
        <>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Selected Gifts ({selectedGifts.length})</h2>
            <div className="bg-white p-4 rounded-md shadow">
              <div className="space-y-2">
                {selectedGifts.map((gift) => (
                  <div key={gift.id} className="flex justify-between items-center p-2 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-12 overflow-hidden rounded">
                        <img 
                          src={gift.image}
                          alt={gift.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{gift.name}</p>
                        <p className="text-sm text-gray-500">${gift.price}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveGift(gift.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Select a Gift Box</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {sampleGiftBoxes.map((box) => (
                <Card key={box.id} className="hover:shadow-md transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={box.image} 
                      alt={box.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg">{box.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="font-semibold">${box.price}</p>
                    <div className="mt-2 text-sm">
                      <p>Personalization Options:</p>
                      <ul className="list-disc pl-5 mt-1">
                        {box.personalizationOptions.customMessage && (
                          <li>Add Custom Message</li>
                        )}
                        {box.personalizationOptions.logo && (
                          <li>Upload Logo</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      className="w-full" 
                      onClick={() => handleSelectBox(box)}
                      variant={selectedBox?.id === box.id ? "secondary" : "default"}
                    >
                      {selectedBox?.id === box.id ? "Selected" : "Select Box"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Box Personalization Modal */}
          <Dialog open={boxModalOpen} onOpenChange={setBoxModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Personalize Your Gift Box</DialogTitle>
                <DialogDescription>
                  Add a custom message and logo to your {selectedBox?.name} gift box.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {selectedBox?.personalizationOptions.customMessage && (
                  <div>
                    <Label htmlFor="custom-message">Custom Message</Label>
                    <Textarea 
                      id="custom-message"
                      placeholder="Enter your custom message here..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="mt-1 resize-none"
                    />
                  </div>
                )}
                
                {selectedBox?.personalizationOptions.logo && (
                  <div>
                    <Label htmlFor="logo-upload">Upload Logo</Label>
                    <Input 
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Recommended: PNG or SVG with transparent background
                    </p>
                  </div>
                )}
                
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Preview</h3>
                  <div className="flex items-center justify-center bg-white border rounded-md p-4 min-h-20">
                    {customMessage ? (
                      <p className="text-center italic">"{customMessage}"</p>
                    ) : (
                      <p className="text-gray-400 text-center">Custom message will appear here</p>
                    )}
                    {logoUploaded && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-center">
                        <p className="text-xs">Your logo has been uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setBoxModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveBoxSelection}>
                  Save Personalization
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Order Summary */}
          {selectedBox && (
            <div className="mt-8 bg-white p-4 rounded-md shadow">
              <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Selected Gifts ({selectedGifts.length})</span>
                  <span>${selectedGifts.reduce((total, gift) => total + gift.price, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gift Box ({selectedBox.name})</span>
                  <span>${selectedBox.price}</span>
                </div>
                {customMessage && (
                  <div className="flex justify-between">
                    <span>Custom Message</span>
                    <span>$5</span>
                  </div>
                )}
                {logoUploaded && (
                  <div className="flex justify-between">
                    <span>Logo Upload</span>
                    <span>$10</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                  <span>Total</span>
                  <span>${calculateTotalPrice()}</span>
                </div>
              </div>
              <div className="mt-4">
                <Button className="w-full">
                  Continue to Personalization
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SelectGifts;
