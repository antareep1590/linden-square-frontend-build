
import React, { useState, useEffect } from 'react';
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
import { Eye, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { deliveryStatusService, type DeliveryStatus } from "@/services/deliveryStatusService";

// Mock data for orders
const orders = [
  {
    id: "ORD-2023-001",
    client: "Acme Corporation",
    items: "Premium Gift Box Set x25",
    status: "processing",
    createdDate: "2023-11-01",
    estimatedDelivery: "2023-11-08",
    trackingNumber: "1Z999AA1234567890"
  },
  {
    id: "ORD-2023-002", 
    client: "Tech Innovations",
    items: "Custom Notebooks x50, Coffee Mugs x50",
    status: "shipped",
    createdDate: "2023-10-28",
    estimatedDelivery: "2023-11-03",
    trackingNumber: "1Z999BB1234567891"
  },
  {
    id: "ORD-2023-003",
    client: "Global Consulting",
    items: "Executive Gift Package x40",
    status: "delivered",
    createdDate: "2023-10-20",
    estimatedDelivery: "2023-10-27",
    trackingNumber: "1Z999CC1234567892"
  },
  {
    id: "ORD-2023-004",
    client: "StartupX",
    items: "Welcome Kit x15",
    status: "pending",
    createdDate: "2023-11-02",
    estimatedDelivery: "2023-11-10",
    trackingNumber: ""
  },
  {
    id: "ORD-2023-005",
    client: "MegaCorp",
    items: "Holiday Collection x100",
    status: "cancelled",
    createdDate: "2023-10-15",
    estimatedDelivery: "",
    trackingNumber: ""
  }
];

const statusConfig = {
  pending: { color: 'bg-yellow-500', icon: Clock, label: 'Pending' },
  processing: { color: 'bg-blue-500', icon: Package, label: 'Processing' },
  shipped: { color: 'bg-purple-500', icon: Truck, label: 'Shipped' },
  delivered: { color: 'bg-green-500', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-500', icon: AlertCircle, label: 'Cancelled' }
};

const AdminTrackOrders = () => {
  const [ordersState, setOrdersState] = useState(orders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Subscribe to delivery status updates
  useEffect(() => {
    const unsubscribe = deliveryStatusService.subscribe((update) => {
      setOrdersState(prevOrders => 
        prevOrders.map(order => 
          order.id === update.orderId 
            ? { ...order, status: update.status }
            : order
        )
      );
    });

    return unsubscribe;
  }, []);

  const filteredOrders = ordersState.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
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
            placeholder="Search by order ID or client name..."
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
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Est. Delivery</TableHead>
              <TableHead>Tracking Number</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.client}</TableCell>
                <TableCell className="max-w-xs truncate">{order.items}</TableCell>
                <TableCell>
                  <Badge className={`${statusConfig[order.status as keyof typeof statusConfig].color} text-white border-0`}>
                    {statusConfig[order.status as keyof typeof statusConfig].label}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(order.createdDate)}</TableCell>
                <TableCell>{formatDate(order.estimatedDelivery)}</TableCell>
                <TableCell className="font-mono text-sm">
                  {order.trackingNumber || "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Details</p>
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

      {filteredOrders.length === 0 && (
        <div className="text-center py-10">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No orders found</h3>
          <p className="text-gray-500">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdminTrackOrders;
