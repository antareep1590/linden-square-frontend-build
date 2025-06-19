
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Package, Truck, Clock, CheckCircle, AlertCircle, Eye, MapPin, Calendar, ChevronDown, ChevronRight, User, Gift } from "lucide-react";
import OrderDetailsModal from "@/components/tracking/OrderDetailsModal";

interface Order {
  id: string;
  clientName: string;
  giftBoxName: string;
  recipientCount: number;
  orderDate: Date;
  shipDate: Date;
  carrier: string;
  trackingNumber: string;
  trackingLink: string;
  status: string;
  estimatedDelivery: string;
  deliveryType: string;
  giftItems: Array<{
    name: string;
    quantity: number;
  }>;
  recipients: Array<{
    name: string;
    email: string;
    address: string;
    status: string;
    deliveryDate?: string;
    estimatedDelivery: string;
  }>;
}

const mockOrders: Order[] = [
  {
    id: "ORD-2023-001",
    clientName: "Acme Corp",
    giftBoxName: "Premium Employee Gift",
    recipientCount: 25,
    orderDate: new Date("2023-11-01"),
    shipDate: new Date("2023-11-02"),
    status: "delivered",
    estimatedDelivery: "2023-11-05",
    carrier: "FedEx",
    trackingNumber: "12345678901",
    trackingLink: "https://fedex.com/track/12345678901",
    deliveryType: "Express Delivery (1–2 business days)",
    giftItems: [
      { name: "Luxury Candle Set", quantity: 25 },
      { name: "Premium Coffee", quantity: 25 },
      { name: "Gourmet Chocolates", quantity: 25 }
    ],
    recipients: [
      { 
        name: "John Doe", 
        email: "john@acme.com", 
        address: "123 Main St, San Francisco, CA", 
        status: "delivered", 
        deliveryDate: "2023-11-05",
        estimatedDelivery: "2023-11-05"
      },
      { 
        name: "Jane Smith", 
        email: "jane@acme.com", 
        address: "456 Oak Ave, San Francisco, CA", 
        status: "delivered", 
        deliveryDate: "2023-11-05",
        estimatedDelivery: "2023-11-05"
      },
    ]
  },
  {
    id: "ORD-2023-002",
    clientName: "Tech Innovations",
    giftBoxName: "Client Appreciation",
    recipientCount: 50,
    orderDate: new Date("2023-10-28"),
    shipDate: new Date("2023-10-29"),
    status: "in-transit",
    estimatedDelivery: "2023-11-08",
    carrier: "UPS",
    trackingNumber: "98765432109",
    trackingLink: "https://ups.com/track/98765432109",
    deliveryType: "Normal Delivery (2–3 business days)",
    giftItems: [
      { name: "Wine Bottle", quantity: 50 },
      { name: "Cheese Selection", quantity: 50 }
    ],
    recipients: [
      { 
        name: "Bob Johnson", 
        email: "bob@techinno.com", 
        address: "789 Pine St, Chicago, IL", 
        status: "in-transit",
        estimatedDelivery: "2023-11-08"
      },
      { 
        name: "Alice Brown", 
        email: "alice@techinno.com", 
        address: "321 Elm St, Chicago, IL", 
        status: "processing",
        estimatedDelivery: "2023-11-10"
      },
    ]
  },
  {
    id: "ORD-2023-003",
    clientName: "StartupX",
    giftBoxName: "Welcome Package",
    recipientCount: 15,
    orderDate: new Date("2023-10-25"),
    shipDate: new Date("2023-10-26"),
    status: "processing",
    estimatedDelivery: "2023-11-12",
    carrier: "DHL",
    trackingNumber: "55566677788",
    trackingLink: "https://dhl.com/track/55566677788",
    deliveryType: "Slow Delivery (3–5 business days)",
    giftItems: [
      { name: "Company Swag", quantity: 15 },
      { name: "Welcome Guide", quantity: 15 }
    ],
    recipients: [
      { 
        name: "Mike Wilson", 
        email: "mike@startupx.com", 
        address: "789 Broadway, Los Angeles, CA", 
        status: "processing",
        estimatedDelivery: "2023-11-12"
      },
    ]
  }
];

const deliveryTypes = ["Express Delivery (1–2 business days)", "Normal Delivery (2–3 business days)", "Slow Delivery (3–5 business days)"];

const AdminTrackOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.giftBoxName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesClient = clientFilter === "all" || order.clientName === clientFilter;
    const matchesDeliveryType = deliveryTypeFilter === "all" || order.deliveryType === deliveryTypeFilter;
    return matchesSearch && matchesStatus && matchesClient && matchesDeliveryType;
  });

  const uniqueClients = Array.from(new Set(orders.map(order => order.clientName)));

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      "delivered": "bg-green-500 text-white border-0",
      "in-transit": "bg-blue-500 text-white border-0",
      "processing": "bg-amber-500 text-white border-0",
      "delayed": "bg-red-500 text-white border-0",
      "pending": "bg-gray-500 text-white border-0"
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-500 text-white border-0"}>
        {status === "in-transit" ? "In Transit" : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTotalGiftItems = (giftItems: Array<{name: string; quantity: number}>) => {
    return giftItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Track Orders</h1>
          <p className="text-gray-600">Monitor and manage all order deliveries</p>
        </div>
      </div>

      {/* Filters with Labels */}
      <div className="bg-muted/20 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Search</Label>
            <Input
              placeholder="Search by order ID, client, or gift box name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Client</Label>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {uniqueClients.map(client => (
                  <SelectItem key={client} value={client}>{client}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Delivery Type</Label>
            <Select value={deliveryTypeFilter} onValueChange={setDeliveryTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by delivery type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Delivery Types</SelectItem>
                {deliveryTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Gift Box Name</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Gift Items</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Delivery Type</TableHead>
              <TableHead>Est. Delivery</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                {/* Main Order Row */}
                <TableRow className="hover:bg-gray-50">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="p-0 h-6 w-6"
                    >
                      {expandedOrders.has(order.id) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.clientName}</TableCell>
                  <TableCell>{order.giftBoxName}</TableCell>
                  <TableCell>{order.recipientCount} recipients</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Badge variant="secondary" className="mr-2">
                            {getTotalGiftItems(order.giftItems)}
                          </Badge>
                          Items
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Gift Items - {order.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          {order.giftItems.map((item, index) => (
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
                  </TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{order.deliveryType}</div>
                  </TableCell>
                  <TableCell>{formatDate(order.estimatedDelivery)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Order Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Recipient Details Rows - shown in expandable section but details moved to modal */}
                {expandedOrders.has(order.id) && (
                  <TableRow className="bg-blue-50/50">
                    <TableCell colSpan={11} className="p-4">
                      <div className="text-sm text-gray-600">
                        <p className="font-medium mb-2">Recipients ({order.recipients.length}):</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {order.recipients.map((recipient, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                              <User className="h-4 w-4 text-gray-500" />
                              <span>{recipient.name}</span>
                              {getStatusBadge(recipient.status)}
                            </div>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          View detailed tracking information for each recipient in the Order Details modal.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default AdminTrackOrders;
