
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Package, Truck, Clock, CheckCircle, MapPin, User, Gift, Calendar } from "lucide-react";
import { toast } from "sonner";

interface ShippingOrder {
  id: string;
  giftBoxName: string;
  giftItems: { name: string; quantity: number }[];
  recipientName: string;
  recipientAddress: string;
  status: 'pending-assignment' | 'carrier-assigned' | 'pickup-window-requested' | 'pickup-scheduled' | 'picked-up';
  deliveryMethod: 'express' | 'normal' | 'slow';
  requestedPickupWindow?: string;
  confirmedPickupSlot?: string;
  assignedCarrier?: string;
  orderDate: Date;
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
    status: "pending-assignment",
    deliveryMethod: "express",
    orderDate: new Date("2023-11-01")
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
    status: "carrier-assigned",
    deliveryMethod: "normal",
    assignedCarrier: "FedEx",
    orderDate: new Date("2023-10-28")
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
    status: "pickup-scheduled",
    deliveryMethod: "slow",
    assignedCarrier: "UPS",
    requestedPickupWindow: "Dec 15, 2023 (9:00 AM - 12:00 PM)",
    confirmedPickupSlot: "Dec 15, 2023 at 10:30 AM",
    orderDate: new Date("2023-10-20")
  }
];

const carriers = [
  { id: "fedex", name: "FedEx", deliveryMethods: ["express", "normal"], pricing: { express: 15.99, normal: 9.99 } },
  { id: "ups", name: "UPS", deliveryMethods: ["normal", "slow"], pricing: { normal: 8.99, slow: 5.99 } },
  { id: "dhl", name: "DHL", deliveryMethods: ["express"], pricing: { express: 18.99 } },
  { id: "usps", name: "USPS", deliveryMethods: ["slow"], pricing: { slow: 4.99 } }
];

const deliveryMethodLabels = {
  express: "Express Delivery (1–2 business days)",
  normal: "Normal Delivery (2–3 business days)",
  slow: "Slow Delivery (3–5 business days)"
};

