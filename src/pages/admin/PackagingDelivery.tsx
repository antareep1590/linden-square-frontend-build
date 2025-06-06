
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
import { Package, Truck, Clock, CheckCircle, MapPin, User, Gift } from "lucide-react";

interface PackagingOrder {
  id: string;
  giftBoxName: string;
  giftItems: { name: string; quantity: number }[];
  recipientName: string;
  recipientAddress: string;
  status: 'ready-to-pack' | 'packed' | 'handed-to-carrier' | 'in-transit' | 'delivered';
  carrier?: string;
  packer?: string;
  orderDate: Date;
}

const mockPackagingOrders: PackagingOrder[] = [
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
    status: "ready-to-pack",
    carrier: "FedEx",
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
    status: "packed",
    carrier: "FedEx",
    packer: "John Smith",
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
    status: "in-transit",
    carrier: "UPS",
    packer: "Sarah Wilson",
    orderDate: new Date("2023-10-20")
  }
];

const carriers = ["FedEx", "UPS", "USPS", "DHL"];
const packers = ["John Smith", "Sarah Wilson", "Mike Johnson", "Lisa Davis"];

const AdminPackagingDelivery = () => {
  const [orders, setOrders] = useState<PackagingOrder[]>(mockPackagingOrders);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [packerFilter, setPackerFilter] = useState("all");
  const [selectedGiftItems, setSelectedGiftItems] = useState<{ name: string; quantity: number }[] | null>(null);
  const [isGiftItemsModalOpen, setIsGiftItemsModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "ready-to-pack": { color: "bg-amber-500", label: "Ready to Pack" },
      "packed": { color: "bg-blue-500", label: "Packed" },
      "handed-to-carrier": { color: "bg-purple-500", label: "Handed to Carrier" },
      "in-transit": { color: "bg-green-500", label: "In Transit" },
      "delivered": { color: "bg-gray-500", label: "Delivered" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} text-white border-0`}>
        {config.label}
      </Badge>
    );
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus as PackagingOrder['status'] }
        : order
    ));
  };

  const handlePackerUpdate = (orderId: string, packer: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, packer } : order
    ));
  };

  const handleBulkPackerUpdate = (packer: string) => {
    setOrders(orders.map(order => 
      selectedOrders.has(order.id) ? { ...order, packer } : order
    ));
    setSelectedOrders(new Set());
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Packaging & Delivery</h1>
        <p className="text-gray-600">Fulfilment console for order preparation and shipment</p>
      </div>

      {/* Filters with Labels */}
      <div className="bg-muted/20 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ready-to-pack">Ready to Pack</SelectItem>
                <SelectItem value="packed">Packed</SelectItem>
                <SelectItem value="handed-to-carrier">Handed to Carrier</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
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
      {selectedOrders.size > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedOrders.size} orders selected
              </span>
              <Select onValueChange={handleBulkPackerUpdate}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Assign packer" />
                </SelectTrigger>
                <SelectContent>
                  {packers.map(packer => (
                    <SelectItem key={packer} value={packer}>{packer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <TableHead>Gift Items & Quantity</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Packer</TableHead>
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
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{order.carrier}</div>
                </TableCell>
                <TableCell>
                  <Select 
                    value={order.packer || ""} 
                    onValueChange={(value) => handlePackerUpdate(order.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {packers.map(packer => (
                        <SelectItem key={packer} value={packer}>{packer}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {order.status === 'ready-to-pack' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(order.id, 'packed')}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Mark Packed
                      </Button>
                    )}
                    {order.status === 'packed' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(order.id, 'handed-to-carrier')}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        Hand to Carrier
                      </Button>
                    )}
                    {order.status === 'handed-to-carrier' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(order.id, 'delivered')}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Mark Delivered
                      </Button>
                    )}
                    {order.status === 'delivered' && (
                      <Badge className="bg-gray-500 text-white">
                        Delivered
                      </Badge>
                    )}
                  </div>
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
    </div>
  );
};

export default AdminPackagingDelivery;
