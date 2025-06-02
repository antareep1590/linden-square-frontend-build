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
import { Package, Truck, Clock, CheckCircle, AlertCircle, Eye, MapPin, Calendar } from "lucide-react";
import OrderDetailsModal from "@/components/tracking/OrderDetailsModal";

interface Order {
  id: string;
  date: string;
  items: string;
  shippingAddress: string;
  status: 'processing' | 'shipped' | 'delivered' | 'pending';
  estimatedDelivery: string;
  trackingNumber: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD-2023-001",
    date: "2023-11-15",
    items: "Premium Gift Box Set",
    shippingAddress: "123 Main St, Anytown USA",
    status: "shipped",
    estimatedDelivery: "2023-11-20",
    trackingNumber: "TRACK12345"
  },
  {
    id: "ORD-2023-002",
    date: "2023-11-10",
    items: "Custom Corporate Gifts",
    shippingAddress: "456 Elm St, Anytown USA",
    status: "processing",
    estimatedDelivery: "2023-11-22",
    trackingNumber: "TRACK67890"
  },
  {
    id: "ORD-2023-003",
    date: "2023-11-05",
    items: "Employee Appreciation Gifts",
    shippingAddress: "789 Oak St, Anytown USA",
    status: "delivered",
    estimatedDelivery: "2023-11-09",
    trackingNumber: "TRACK10111"
  },
  {
    id: "ORD-2023-004",
    date: "2023-10-28",
    items: "Client Holiday Gifts",
    shippingAddress: "101 Pine St, Anytown USA",
    status: "pending",
    estimatedDelivery: "2023-11-15",
    trackingNumber: "TRACK12131"
  }
];

const TrackOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Shipping Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Estimated Delivery</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
                <TableCell className="max-w-xs truncate">{order.items}</TableCell>
                <TableCell className="max-w-xs truncate">{order.shippingAddress}</TableCell>
                <TableCell>
                  <Badge className={
                    order.status === "shipped" 
                      ? "bg-blue-500 text-white border-0" 
                      : order.status === "delivered"
                      ? "bg-green-500 text-white border-0"
                      : order.status === "pending"
                      ? "bg-amber-500 text-white border-0"
                      : "bg-gray-500 text-white border-0"
                  }>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
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
