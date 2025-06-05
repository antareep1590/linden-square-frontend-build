
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Package, Truck, Clock, CheckCircle, AlertCircle, Eye, MapPin, Calendar, ChevronDown, ChevronRight, User } from "lucide-react";
import OrderDetailsModal from "@/components/tracking/OrderDetailsModal";

interface SubOrder {
  recipientName: string;
  recipientEmail: string;
  shippingAddress: string;
  deliveryStatus: string;
  estimatedDelivery: string;
  giftBoxContents: string[];
}

interface Order {
  id: string;
  recipientCount: number;
  shipDate: Date;
  carrier: string;
  trackingLink: string;
  status: string;
  items: string;
  shippingAddress: string;
  estimatedDelivery: string;
  subOrders: SubOrder[];
}

const mockOrders: Order[] = [
  {
    id: "ORD-2023-001",
    shipDate: new Date("2023-11-15"),
    items: "Premium Gift Box Set",
    shippingAddress: "Multiple Recipients",
    status: "shipped",
    estimatedDelivery: "2023-11-20",
    recipientCount: 3,
    carrier: "FedEx",
    trackingLink: "https://fedex.com/track/TRACK12345",
    subOrders: [
      {
        recipientName: "John Smith",
        recipientEmail: "john@company.com",
        shippingAddress: "123 Main St, Anytown, CA 12345",
        deliveryStatus: "delivered",
        estimatedDelivery: "2023-11-18",
        giftBoxContents: ["Premium Coffee Set", "Gourmet Chocolate Box", "Scented Candle"]
      },
      {
        recipientName: "Sarah Johnson",
        recipientEmail: "sarah@partner.com",
        shippingAddress: "456 Oak Ave, Somewhere, NY 67890",
        deliveryStatus: "in-transit",
        estimatedDelivery: "2023-11-20",
        giftBoxContents: ["Premium Coffee Set", "Gourmet Chocolate Box", "Scented Candle"]
      },
      {
        recipientName: "Mike Wilson",
        recipientEmail: "mike@team.com",
        shippingAddress: "789 Pine Rd, Nowhere, TX 54321",
        deliveryStatus: "processing",
        estimatedDelivery: "2023-11-22",
        giftBoxContents: ["Premium Coffee Set", "Gourmet Chocolate Box", "Scented Candle"]
      }
    ]
  },
  {
    id: "ORD-2023-002",
    shipDate: new Date("2023-11-10"),
    items: "Custom Corporate Gifts",
    shippingAddress: "456 Elm St, Anytown USA",
    status: "processing",
    estimatedDelivery: "2023-11-22",
    recipientCount: 1,
    carrier: "UPS",
    trackingLink: "https://ups.com/track/TRACK67890",
    subOrders: [
      {
        recipientName: "Emily Davis",
        recipientEmail: "emily@corp.com",
        shippingAddress: "456 Elm St, Anytown, USA 12345",
        deliveryStatus: "processing",
        estimatedDelivery: "2023-11-22",
        giftBoxContents: ["Tech Accessories Kit", "Premium Notebook Set", "Wellness Kit"]
      }
    ]
  }
];

const TrackOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      "shipped": "bg-blue-500 text-white border-0",
      "delivered": "bg-green-500 text-white border-0",
      "processing": "bg-amber-500 text-white border-0",
      "pending": "bg-gray-500 text-white border-0",
      "in-transit": "bg-blue-600 text-white border-0"
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-500 text-white border-0"}>
        {status === "in-transit" ? "In Transit" : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Track Orders</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-muted/20 p-4 rounded-lg">
        <div className="flex-1">
          <Input
            placeholder="Search by order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Estimated Delivery</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                {/* Main Order Row */}
                <TableRow className="hover:bg-gray-50">
                  <TableCell>
                    {order.recipientCount > 1 && (
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
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{formatDate(order.shipDate)}</TableCell>
                  <TableCell>{order.recipientCount} recipient{order.recipientCount > 1 ? 's' : ''}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
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
                
                {/* Sub-order Rows */}
                {expandedOrders.has(order.id) && order.subOrders.map((subOrder, index) => (
                  <TableRow key={`${order.id}-${index}`} className="bg-gray-50/50 border-l-4 border-l-blue-200">
                    <TableCell></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 pl-4">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{subOrder.recipientName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">{subOrder.recipientEmail}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {subOrder.shippingAddress}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(subOrder.deliveryStatus)}</TableCell>
                    <TableCell>{formatDate(subOrder.estimatedDelivery)}</TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-500">
                        {subOrder.giftBoxContents.length} items
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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

export default TrackOrders;
