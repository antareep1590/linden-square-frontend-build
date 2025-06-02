import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Package,
  Plus,
  Trash,
  Edit,
  Search,
  Upload,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Truck,
  User,
  FileText,
  Gift,
  MapPin,
  PenLine,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";
import CarrierAssigneeStep from "@/components/packaging/CarrierAssigneeStep";
import { deliveryStatusService } from "@/services/deliveryStatusService";

// Mock data for Gift Boxes
const mockGiftBoxes = [
  {
    id: 1,
    name: "Premium Wood Box",
    description: "Elegant wooden box with magnetic closure",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    personalizationOptions: ["Engraving", "Custom Logo", "Gift Message"],
    isActive: true,
  },
  {
    id: 2,
    name: "Luxury Gift Box",
    description: "High-end gift box with gold accents",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    personalizationOptions: ["Ribbon Color", "Custom Logo", "Gift Message"],
    isActive: true,
  },
  {
    id: 3,
    name: "Eco-Friendly Box",
    description: "Sustainable gift box made from recycled materials",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    personalizationOptions: ["Gift Message", "Custom Stamp"],
    isActive: true,
  },
  {
    id: 4,
    name: "Seasonal Holiday Box",
    description: "Festive box perfect for holiday gifting",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    personalizationOptions: ["Custom Logo", "Gift Message", "Holiday Tag"],
    isActive: false,
  },
];

// Mock data for packages ready for delivery
const mockPackages = [
  {
    id: 101,
    clientName: "Acme Corp",
    packageName: "Premium Employee Gift",
    giftBox: "Premium Wood Box",
    items: ["Luxury Candle Set", "Premium Wine Bottle"],
    status: "pending",
    dateSubmitted: "2025-05-15T10:30:00",
    recipientCount: 5
  },
  {
    id: 102,
    clientName: "Tech Innovations",
    packageName: "Client Appreciation",
    giftBox: "Luxury Gift Box",
    items: ["Gourmet Chocolate Box", "Premium Coffee Sampler"],
    status: "pending",
    dateSubmitted: "2025-05-17T14:45:00",
    recipientCount: 12
  },
  {
    id: 103,
    clientName: "Global Consulting",
    packageName: "New Client Welcome",
    giftBox: "Eco-Friendly Box",
    items: ["Leather Journal", "Gourmet Chocolate Box"],
    status: "dispatched",
    dateSubmitted: "2025-05-10T09:15:00",
    recipientCount: 3
  },
];

// Mock data for recipients
const mockRecipients = [
  {
    id: 1001,
    name: "John Doe",
    email: "john@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, CA 94501",
    company: "Acme Corp",
  },
  {
    id: 1002,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "555-987-6543",
    address: "456 Oak Ave, Somewhere, CA 94502",
    company: "Tech Innovations",
  },
  {
    id: 1003,
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "555-555-5555",
    address: "789 Pine Rd, Nowhere, CA 94503",
    company: "Global Consulting",
  },
];

// Schema for gift box form validation
const giftBoxFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be positive." }),
  personalizationOptions: z.array(z.string()).min(1, { message: "Select at least one option." }),
  isActive: z.boolean().default(true),
});

type GiftBoxFormValues = z.infer<typeof giftBoxFormSchema>;

// Define the GiftBox type explicitly based on mockGiftBoxes structure
type GiftBox = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  personalizationOptions: string[];
  isActive: boolean;
};

// Schema for delivery form validation
const deliveryFormSchema = z.object({
  recipientId: z.string().min(1, { message: "Please select a recipient." }),
  deliveryNotes: z.string().optional(),
  sendTrackingEmail: z.boolean().default(true),
  requireSignature: z.boolean().default(false),
  addThankYouNote: z.boolean().default(false),
  includePromotionalItem: z.boolean().default(false),
});

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

