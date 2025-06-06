import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Gift, Edit, Trash, Plus, Filter } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock gift data from inventory
const mockInventoryProducts = [
  { id: "1", name: "Artisan Chocolates", category: "Food & Beverage", unitCost: 15.99 },
  { id: "2", name: "Coffee Mug", category: "Drinkware", unitCost: 12.50 },
  { id: "3", name: "Scented Candle", category: "Home & Living", unitCost: 22.00 },
  { id: "4", name: "Custom Notepad", category: "Stationery", unitCost: 8.75 },
  { id: "5", name: "Leather Journal", category: "Stationery", unitCost: 35.00 },
];

// Mock gift data
const mockGifts = [
  {
    id: 1,
    name: "Luxury Candle Set",
    price: 49.99,
    category: "Home",
    tags: ["aromatherapy", "luxury"],
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop",
    visibility: "public",
    description: "Premium soy candles with natural essential oils",
    quantity: 25,
  },
  {
    id: 2,
    name: "Premium Wine Bottle",
    price: 79.99,
    category: "Food & Drink",
    tags: ["alcohol", "gourmet"],
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=200&fit=crop",
    visibility: "public",
    description: "Carefully selected premium wine from renowned vineyards",
    quantity: 15,
  },
  {
    id: 3,
    name: "Gourmet Chocolate Box",
    price: 35.50,
    category: "Food & Drink",
    tags: ["sweets", "luxury"],
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    visibility: "private",
  },
  {
    id: 4,
    name: "Leather Journal",
    price: 29.99,
    category: "Stationery",
    tags: ["office", "personal"],
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    visibility: "public",
  },
  {
    id: 5,
    name: "Luxury Bath Set",
    price: 59.99,
    category: "Personal Care",
    tags: ["spa", "relaxation"],
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    visibility: "public",
  },
  {
    id: 6,
    name: "Premium Coffee Sampler",
    price: 42.99,
    category: "Food & Drink",
    tags: ["coffee", "gourmet"],
    image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3",
    visibility: "public",
  },
];

// Categories for filtering
const categories = ["All", "Home", "Food & Drink", "Stationery", "Personal Care"];

