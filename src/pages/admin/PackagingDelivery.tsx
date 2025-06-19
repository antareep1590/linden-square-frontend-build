
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
import { Package, Truck, Clock, CheckCircle, MapPin, User, Gift, Calendar } from "lucide-react";

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
    shipmentStatus: 'picked-up',
    carrier: "UPS",
    packer: "Sarah Wilson",
    requestedPickUpWindow: "Dec 15, 2023 2:00 PM - 4:00 PM",
    confirmedPickUpSlot: "Dec 15, 2023 3:30 PM",
    orderDate: new Date("2023-10-20"),
    carrierPricing: { "UPS": 12.99, "USPS": 10.50 }
  }
];

const carriers = ["FedEx", "UPS", "USPS", "DHL"];
const packers = ["John Smith", "Sarah Wilson", "Mike Johnson", "Lisa Davis"];

const AdminShippingDelivery = () => {
  const [orders, setOrders] = useState<ShippingOrder[]>(mockShippingOrders);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [packerFilter, setPackerFilter] = useState("all");
  const [selectedGiftItems, setSelectedGiftItems] = useState<{ name: string; quantity: number }[] | null>(null);
  const [isGiftItemsModalOpen, setIsGiftItemsModalOpen] = useState(false);
  
  // Carrier Assignment Modal
  const [isCarrierModalOpen, setIsCarrierModalOpen] = useState(false);
  const [selectedOrderForCarrier, setSelectedOrderForCarrier] = useState<ShippingOrder | null>(null);
  
  // Pick-up Schedule Modal
  const [isPickupScheduleModalOpen, setIsPickupScheduleModalOpen] = useState(false);
  const [selectedOrderForPickup, setSelectedOrderForPickup] = useState<ShippingOrder | null>(null);
  const [pickupStartTime, setPickupStartTime] = useState("");
  const [pickupEndTime, setPickupEndTime] = useState("");
  
  // Confirm Pick-up Slot Modal
  const [isConfirmPickupModalOpen, setIsConfirmPickupModalOpen] = useState(false);
  const [selectedOrderForConfirm, setSelectedOrderForConfirm] = useState<ShippingOrder | null>(null);
  const [confirmedPickupTime, setConfirmedPickupTime] = useState("");

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
      "pending-assignment": { color: "bg-gray-500", label: "Pending Assignment" },
      "carrier-assigned": { color: "bg-blue-500", label: "Carrier Assigned" },
      "pickup-window-requested": { color: "bg-yellow-500", label: "Pick-Up Window Requested" },
      "pickup-scheduled": { color: "bg-green-500", label: "Pick-Up Scheduled" },
      "picked-up": { color: "bg-purple-500", label: "Picked Up" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} text-white border-0`}>
        {config.label}
      </Badge>
    );
  };

  const handleCarrierAssignment = (orderId: string, carrier: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, carrier, shipmentStatus: 'carrier-assigned' as const }
        : order
    ));
    setIsCarrierModalOpen(false);
  };

  const handleSchedulePickup = (orderId: string) => {
    const pickupWindow = `${pickupStartTime} - ${pickupEndTime}`;
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            requestedPickUpWindow: pickupWindow,
            shipmentStatus: 'pickup-window-requested' as const
          }
        : order
    ));
    setIsPickupScheduleModalOpen(false);
    setPickupStartTime("");
    setPickupEndTime("");
  };

  const handleConfirmPickup = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            confirmedPickUpSlot: confirmedPickupTime,
            shipmentStatus: 'pickup-scheduled' as const
          }
        : order
    ));
    setIsConfirmPickupModalOpen(false);
    setConfirmedPickupTime("");
  };

  const handleMarkAsPickedUp = () => {
    setOrders(orders.map(order => 
      selectedOrders.has(order.id) 
        ? { ...order, shipmentStatus: 'picked-up' as const }
        : order
    ));
    setSelectedOrders(new Set());
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "all" || order.shipmentStatus === statusFilter;
    const matchesCarrier = carrierFilter === "all" || order.carrier === carrierFilter;
    const matchesPacker = packerFilter === "all" || order.packer === packerFilter;
    return matchesStatus && matchesCarrier && matchesPacker;
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

  const getTotalGiftItems = (giftItems: { name: string; quantity: number }[]) => {
    return giftItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getActionButtons = (order: ShippingOrder) => {
    switch (order.shipmentStatus) {
      case 'pending-assignment':
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => {
                setSelectedOrderForCarrier(order);
                setIsCarrierModalOpen(true);
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Assign Carrier
            </Button>
            <Button size="sm" disabled variant="outline">
              Schedule Pick-Up
            </Button>
          </div>
        );
      
      case 'carrier-assigned':
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setSelectedOrderForCarrier(order);
                setIsCarrierModalOpen(true);
              }}
            >
              Change Carrier
            </Button>
            <Button 
              size="sm"
              onClick={() => {
                setSelectedOrderForPickup(order);
                setIsPickupScheduleModalOpen(true);
              }}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              Schedule Pick-Up
            </Button>
          </div>
        );
      
      case 'pickup-window-requested':
        return (
          <div className="flex gap-2">
            <Button size="sm" disabled variant="outline">
              Change Carrier
            </Button>
            <Button 
              size="sm"
              onClick={() => {
                setSelectedOrderForConfirm(order);
                setIsConfirmPickupModalOpen(true);
              }}
              className="bg-green-500 hover:bg-green-600"
            >
              Confirm Pick-Up Slot
            </Button>
          </div>
        );
      
      case 'pickup-scheduled':
        return (
          <div className="flex gap-2">
            <Button size="sm" disabled variant="outline">
              Change Carrier
            </Button>
            <Badge className="bg-green-500 text-white">
              Ready for Pick-Up
            </Badge>
          </div>
        );
      
      case 'picked-up':
        return (
          <Badge className="bg-purple-500 text-white">
            Picked Up
          </Badge>
        );
      
      default:
        return null;
    }
  };

  const canMarkAsPickedUp = selectedOrders.size > 0 && 
    Array.from(selectedOrders).every(orderId => {
      const order = orders.find(o => o.id === orderId);
      return order?.shipmentStatus === 'pickup-scheduled';
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Shipping & Delivery</h1>
        <p className="text-gray-600">Fulfilment console for order preparation and shipment</p>
      </div>

      {/* Filters */}
      <div className="bg-muted/20 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Shipment Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
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

          <div className="space-y-2">
            <Label className="text-sm font-medium">Carrier</Label>
            <Select value={carrierFilter} onValueChange={setCarrierFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Carriers</SelectItem>
                {carriers.map(carrier => (
                  <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Packer</Label>
            <Select value={packerFilter} onValueChange={setPackerFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by packer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packers</SelectItem>
                {packers.map(packer => (
                  <SelectItem key={packer} value={packer}>{packer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Order Date</Label>
            <Input type="date" placeholder="Filter by date" />
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
            {canMarkAsPickedUp && (
              <Button onClick={handleMarkAsPickedUp} className="bg-purple-500 hover:bg-purple-600">
                Mark as Picked Up
              </Button>
            )}
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
                  checked={selectedOrders.size === filteredOrders.length}
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
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.has(order.id)}
                    onCheckedChange={() => toggleOrderSelection(order.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.giftBoxName}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openGiftItemsModal(order.giftItems)}
                    className="h-8"
                  >
                    <Badge variant="secondary" className="mr-2">
                      {getTotalGiftItems(order.giftItems)}
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
                  {getActionButtons(order)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

      {/* Carrier Assignment Modal */}
      <Dialog open={isCarrierModalOpen} onOpenChange={setIsCarrierModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Carrier</DialogTitle>
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
                  <div className="col-span-2">
                    <span className="font-medium">Address:</span> {selectedOrderForCarrier.recipientAddress}
                  </div>
                </div>
              </div>

              {/* Carrier Options */}
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
                            onClick={() => handleCarrierAssignment(selectedOrderForCarrier.id, carrier)}
                          >
                            Select
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input 
                type="datetime-local" 
                value={pickupStartTime}
                onChange={(e) => setPickupStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input 
                type="datetime-local" 
                value={pickupEndTime}
                onChange={(e) => setPickupEndTime(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsPickupScheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => selectedOrderForPickup && handleSchedulePickup(selectedOrderForPickup.id)}
                disabled={!pickupStartTime || !pickupEndTime}
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
            <div className="space-y-2">
              <Label>Confirmed Pick-Up Time</Label>
              <Input 
                type="datetime-local" 
                value={confirmedPickupTime}
                onChange={(e) => setConfirmedPickupTime(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsConfirmPickupModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => selectedOrderForConfirm && handleConfirmPickup(selectedOrderForConfirm.id)}
                disabled={!confirmedPickupTime}
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
