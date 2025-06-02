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
  deliveryDate: string;
  trackingNumber: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD-2023-001",
    date: "2023-11-01",
    items: "Premium Gift Box Set x25",
    shippingAddress: "123 Highland, Some Crrek, GA 30303",
    status: "delivered",
    deliveryDate: "2023-11-05",
    trackingNumber: "TRACK12345"
  },
  {
    id: "ORD-2023-002",
    date: "2023-10-28",
    items: "Custom Notebooks x50, Coffee Mugs x50",
    shippingAddress: "456 Lowland, Atl, GA 30303",
    status: "shipped",
    deliveryDate: "2023-11-08",
    trackingNumber: "TRACK54321"
  },
  {
    id: "ORD-2023-003",
    date: "2023-10-20",
    items: "Executive Gift Package x40",
    shippingAddress: "789 Flatiron, Hapeville, GA 30303",
    status: "processing",
    deliveryDate: "2023-11-10",
    trackingNumber: "TRACK98765"
  },
  {
    id: "ORD-2023-004",
    date: "2023-11-02",
    items: "Welcome Kit x15",
    shippingAddress: "987 Midtown, Atl, GA 30303",
    status: "pending",
    deliveryDate: "2023-11-12",
    trackingNumber: "TRACK67890"
  }
];

const AdminTrackOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase());
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
            placeholder="Search by order ID or shipping address..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
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
              <TableHead>Delivery Date</TableHead>
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
                    order.status === "pending" 
                      ? "bg-gray-500 text-white border-0"
                      : order.status === "processing" 
                      ? "bg-amber-500 text-white border-0"
                      : order.status === "shipped"
                      ? "bg-blue-500 text-white border-0"
                      : "bg-green-500 text-white border-0"
                  }>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(order.deliveryDate)}</TableCell>
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

export default AdminTrackOrders;
