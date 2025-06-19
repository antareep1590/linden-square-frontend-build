import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Package, Truck, Clock, CheckCircle, MapPin, User, Gift, Calendar, Search, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface ShippingOrder {
  id: string;
  giftBoxName: string;
  giftItems: { name: string; quantity: number }[];
  recipientName: string;
  recipientAddress: string;
  deliveryMethod: 'express' | 'normal' | 'slow';
  requestedPickUpWindow?: string;
  confirmedPickUpSlot?: string;
  shipmentStatus: 'pending-assignment' | 'carrier-assigned' | 'pickup-window-requested' | 'pickup-scheduled' | 'picked-up';
  carrier?: string;
  packer?: string;
  orderDate: Date;
  pickupAddress?: string;
  carrierPricing?: { [key: string]: number };
}

const mockShippingOrders: ShippingOrder[] = [
  {
    id: "ORD-001",
    giftBoxName: "Premium Employee Gift",
    giftItems: [
      { name: "Luxury Candle Set", quantity: 1 },
      { name: "Premium Coffee", quantity: 1 },
      { name: "Gourmet Chocolates", quantity: 1 }
    ],
    recipientName: "John Doe",
    recipientAddress: "123 Main St, San Francisco, CA 94501",
    deliveryMethod: 'express',
    shipmentStatus: 'pending-assignment',
    orderDate: new Date("2023-11-01"),
    carrierPricing: { "FedEx": 25.99, "UPS": 23.50 }
  },
  {
    id: "ORD-002",
    giftBoxName: "Client Appreciation",
    giftItems: [
      { name: "Wine Bottle", quantity: 1 },
      { name: "Cheese Selection", quantity: 1 }
    ],
    recipientName: "Jane Smith",
    recipientAddress: "456 Oak Ave, San Francisco, CA 94502",
    deliveryMethod: 'normal',
    shipmentStatus: 'carrier-assigned',
    carrier: "FedEx",
    packer: "John Smith",
    orderDate: new Date("2023-10-28"),
    carrierPricing: { "FedEx": 15.99, "UPS": 14.50, "USPS": 12.99 }
  },
  {
    id: "ORD-003",
    giftBoxName: "Holiday Special",
    giftItems: [
      { name: "Holiday Treats", quantity: 2 },
      { name: "Festive Candle", quantity: 1 }
    ],
    recipientName: "Bob Johnson",
    recipientAddress: "789 Pine St, Chicago, IL 60601",
    deliveryMethod: 'slow',
    shipmentStatus: 'pickup-scheduled',
    carrier: "UPS",
    packer: "Sarah Wilson",
    requestedPickUpWindow: "Dec 15, 2023 2:00 PM - 4:00 PM",
    confirmedPickUpSlot: "Dec 15, 2023 3:30 PM - 4:30 PM",
    orderDate: new Date("2023-10-20"),
    carrierPricing: { "UPS": 12.99, "USPS": 10.50 }
  },
  {
    id: "ORD-004",
    giftBoxName: "Executive Package",
    giftItems: [
      { name: "Premium Notebook", quantity: 1 },
      { name: "Artisan Pen", quantity: 1 }
    ],
    recipientName: "Sarah Wilson",
    recipientAddress: "321 Broadway, New York, NY 10001",
    deliveryMethod: 'express',
    shipmentStatus: 'pickup-window-requested',
    carrier: "DHL",
    packer: "Mike Johnson",
    requestedPickUpWindow: "Dec 20, 2023 10:00 AM - 12:00 PM",
    orderDate: new Date("2023-10-15"),
    carrierPricing: { "DHL": 28.99, "FedEx": 26.50 }
  },
  {
    id: "ORD-005",
    giftBoxName: "Welcome Kit",
    giftItems: [
      { name: "Company Mug", quantity: 1 },
      { name: "Welcome Guide", quantity: 1 }
    ],
    recipientName: "David Chen",
    recipientAddress: "555 Tech Ave, Austin, TX 78701",
    deliveryMethod: 'normal',
    shipmentStatus: 'picked-up',
    carrier: "USPS",
    packer: "Lisa Davis",
    requestedPickUpWindow: "Dec 10, 2023 9:00 AM - 11:00 AM",
    confirmedPickUpSlot: "Dec 10, 2023 9:30 AM - 10:30 AM",
    orderDate: new Date("2023-10-05"),
    carrierPricing: { "USPS": 11.99, "UPS": 13.50 }
  },
  {
    id: "ORD-006",
    giftBoxName: "Client Thank You",
    giftItems: [
      { name: "Gourmet Tea", quantity: 1 },
      { name: "Thank You Card", quantity: 1 }
    ],
    recipientName: "Emily Rodriguez",
    recipientAddress: "777 Market St, Seattle, WA 98101",
    deliveryMethod: 'slow',
    shipmentStatus: 'carrier-assigned',
    carrier: "UPS",
    packer: "John Smith",
    orderDate: new Date("2023-10-25"),
    carrierPricing: { "UPS": 14.99, "USPS": 12.50 }
  },
  {
    id: "ORD-007",
    giftBoxName: "Anniversary Gift",
    giftItems: [
      { name: "Celebration Bottle", quantity: 1 },
      { name: "Anniversary Card", quantity: 1 }
    ],
    recipientName: "Michael Thompson",
    recipientAddress: "888 Oak Street, Portland, OR 97201",
    deliveryMethod: 'express',
    shipmentStatus: 'pending-assignment',
    orderDate: new Date("2023-11-05"),
    carrierPricing: { "FedEx": 27.99, "UPS": 25.50 }
  },
  {
    id: "ORD-008",
    giftBoxName: "Team Appreciation",
    giftItems: [
      { name: "Team Snacks", quantity: 3 },
      { name: "Thank You Note", quantity: 1 }
    ],
    recipientName: "Lisa Park",
    recipientAddress: "999 Innovation Dr, San Jose, CA 95110",
    deliveryMethod: 'normal',
    shipmentStatus: 'pickup-scheduled',
    carrier: "FedEx",
    packer: "Sarah Wilson",
    requestedPickUpWindow: "Dec 18, 2023 1:00 PM - 3:00 PM",
    confirmedPickUpSlot: "Dec 18, 2023 2:00 PM - 3:00 PM",
    orderDate: new Date("2023-10-30"),
    carrierPricing: { "FedEx": 16.99, "UPS": 15.50 }
  },
  {
    id: "ORD-009",
    giftBoxName: "Holiday Bonus",
    giftItems: [
      { name: "Holiday Treats", quantity: 2 },
      { name: "Bonus Card", quantity: 1 }
    ],
    recipientName: "James Anderson",
    recipientAddress: "111 Finance Blvd, Denver, CO 80202",
    deliveryMethod: 'slow',
    shipmentStatus: 'pickup-window-requested',
    carrier: "USPS",
    packer: "Mike Johnson",
    requestedPickUpWindow: "Dec 22, 2023 3:00 PM - 5:00 PM",
    orderDate: new Date("2023-10-18"),
    carrierPricing: { "USPS": 13.99, "UPS": 15.50 }
  },
  {
    id: "ORD-010",
    giftBoxName: "New Year Package",
    giftItems: [
      { name: "Calendar", quantity: 1 },
      { name: "New Year Card", quantity: 1 }
    ],
    recipientName: "Amanda Foster",
    recipientAddress: "222 Business Park, Miami, FL 33101",
    deliveryMethod: 'express',
    shipmentStatus: 'picked-up',
    carrier: "DHL",
    packer: "Lisa Davis",
    requestedPickUpWindow: "Dec 28, 2023 11:00 AM - 1:00 PM",
    confirmedPickUpSlot: "Dec 28, 2023 11:30 AM - 12:30 PM",
    orderDate: new Date("2023-10-12"),
    carrierPricing: { "DHL": 29.99, "FedEx": 27.50 }
  }
];