const AdminPackagingDelivery = () => {
  const [activeTab, setActiveTab] = useState("gift-boxes");
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>(mockGiftBoxes);
  const [packages, setPackages] = useState(mockPackages);
  const [openAddGiftBox, setOpenAddGiftBox] = useState(false);
  const [editingBoxId, setEditingBoxId] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<typeof mockPackages[0] | null>(null);
  const [deliveryStep, setDeliveryStep] = useState(1);
  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");

  // Form for Gift Box
  const giftBoxForm = useForm<GiftBoxFormValues>({
    resolver: zodResolver(giftBoxFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      personalizationOptions: [],
      isActive: true,
    },
  });

  // Form for Delivery
  const deliveryForm = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      recipientId: "",
      deliveryNotes: "",
      sendTrackingEmail: true,
      requireSignature: false,
      addThankYouNote: false,
      includePromotionalItem: false,
    },
  });

  const onGiftBoxSubmit = (data: GiftBoxFormValues) => {
    if (editingBoxId !== null) {
      // Update existing gift box
      setGiftBoxes(
        giftBoxes.map((box) =>
          box.id === editingBoxId ? { ...box, ...data } : box
        )
      );
      setEditingBoxId(null);
    } else {
      // Add new gift box
      const newGiftBox: GiftBox = {
        id: giftBoxes.length + 1,
        name: data.name,
        description: data.description,
        price: data.price,
        personalizationOptions: data.personalizationOptions,
        isActive: data.isActive,
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9", // Default image
      };
      setGiftBoxes([...giftBoxes, newGiftBox]);
    }
    
    setOpenAddGiftBox(false);
    giftBoxForm.reset();
  };

  const handleEditGiftBox = (box: typeof mockGiftBoxes[0]) => {
    setEditingBoxId(box.id);
    giftBoxForm.reset({
      name: box.name,
      description: box.description,
      price: box.price,
      personalizationOptions: box.personalizationOptions,
      isActive: box.isActive,
    });
    setOpenAddGiftBox(true);
  };

  const handleDeleteGiftBox = (id: number) => {
    setGiftBoxes(giftBoxes.filter((box) => box.id !== id));
  };

  const handleSelectPackage = (pkg: typeof mockPackages[0]) => {
    setSelectedPackage(pkg);
    setDeliveryStep(1);
    deliveryForm.reset();
  };

  const onDeliverySubmit = (data: DeliveryFormValues) => {
    console.log("Delivery data:", data);
    console.log("Carrier:", selectedCarrier);
    console.log("Assignee:", selectedAssignee);
    
    if (selectedPackage) {
      setPackages(
        packages.map((pkg) =>
          pkg.id === selectedPackage.id ? { ...pkg, status: "dispatched" } : pkg
        )
      );

      // Update status via service to sync with Track Orders
      deliveryStatusService.updateStatus(
        selectedPackage.id.toString(),
        "dispatched",
        selectedAssignee
      );
    }
    
    setSelectedPackage(null);
    setDeliveryStep(1);
    setSelectedCarrier("");
    setSelectedAssignee("");
    deliveryForm.reset();
  };

  const handleCancelDelivery = () => {
    setSelectedPackage(null);
    setDeliveryStep(1);
    setSelectedCarrier("");
    setSelectedAssignee("");
    deliveryForm.reset();
  };

  // Selected recipient data for preview
  const selectedRecipient = deliveryForm.watch("recipientId") 
    ? mockRecipients.find(r => r.id.toString() === deliveryForm.watch("recipientId"))
    : null;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Packaging & Delivery</h1>
      </div>

      {!selectedPackage ? (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="gift-boxes">Gift Box & Packaging</TabsTrigger>
            <TabsTrigger value="delivery">Assign Delivery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gift-boxes" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={openAddGiftBox} onOpenChange={setOpenAddGiftBox}>
                <DialogTrigger asChild>
                  <Button className="bg-linden-blue hover:bg-linden-blue/90">
                    <Plus size={16} className="mr-2" /> Add Gift Box
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingBoxId !== null ? "Edit Gift Box" : "Add Gift Box"}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...giftBoxForm}>
                    <form onSubmit={giftBoxForm.handleSubmit(onGiftBoxSubmit)} className="space-y-4">
                      <FormField
                        control={giftBoxForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Gift Box Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={giftBoxForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Gift box description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={giftBoxForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={giftBoxForm.control}
                        name="personalizationOptions"
                        render={() => (
                          <FormItem>
                            <div className="mb-2">
                              <FormLabel>Personalization Options</FormLabel>
                              <FormDescription>
                                Select all available personalization options for this box.
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {["Engraving", "Custom Logo", "Gift Message", "Ribbon Color", "Custom Stamp", "Holiday Tag"].map((option) => (
                                <FormField
                                  key={option}
                                  control={giftBoxForm.control}
                                  name="personalizationOptions"
                                  render={({ field }) => (
                                    <FormItem key={option} className="flex flex-row items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option)}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...field.value, option]
                                              : field.value.filter((val) => val !== option);
                                            field.onChange(updatedValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {option}
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={giftBoxForm.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Active Status</FormLabel>
                              <FormDescription>
                                Make this gift box available to clients
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormItem>
                        <FormLabel>Upload Image</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      
                      <DialogFooter>
                        <Button type="submit">
                          {editingBoxId !== null ? "Save Changes" : "Add Gift Box"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {giftBoxes.map((box) => (
                <Card key={box.id} className={box.isActive ? "" : "opacity-60"}>
                  <div className="aspect-square relative">
                    <img
                      src={box.image}
                      alt={box.name}
                      className="object-cover w-full h-full rounded-t-lg"
                    />
                    {!box.isActive && (
                      <Badge className="absolute top-2 right-2 bg-gray-500">Inactive</Badge>
                    )}
                  </div>
                  
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{box.name}</CardTitle>
                      <span className="text-linden-blue font-medium">${box.price.toFixed(2)}</span>
                    </div>
                    <CardDescription>{box.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Personalization Options:</h4>
                      <div className="flex flex-wrap gap-2">
                        {box.personalizationOptions.map((option, index) => (
                          <Badge key={index} variant="outline">{option}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditGiftBox(box)}
                    >
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDeleteGiftBox(box.id)}
                    >
                      <Trash size={14} className="mr-1" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="delivery" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search packages..." 
                    className="pl-9"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="dispatched">Dispatched</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="gap-2">
                <Upload size={16} /> Import CSV
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Package Name</TableHead>
                    <TableHead>Gift Box</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.id}</TableCell>
                      <TableCell>{pkg.clientName}</TableCell>
                      <TableCell>{pkg.packageName}</TableCell>
                      <TableCell>{pkg.giftBox}</TableCell>
                      <TableCell>{format(new Date(pkg.dateSubmitted), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{pkg.recipientCount}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            pkg.status === "dispatched" 
                              ? "bg-green-500" 
                              : "bg-amber-500"
                          }
                        >
                          {pkg.status === "dispatched" ? "Dispatched" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={pkg.status === "dispatched"}
                          onClick={() => handleSelectPackage(pkg)}
                        >
                          Assign Delivery
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {packages.length === 0 && (
              <div className="text-center py-10">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No packages found</h3>
                <p className="text-gray-500">There are currently no packages ready for delivery.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleCancelDelivery}
            >
              <ArrowLeft size={16} /> Back to Packages
            </Button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Package ID: {selectedPackage.id}</span>
              <Badge className="bg-amber-500">Pending Delivery</Badge>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Assign Delivery: {selectedPackage.packageName}</CardTitle>
              <CardDescription>
                Client: {selectedPackage.clientName} | Gift Box: {selectedPackage.giftBox}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${deliveryStep === 1 ? 'bg-linden-blue text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <div className={`h-0.5 flex-1 ${deliveryStep >= 2 ? 'bg-linden-blue' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${deliveryStep === 2 ? 'bg-linden-blue text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <div className={`h-0.5 flex-1 ${deliveryStep >= 3 ? 'bg-linden-blue' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${deliveryStep === 3 ? 'bg-linden-blue text-white' : 'bg-gray-200'}`}>
                  3
                </div>
              </div>
              
              <Form {...deliveryForm}>
                <form onSubmit={deliveryForm.handleSubmit(onDeliverySubmit)} className="space-y-6">
                  {deliveryStep === 1 ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Select Recipient for Delivery</h3>
                        <div className="space-y-4">
                          <FormField
                            control={deliveryForm.control}
                            name="recipientId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Select Recipient</FormLabel>
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a recipient" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {mockRecipients.map((recipient) => (
                                          <SelectItem key={recipient.id} value={recipient.id.toString()}>
                                            {recipient.name} ({recipient.company})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" type="button">
                                        View All
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                      <div className="p-4 border-b">
                                        <h4 className="font-medium">All Recipients</h4>
                                        <p className="text-sm text-gray-500">
                                          Select from the complete list of recipients
                                        </p>
                                      </div>
                                      <ScrollArea className="h-[300px]">
                                        <div className="p-4 space-y-2">
                                          {mockRecipients.map((recipient) => (
                                            <div 
                                              key={recipient.id} 
                                              className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${field.value === recipient.id.toString() ? 'border-linden-blue bg-blue-50' : ''}`}
                                              onClick={() => field.onChange(recipient.id.toString())}
                                            >
                                              <div className="font-medium">{recipient.name}</div>
                                              <div className="text-sm text-gray-500">
                                                {recipient.company} | {recipient.email}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </ScrollArea>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {selectedRecipient && (
                            <Card className="bg-gray-50">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-base">Recipient Information</CardTitle>
                                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                                    <PenLine size={14} /> Edit Address
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <User size={14} />
                                      <span className="text-sm font-medium">Name</span>
                                    </div>
                                    <p className="text-sm">{selectedRecipient.name}</p>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <FileText size={14} />
                                      <span className="text-sm font-medium">Company</span>
                                    </div>
                                    <p className="text-sm">{selectedRecipient.company}</p>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <MapPin size={14} />
                                      <span className="text-sm font-medium">Shipping Address</span>
                                    </div>
                                    <p className="text-sm">{selectedRecipient.address}</p>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <FileText size={14} />
                                      <span className="text-sm font-medium">Contact</span>
                                    </div>
                                    <p className="text-sm">{selectedRecipient.email}</p>
                                    <p className="text-sm">{selectedRecipient.phone}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          onClick={() => setDeliveryStep(2)} 
                          disabled={!selectedRecipient}
                          className="gap-2"
                        >
                          Continue <ArrowRight size={16} />
                        </Button>
                      </div>
                    </div>
                  ) : deliveryStep === 2 ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Delivery Notes & Add-ons</h3>
                        
                        <FormField
                          control={deliveryForm.control}
                          name="deliveryNotes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Instructions</FormLabel>
                              <FormDescription>
                                Add any specific instructions for delivery
                              </FormDescription>
                              <FormControl>
                                <Textarea
                                  placeholder="E.g., Leave at reception, Deliver between 10-12 AM"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="border rounded-md p-4 space-y-4">
                        <h4 className="font-medium">Optional Delivery Add-ons</h4>
                        
                        <FormField
                          control={deliveryForm.control}
                          name="sendTrackingEmail"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div>
                                <FormLabel>Send Tracking Email</FormLabel>
                                <FormDescription className="text-xs">
                                  Automatically send tracking information to recipient
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={deliveryForm.control}
                          name="requireSignature"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div>
                                <FormLabel>Require Signature</FormLabel>
                                <FormDescription className="text-xs">
                                  Package will only be delivered with recipient signature
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={deliveryForm.control}
                          name="addThankYouNote"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div>
                                <FormLabel>Add Printed Thank-You Note</FormLabel>
                                <FormDescription className="text-xs">
                                  Include a personalized thank-you card ($3.99 additional)
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={deliveryForm.control}
                          name="includePromotionalItem"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div>
                                <FormLabel>Include Promotional Item/Swag</FormLabel>
                                <FormDescription className="text-xs">
                                  Add company-branded promotional items ($5.99 additional)
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setDeliveryStep(1)} 
                          className="gap-2"
                        >
                          <ArrowLeft size={16} /> Back
                        </Button>
                        
                        <Button 
                          type="button" 
                          onClick={() => setDeliveryStep(3)} 
                          className="gap-2"
                        >
                          Continue <ArrowRight size={16} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <CarrierAssigneeStep
                        selectedCarrier={selectedCarrier}
                        selectedAssignee={selectedAssignee}
                        onCarrierChange={setSelectedCarrier}
                        onAssigneeChange={setSelectedAssignee}
                      />
                      
                      <div className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setDeliveryStep(2)} 
                          className="gap-2"
                        >
                          <ArrowLeft size={16} /> Back
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="gap-2 border-amber-500 text-amber-500 hover:bg-amber-50"
                          >
                            <XCircle size={16} /> Hold for Review
                          </Button>
                          <Button 
                            type="submit" 
                            className="gap-2 bg-linden-blue hover:bg-linden-blue/90"
                            disabled={!selectedCarrier || !selectedAssignee}
                          >
                            <CheckCircle size={16} /> Confirm & Dispatch
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPackagingDelivery;