// Schema for gift form validation
const giftFormSchema = z.object({
  name: z.string().min(3, { message: "Gift name must be at least 3 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  price: z.coerce.number().positive({ message: "Price must be positive." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  tags: z.string(),
  visibility: z.enum(["public", "private"]),
  quantity: z.coerce.number().min(0, { message: "Quantity must be 0 or greater." }),
});

type GiftFormValues = z.infer<typeof giftFormSchema>;

const GiftCatalog = () => {
  const [gifts, setGifts] = useState(mockGifts);
  const [openAddGift, setOpenAddGift] = useState(false);
  const [openEditGift, setOpenEditGift] = useState(false);
  const [editingGift, setEditingGift] = useState<any>(null);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterVisibility, setFilterVisibility] = useState<string[]>([]);
  const [openFilters, setOpenFilters] = useState(false);

  const form = useForm<GiftFormValues>({
    resolver: zodResolver(giftFormSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      description: "",
      tags: "",
      visibility: "public",
      quantity: 0,
    },
  });

  const handleGiftNameChange = (giftName: string) => {
    const selectedProduct = mockInventoryProducts.find(product => product.name === giftName);
    if (selectedProduct) {
      form.setValue('name', giftName);
      form.setValue('category', selectedProduct.category);
      form.setValue('price', selectedProduct.unitCost);
    }
  };

  const onSubmit = (data: GiftFormValues) => {
    const tagsArray = data.tags.split(",").map(tag => tag.trim());
    
    if (editingGift) {
      // Update existing gift
      const updatedGift = {
        ...editingGift,
        name: data.name,
        price: data.price,
        category: data.category,
        tags: tagsArray,
        visibility: data.visibility,
        description: data.description,
        quantity: data.quantity,
      };
      
      setGifts(gifts.map(gift => gift.id === editingGift.id ? updatedGift : gift));
      setOpenEditGift(false);
      setEditingGift(null);
    } else {
      // Add new gift
      const newGift = {
        id: gifts.length + 1,
        name: data.name,
        price: data.price,
        category: data.category,
        tags: tagsArray,
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop",
        visibility: data.visibility,
        description: data.description,
        quantity: data.quantity,
      };
      
      setGifts([...gifts, newGift]);
      setOpenAddGift(false);
    }
    
    form.reset();
  };

  const handleEdit = (gift: any) => {
    setEditingGift(gift);
    form.reset({
      name: gift.name,
      category: gift.category,
      price: gift.price,
      description: gift.description,
      tags: gift.tags.join(", "),
      visibility: gift.visibility,
      quantity: gift.quantity,
    });
    setOpenEditGift(true);
  };

  const handleDelete = (id: number) => {
    setGifts(gifts.filter(gift => gift.id !== id));
  };

  const filteredGifts = gifts.filter(gift => {
    const priceInRange = gift.price >= priceRange[0] && gift.price <= priceRange[1];
    const categoryMatch = selectedCategory === "All" || gift.category === selectedCategory;
    const visibilityMatch = filterVisibility.length === 0 || filterVisibility.includes(gift.visibility);
    
    return priceInRange && categoryMatch && visibilityMatch;
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gift Catalog</h1>
        
        <div className="flex gap-2">
          <Popover open={openFilters} onOpenChange={setOpenFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} /> Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4 p-2">
                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="space-y-2">
                    <Slider
                      defaultValue={[0, 100]}
                      max={100}
                      step={1}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Category</h3>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Visibility</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="public"
                        checked={filterVisibility.includes("public")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterVisibility([...filterVisibility, "public"]);
                          } else {
                            setFilterVisibility(filterVisibility.filter(v => v !== "public"));
                          }
                        }}
                      />
                      <Label htmlFor="public">Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="private"
                        checked={filterVisibility.includes("private")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterVisibility([...filterVisibility, "private"]);
                          } else {
                            setFilterVisibility(filterVisibility.filter(v => v !== "private"));
                          }
                        }}
                      />
                      <Label htmlFor="private">Private</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setPriceRange([0, 100]);
                      setSelectedCategory("All");
                      setFilterVisibility([]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Dialog open={openAddGift} onOpenChange={setOpenAddGift}>
            <DialogTrigger asChild>
              <Button className="bg-linden-blue hover:bg-linden-blue/90 flex items-center gap-2">
                <Plus size={16} /> Add New Gift
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Gift</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gift Name</FormLabel>
                        <Select onValueChange={handleGiftNameChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a gift from inventory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockInventoryProducts.map((product) => (
                              <SelectItem key={product.id} value={product.name}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Auto-filled from inventory, can be edited" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} placeholder="Auto-filled from inventory, can be edited" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Gift description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (comma separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="luxury, aromatherapy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Public Visibility</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === "public"}
                            onCheckedChange={(checked) => field.onChange(checked ? "public" : "private")}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormItem>
                    <FormLabel>Image Upload</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  
                  <DialogFooter>
                    <Button type="submit">Add Gift</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Edit Gift Dialog */}
          <Dialog open={openEditGift} onOpenChange={setOpenEditGift}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Gift</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gift Name</FormLabel>
                        <Select onValueChange={handleGiftNameChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a gift from inventory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockInventoryProducts.map((product) => (
                              <SelectItem key={product.id} value={product.name}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Auto-filled from inventory, can be edited" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} placeholder="Auto-filled from inventory, can be edited" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Gift description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (comma separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="luxury, aromatherapy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Public Visibility</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === "public"}
                            onCheckedChange={(checked) => field.onChange(checked ? "public" : "private")}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormItem>
                    <FormLabel>Image Upload</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  
                  <DialogFooter>
                    <Button type="submit">Update Gift</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredGifts.map((gift) => (
          <Card key={gift.id} className="overflow-hidden h-[320px] flex flex-col">
            <div className="aspect-[4/3] relative bg-gray-100 flex-shrink-0">
              <img
                src={gift.image}
                alt={gift.name}
                className="object-cover w-full h-full"
              />
              <span className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs text-white ${gift.visibility === 'public' ? 'bg-green-500' : 'bg-gray-500'}`}>
                {gift.visibility === 'public' ? 'Public' : 'Private'}
              </span>
            </div>
            
            <CardHeader className="pb-2 px-3 pt-3 flex-shrink-0">
              <CardTitle className="text-sm font-medium leading-tight">
                <div className="flex justify-between items-start gap-2">
                  <span className="truncate flex-1">{gift.name}</span>
                  <span className="text-linden-blue whitespace-nowrap font-semibold">${gift.price.toFixed(2)}</span>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0 px-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {gift.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-1 py-0">{tag}</Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mb-1">Category: {gift.category}</p>
                <p className="text-xs text-gray-600">Qty: {gift.quantity}</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end gap-1 pt-0 px-3 pb-3 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={() => handleEdit(gift)} className="h-8 w-8 p-0">
                <Edit size={12} />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                onClick={() => handleDelete(gift.id)}
              >
                <Trash size={12} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredGifts.length === 0 && (
        <div className="text-center py-10">
          <Gift size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No gifts found</h3>
          <p className="text-gray-500">Try adjusting your filters or add a new gift.</p>
        </div>
      )}
    </div>
  );
};

export default GiftCatalog;