const carriers = ["FedEx", "UPS", "USPS", "DHL"];
const packers = ["John Smith", "Sarah Wilson", "Mike Johnson", "Lisa Davis"];

const AdminShippingDelivery = () => {
  const [orders, setOrders] = useState<ShippingOrder[]>(mockShippingOrders);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryMethodFilter, setDeliveryMethodFilter] = useState("all");
  const [orderDateRange, setOrderDateRange] = useState<DateRange | undefined>();
  const [shipmentStatusFilter, setShipmentStatusFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [requestedPickupDateRange, setRequestedPickupDateRange] = useState<DateRange | undefined>();
  const [confirmedPickupDateRange, setConfirmedPickupDateRange] = useState<DateRange | undefined>();
  
  const [selectedGiftItems, setSelectedGiftItems] = useState<{ name: string; quantity: number }[] | null>(null);
  const [isGiftItemsModalOpen, setIsGiftItemsModalOpen] = useState(false);
  
  // Carrier Assignment Modal
  const [isCarrierModalOpen, setIsCarrierModalOpen] = useState(false);
  const [selectedOrderForCarrier, setSelectedOrderForCarrier] = useState<ShippingOrder | null>(null);
  const [pickupAddress, setPickupAddress] = useState("123 Warehouse St, San Francisco, CA 94107");
  
  // Pick-up Schedule Modal
  const [isPickupScheduleModalOpen, setIsPickupScheduleModalOpen] = useState(false);
  const [selectedOrderForPickup, setSelectedOrderForPickup] = useState<ShippingOrder | null>(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupStartTime, setPickupStartTime] = useState("");
  const [pickupEndTime, setPickupEndTime] = useState("");
  
  // Confirm Pick-up Slot Modal
  const [isConfirmPickupModalOpen, setIsConfirmPickupModalOpen] = useState(false);
  const [selectedOrderForConfirm, setSelectedOrderForConfirm] = useState<ShippingOrder | null>(null);
  const [confirmPickupDate, setConfirmPickupDate] = useState("");
  const [confirmPickupStartTime, setConfirmPickupStartTime] = useState("");
  const [confirmPickupEndTime, setConfirmPickupEndTime] = useState("");

  const getDeliveryMethodLabel = (method: string) => {
    const methodConfig = {
      "express": "Express Delivery (1–2 business days)",
      "normal": "Normal Delivery (2–3 business days)",
      "slow": "Slow Delivery (3–5 business days)"
    };
    return methodConfig[method as keyof typeof methodConfig] || method;
  };

  const getShipmentStatusBadge = (status: string) => {
    const statusConfig = {
      "pending-assignment": { 
        color: "bg-gray-100 text-gray-800 border-gray-300", 
        label: "Pending Assignment" 
      },
      "carrier-assigned": { 
        color: "bg-blue-100 text-blue-800 border-blue-300", 
        label: "Carrier Assigned" 
      },
      "pickup-window-requested": { 
        color: "bg-yellow-100 text-yellow-800 border-yellow-300", 
        label: "Pick-Up Window Requested" 
      },
      "pickup-scheduled": { 
        color: "bg-green-100 text-green-800 border-green-300", 
        label: "Pick-Up Scheduled" 
      },
      "picked-up": { 
        color: "bg-purple-100 text-purple-800 border-purple-300", 
        label: "Picked Up" 
      }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} border text-xs font-medium px-2 py-1 rounded-full`}>
        {config.label}
      </Badge>
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDeliveryMethodFilter("all");
    setOrderDateRange(undefined);
    setShipmentStatusFilter("all");
    setCarrierFilter("all");
    setRequestedPickupDateRange(undefined);
    setConfirmedPickupDateRange(undefined);
  };

  const filteredOrders = orders.filter(order => {
    // Search query filter
    const searchFields = [order.recipientName, order.recipientAddress].join(' ').toLowerCase();
    const matchesSearch = !searchQuery || searchFields.includes(searchQuery.toLowerCase());
    
    // Delivery method filter
    const matchesDeliveryMethod = deliveryMethodFilter === "all" || order.deliveryMethod === deliveryMethodFilter;
    
    // Shipment status filter
    const matchesStatus = shipmentStatusFilter === "all" || order.shipmentStatus === shipmentStatusFilter;
    
    // Carrier filter
    const matchesCarrier = carrierFilter === "all" || order.carrier === carrierFilter;
    
    // Date range filters would be implemented here based on actual date parsing
    // For now, keeping it simple
    
    return matchesSearch && matchesDeliveryMethod && matchesStatus && matchesCarrier;
  });

  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const openGiftItemsModal = (giftItems: { name: string; quantity: number }[]) => {
    setSelectedGiftItems(giftItems);
    setIsGiftItemsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Shipping & Delivery</h1>
        <p className="text-gray-600">Fulfilment console for order preparation and shipment</p>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Search Recipient</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Name or address..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Order Date Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Order Date</Label>
            <DatePickerWithRange
              date={orderDateRange}
              onDateChange={setOrderDateRange}
              placeholder="Select date range"
            />
          </div>

          {/* Delivery Method */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Delivery Method</Label>
            <Select value={deliveryMethodFilter} onValueChange={setDeliveryMethodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="slow">Slow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Shipment Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Shipment Status</Label>
            <Select value={shipmentStatusFilter} onValueChange={setShipmentStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending-assignment">Pending Assignment</SelectItem>
                <SelectItem value="carrier-assigned">Carrier Assigned</SelectItem>
                <SelectItem value="pickup-window-requested">Pick-Up Window Requested</SelectItem>
                <SelectItem value="pickup-scheduled">Pick-Up Scheduled</SelectItem>
                <SelectItem value="picked-up">Picked Up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Carrier Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Carrier</Label>
            <Select value={carrierFilter} onValueChange={setCarrierFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All carriers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Carriers</SelectItem>
                {carriers.map(carrier => (
                  <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Requested Pick-Up Window */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Requested Pick-Up Window</Label>
            <DatePickerWithRange
              date={requestedPickupDateRange}
              onDateChange={setRequestedPickupDateRange}
              placeholder="Select date range"
            />
          </div>

          {/* Confirmed Pick-Up Slot */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Confirmed Pick-Up Slot</Label>
            <DatePickerWithRange
              date={confirmedPickupDateRange}
              onDateChange={setConfirmedPickupDateRange}
              placeholder="Select date range"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex justify-between items-center">
        {selectedOrders.size > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {selectedOrders.size} orders selected
            </span>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Mark as Picked Up
            </Button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
                    } else {
                      setSelectedOrders(new Set());
                    }
                  }}
                />
              </TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Gift Box Name</TableHead>
              <TableHead>Gift Items</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Delivery Method</TableHead>
              <TableHead>Requested Pick-Up Window</TableHead>
              <TableHead>Confirmed Pick-Up Slot</TableHead>
              <TableHead>Shipment Status</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.slice(0, 10).map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.has(order.id)}
                    onCheckedChange={() => toggleOrderSelection(order.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{format(order.orderDate, 'MMM d, yyyy')}</TableCell>
                <TableCell>{order.giftBoxName}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openGiftItemsModal(order.giftItems)}
                    className="h-8"
                  >
                    <Badge variant="secondary" className="mr-2">
                      {order.giftItems.reduce((total, item) => total + item.quantity, 0)}
                    </Badge>
                    Items
                  </Button>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.recipientName}</div>
                    <div className="text-sm text-gray-500">{order.recipientAddress}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{getDeliveryMethodLabel(order.deliveryMethod)}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{order.requestedPickUpWindow || '-'}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{order.confirmedPickUpSlot || '-'}</div>
                </TableCell>
                <TableCell>{getShipmentStatusBadge(order.shipmentStatus)}</TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{order.carrier || '-'}</div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {order.shipmentStatus === 'pending-assignment' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedOrderForCarrier(order);
                            setPickupAddress(order.pickupAddress || "123 Warehouse St, San Francisco, CA 94107");
                            setIsCarrierModalOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-8"
                        >
                          Assign Carrier
                        </Button>
                        <Button size="sm" disabled variant="outline" className="text-xs px-3 py-1 h-8">
                          Schedule Pick-Up
                        </Button>
                      </>
                    )}
                    {order.shipmentStatus === 'carrier-assigned' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedOrderForCarrier(order);
                            setPickupAddress(order.pickupAddress || "123 Warehouse St, San Francisco, CA 94107");
                            setIsCarrierModalOpen(true);
                          }}
                          className="text-xs px-3 py-1 h-8"
                        >
                          Change Carrier
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedOrderForPickup(order);
                            setIsPickupScheduleModalOpen(true);
                          }}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 h-8"
                        >
                          Schedule Pick-Up
                        </Button>
                      </>
                    )}
                    {order.shipmentStatus === 'pickup-window-requested' && (
                      <>
                        <Button size="sm" disabled variant="outline" className="text-xs px-3 py-1 h-8">
                          Change Carrier
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedOrderForConfirm(order);
                            setIsConfirmPickupModalOpen(true);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-8"
                        >
                          Confirm Pick-Up Slot
                        </Button>
                      </>
                    )}
                    {order.shipmentStatus === 'pickup-scheduled' && (
                      <>
                        <Button size="sm" disabled variant="outline" className="text-xs px-3 py-1 h-8">
                          Change Carrier
                        </Button>
                        <Badge className="bg-green-100 text-green-800 border-green-300 text-xs px-2 py-1">
                          Ready for Pick-Up
                        </Badge>
                      </>
                    )}
                    {order.shipmentStatus === 'picked-up' && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs px-2 py-1">
                        Picked Up
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-500">
        Showing {Math.min(10, filteredOrders.length)} of {filteredOrders.length} orders
      </div>

      {/* Gift Items Modal */}
      <Dialog open={isGiftItemsModalOpen} onOpenChange={setIsGiftItemsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gift Items Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedGiftItems?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Gift className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{item.name}</span>
                </div>
                <Badge variant="outline">Qty: {item.quantity}</Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Carrier Assignment Modal with pre-filled pickup address */}
      <Dialog open={isCarrierModalOpen} onOpenChange={setIsCarrierModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedOrderForCarrier?.carrier ? 'Change Carrier' : 'Assign Carrier'}
            </DialogTitle>
          </DialogHeader>
          {selectedOrderForCarrier && (
            <div className="space-y-6">
              {/* Shipment Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Shipment Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Order ID:</span> {selectedOrderForCarrier.id}
                  </div>
                  <div>
                    <span className="font-medium">Gift Box:</span> {selectedOrderForCarrier.giftBoxName}
                  </div>
                  <div>
                    <span className="font-medium">Recipient:</span> {selectedOrderForCarrier.recipientName}
                  </div>
                  <div>
                    <span className="font-medium">Delivery Method:</span> {getDeliveryMethodLabel(selectedOrderForCarrier.deliveryMethod)}
                  </div>
                </div>
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="font-medium">Pickup Address</Label>
                  <Input 
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Enter pickup address..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">Delivery Address</Label>
                  <Input 
                    value={selectedOrderForCarrier.recipientAddress}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>

              {/* Carrier Options - only show if pickup address is entered */}
              {pickupAddress && (
                <div>
                  <h3 className="font-semibold mb-3">Available Carriers</h3>
                  <div className="space-y-2">
                    {carriers.map(carrier => {
                      const pricing = selectedOrderForCarrier.carrierPricing?.[carrier];
                      return (
                        <div key={carrier} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Truck className="h-4 w-4" />
                            <span className="font-medium">{carrier}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {pricing && <span className="text-sm text-gray-600">${pricing.toFixed(2)}</span>}
                            <Button 
                              size="sm"
                              onClick={() => {
                                setOrders(orders.map(order => 
                                  order.id === selectedOrderForCarrier.id 
                                    ? { ...order, carrier, pickupAddress, shipmentStatus: 'carrier-assigned' }
                                    : order
                                ));
                                setIsCarrierModalOpen(false);
                              }}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Select
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Pick-Up Modal */}
      <Dialog open={isPickupScheduleModalOpen} onOpenChange={setIsPickupScheduleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Pick-Up Window</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-medium">Pick-Up Time Slot</h3>
              
              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From (Start time)</Label>
                  <Input 
                    type="time" 
                    value={pickupStartTime}
                    onChange={(e) => setPickupStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>To (End time)</Label>
                  <Input 
                    type="time" 
                    value={pickupEndTime}
                    onChange={(e) => setPickupEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsPickupScheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (selectedOrderForPickup) {
                    const pickupWindow = `${pickupDate} ${pickupStartTime} - ${pickupEndTime}`;
                    setOrders(orders.map(order => 
                      order.id === selectedOrderForPickup.id 
                        ? { 
                            ...order, 
                            requestedPickUpWindow: pickupWindow,
                            shipmentStatus: 'pickup-window-requested'
                          }
                        : order
                    ));
                    setIsPickupScheduleModalOpen(false);
                    setPickupDate("");
                    setPickupStartTime("");
                    setPickupEndTime("");
                  }
                }}
                disabled={!pickupDate || !pickupStartTime || !pickupEndTime}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Schedule Pick-Up
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Pick-Up Slot Modal */}
      <Dialog open={isConfirmPickupModalOpen} onOpenChange={setIsConfirmPickupModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Pick-Up Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-medium">Pick-Up Time Slot</h3>
              
              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={confirmPickupDate}
                  onChange={(e) => setConfirmPickupDate(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From (Start time)</Label>
                  <Input 
                    type="time" 
                    value={confirmPickupStartTime}
                    onChange={(e) => setConfirmPickupStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>To (End time)</Label>
                  <Input 
                    type="time" 
                    value={confirmPickupEndTime}
                    onChange={(e) => setConfirmPickupEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsConfirmPickupModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (selectedOrderForConfirm) {
                    const confirmedSlot = `${confirmPickupDate} ${confirmPickupStartTime} - ${confirmPickupEndTime}`;
                    setOrders(orders.map(order => 
                      order.id === selectedOrderForConfirm.id 
                        ? { 
                            ...order, 
                            confirmedPickUpSlot: confirmedSlot,
                            shipmentStatus: 'pickup-scheduled'
                          }
                        : order
                    ));
                    setIsConfirmPickupModalOpen(false);
                    setConfirmPickupDate("");
                    setConfirmPickupStartTime("");
                    setConfirmPickupEndTime("");
                  }
                }}
                disabled={!confirmPickupDate || !confirmPickupStartTime || !confirmPickupEndTime}
                className="bg-green-600 hover:bg-green-700"
              >
                Confirm Pick-Up
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminShippingDelivery;