const AdminShippingDelivery = () => {
  const [orders, setOrders] = useState<ShippingOrder[]>(mockShippingOrders);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState("all");
  const [deliveryMethodFilter, setDeliveryMethodFilter] = useState("all");
  
  // Modal states
  const [assignCarrierModal, setAssignCarrierModal] = useState<{ open: boolean; order: ShippingOrder | null }>({ open: false, order: null });
  const [schedulePickupModal, setSchedulePickupModal] = useState<{ open: boolean; order: ShippingOrder | null }>({ open: false, order: null });
  const [confirmPickupModal, setConfirmPickupModal] = useState<{ open: boolean; order: ShippingOrder | null }>({ open: false, order: null });
  
  // Form states
  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [pickupStartDate, setPickupStartDate] = useState("");
  const [pickupStartTime, setPickupStartTime] = useState("");
  const [pickupEndTime, setPickupEndTime] = useState("");
  const [confirmedPickupDateTime, setConfirmedPickupDateTime] = useState("");

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "pending-assignment": { color: "bg-amber-500", label: "Pending Assignment" },
      "carrier-assigned": { color: "bg-blue-500", label: "Carrier Assigned" },
      "pickup-window-requested": { color: "bg-purple-500", label: "Pick-Up Window Requested" },
      "pickup-scheduled": { color: "bg-green-500", label: "Pick-Up Scheduled" },
      "picked-up": { color: "bg-gray-500", label: "Picked Up" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} text-white border-0`}>
        {config.label}
      </Badge>
    );
  };

  const handleAssignCarrier = (order: ShippingOrder) => {
    setAssignCarrierModal({ open: true, order });
    setSelectedCarrier("");
  };

  const confirmAssignCarrier = () => {
    if (assignCarrierModal.order && selectedCarrier) {
      setOrders(orders.map(order => 
        order.id === assignCarrierModal.order!.id 
          ? { ...order, assignedCarrier: selectedCarrier, status: 'carrier-assigned' as const }
          : order
      ));
      setAssignCarrierModal({ open: false, order: null });
      toast.success("Carrier assigned successfully");
    }
  };

  const handleSchedulePickup = (order: ShippingOrder) => {
    setSchedulePickupModal({ open: true, order });
    setPickupStartDate("");
    setPickupStartTime("");
    setPickupEndTime("");
  };

  const confirmSchedulePickup = () => {
    if (schedulePickupModal.order && pickupStartDate && pickupStartTime && pickupEndTime) {
      const pickupWindow = `${pickupStartDate} (${pickupStartTime} - ${pickupEndTime})`;
      setOrders(orders.map(order => 
        order.id === schedulePickupModal.order!.id 
          ? { ...order, requestedPickupWindow: pickupWindow, status: 'pickup-window-requested' as const }
          : order
      ));
      setSchedulePickupModal({ open: false, order: null });
      toast.success("Pick-up window requested");
    }
  };

  const handleConfirmPickup = (order: ShippingOrder) => {
    setConfirmPickupModal({ open: true, order });
    setConfirmedPickupDateTime("");
  };

  const confirmPickupSlot = () => {
    if (confirmPickupModal.order && confirmedPickupDateTime) {
      setOrders(orders.map(order => 
        order.id === confirmPickupModal.order!.id 
          ? { ...order, confirmedPickupSlot: confirmedPickupDateTime, status: 'pickup-scheduled' as const }
          : order
      ));
      setConfirmPickupModal({ open: false, order: null });
      toast.success("Pick-up slot confirmed");
    }
  };

  const handleMarkAsPickedUp = () => {
    setOrders(orders.map(order => 
      selectedOrders.has(order.id) 
        ? { ...order, status: 'picked-up' as const }
        : order
    ));
    setSelectedOrders(new Set());
    toast.success("Orders marked as picked up");
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesDeliveryMethod = deliveryMethodFilter === "all" || order.deliveryMethod === deliveryMethodFilter;
    return matchesStatus && matchesDeliveryMethod;
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

  const getAvailableCarriers = (deliveryMethod: string) => {
    return carriers.filter(carrier => carrier.deliveryMethods.includes(deliveryMethod));
  };

  const renderActionButtons = (order: ShippingOrder) => {
    switch (order.status) {
      case 'pending-assignment':
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => handleAssignCarrier(order)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Assign Carrier
            </Button>
            <Button 
              size="sm" 
              disabled 
              variant="outline"
            >
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
              onClick={() => handleAssignCarrier(order)}
            >
              Change Carrier
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleSchedulePickup(order)}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Schedule Pick-Up
            </Button>
          </div>
        );
      
      case 'pickup-window-requested':
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleAssignCarrier(order)}
            >
              Change Carrier
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleConfirmPickup(order)}
              className="bg-green-500 hover:bg-green-600"
            >
              Confirm Pick-Up Slot
            </Button>
          </div>
        );
      
      case 'pickup-scheduled':
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              disabled
            >
              Change Carrier
            </Button>
            <Badge className="bg-green-100 text-green-700">
              Ready for Pick-Up
            </Badge>
          </div>
        );
      
      case 'picked-up':
        return (
          <Badge className="bg-gray-100 text-gray-700">
            Picked Up
          </Badge>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Shipping & Delivery</h1>
        <p className="text-gray-600">Manage shipment assignments, scheduling, and carrier coordination</p>
      </div>

      {/* Filters */}
      <div className="bg-muted/20 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
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
            <Label className="text-sm font-medium">Delivery Method</Label>
            <Select value={deliveryMethodFilter} onValueChange={setDeliveryMethodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by delivery method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="express">Express Delivery</SelectItem>
                <SelectItem value="normal">Normal Delivery</SelectItem>
                <SelectItem value="slow">Slow Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.size > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedOrders.size} orders selected
              </span>
              <Button 
                onClick={handleMarkAsPickedUp}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Mark as Picked Up
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
              <TableHead>Recipient</TableHead>
              <TableHead>Delivery Method</TableHead>
              <TableHead>Requested Pick-Up Window</TableHead>
              <TableHead>Confirmed Pick-Up Slot</TableHead>
              <TableHead>Shipment Status</TableHead>
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
                  <div>
                    <div className="font-medium">{order.recipientName}</div>
                    <div className="text-sm text-gray-500">{order.recipientAddress}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">
                    {deliveryMethodLabels[order.deliveryMethod]}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {order.requestedPickupWindow || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {order.confirmedPickupSlot || '-'}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  {renderActionButtons(order)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Assign Carrier Modal */}
      <Dialog open={assignCarrierModal.open} onOpenChange={(open) => setAssignCarrierModal({ open, order: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Carrier</DialogTitle>
          </DialogHeader>
          
          {assignCarrierModal.order && (
            <div className="space-y-6">
              {/* Shipment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Shipment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Order ID:</span> {assignCarrierModal.order.id}
                    </div>
                    <div>
                      <span className="font-medium">Gift Box:</span> {assignCarrierModal.order.giftBoxName}
                    </div>
                    <div>
                      <span className="font-medium">Recipient:</span> {assignCarrierModal.order.recipientName}
                    </div>
                    <div>
                      <span className="font-medium">Delivery Method:</span> {deliveryMethodLabels[assignCarrierModal.order.deliveryMethod]}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Address:</span> {assignCarrierModal.order.recipientAddress}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Carrier Options */}
              <div className="space-y-3">
                <h4 className="font-medium">Available Carriers</h4>
                <div className="grid gap-3">
                  {getAvailableCarriers(assignCarrierModal.order.deliveryMethod).map((carrier) => (
                    <div
                      key={carrier.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedCarrier === carrier.name
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCarrier(carrier.name)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Truck className="h-5 w-5 text-gray-600" />
                          <span className="font-medium">{carrier.name}</span>
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          ${carrier.pricing[assignCarrierModal.order.deliveryMethod as keyof typeof carrier.pricing]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignCarrierModal({ open: false, order: null })}>
              Cancel
            </Button>
            <Button 
              onClick={confirmAssignCarrier}
              disabled={!selectedCarrier}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Assign Carrier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Pickup Modal */}
      <Dialog open={schedulePickupModal.open} onOpenChange={(open) => setSchedulePickupModal({ open, order: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Pick-Up Window</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Pick-Up Date</Label>
              <Input 
                type="date" 
                value={pickupStartDate}
                onChange={(e) => setPickupStartDate(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input 
                  type="time" 
                  value={pickupStartTime}
                  onChange={(e) => setPickupStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input 
                  type="time" 
                  value={pickupEndTime}
                  onChange={(e) => setPickupEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSchedulePickupModal({ open: false, order: null })}>
              Cancel
            </Button>
            <Button 
              onClick={confirmSchedulePickup}
              disabled={!pickupStartDate || !pickupStartTime || !pickupEndTime}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Request Pick-Up Window
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Pickup Modal */}
      <Dialog open={confirmPickupModal.open} onOpenChange={(open) => setConfirmPickupModal({ open, order: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Pick-Up Slot</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter the final confirmed pick-up date and time (on behalf of carrier):
            </p>
            
            <div className="space-y-2">
              <Label>Confirmed Pick-Up Date & Time</Label>
              <Input 
                type="datetime-local" 
                value={confirmedPickupDateTime}
                onChange={(e) => setConfirmedPickupDateTime(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmPickupModal({ open: false, order: null })}>
              Cancel
            </Button>
            <Button 
              onClick={confirmPickupSlot}
              disabled={!confirmedPickupDateTime}
              className="bg-green-500 hover:bg-green-600"
            >
              Confirm Pick-Up Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminShippingDelivery;
