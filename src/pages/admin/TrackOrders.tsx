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
import { Package, Truck, Clock, CheckCircle, AlertCircle, Eye, MapPin, Calendar, Edit, ChevronDown, ChevronRight, User } from "lucide-react";
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
  recipients: Array<{
    name: string;
    email: string;
    address: string;
    status: string;
    deliveryDate?: string;
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
    recipients: [
      { name: "John Doe", email: "john@acme.com", address: "123 Main St, San Francisco, CA", status: "delivered", deliveryDate: "2023-11-05" },
      { name: "Jane Smith", email: "jane@acme.com", address: "456 Oak Ave, San Francisco, CA", status: "delivered", deliveryDate: "2023-11-05" },
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
    recipients: [
      { name: "Bob Johnson", email: "bob@techinno.com", address: "789 Pine St, Chicago, IL", status: "in-transit" },
      { name: "Alice Brown", email: "alice@techinno.com", address: "321 Elm St, Chicago, IL", status: "processing" },
    ]
  },
  {
    id: "ORD-2023-003",
    clientName: "Global Consulting",
    giftBoxName: "New Client Welcome",
    recipientCount: 40,
    orderDate: new Date("2023-10-20"),
    shipDate: new Date("2023-10-21"),
    status: "processing",
    estimatedDelivery: "2023-11-10",
    carrier: "DHL",
    trackingNumber: "55566677788",
    trackingLink: "https://dhl.com/track/55566677788",
    recipients: [
      { name: "Charlie Wilson", email: "charlie@global.com", address: "987 Broadway, New York, NY", status: "processing" },
    ]
  },
  {
    id: "ORD-2023-004",
    clientName: "Metro Finance",
    giftBoxName: "Executive Appreciation",
    recipientCount: 15,
    orderDate: new Date("2023-11-02"),
    shipDate: new Date("2023-11-03"),
    status: "delayed",
    estimatedDelivery: "2023-11-12",
    carrier: "USPS",
    trackingNumber: "44433322211",
    trackingLink: "https://usps.com/track/44433322211",
    recipients: [
      { name: "Diana Davis", email: "diana@metro.com", address: "555 Wall St, New York, NY", status: "delayed" },
    ]
  }
];

const AdminTrackOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.giftBoxName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesClient = clientFilter === "all" || order.clientName === clientFilter;
    return matchesSearch && matchesStatus && matchesClient;
  });

  const uniqueClients = Array.from(new Set(mockOrders.map(order => order.clientName)));

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

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // This would typically update the backend
    console.log(`Updating order ${orderId} status to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Track Orders</h1>
          <p className="text-gray-600">Monitor and manage all order deliveries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-muted/20 p-4 rounded-lg">
        <div className="flex-1">
          <Input
            placeholder="Search by order ID, client, or gift box name..."
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
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="w-48">
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
              <TableHead>Order Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Est. Delivery</TableHead>
              <TableHead>Tracking</TableHead>
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
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={order.status}
                      onValueChange={(value) => handleStatusUpdate(order.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="in-transit">In Transit</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{formatDate(order.estimatedDelivery)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{order.carrier}</div>
                      <div className="text-gray-500">{order.trackingNumber}</div>
                    </div>
                  </TableCell>
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

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Order</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Recipient Details Rows */}
                {expandedOrders.has(order.id) && order.recipients?.map((recipient, index) => (
                  <TableRow key={`${order.id}-${index}`} className="bg-gray-50/50 border-l-4 border-l-blue-200">
                    <TableCell></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 pl-4">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{recipient.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">{recipient.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {recipient.address}
                      </div>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      {recipient.deliveryDate && (
                        <div className="text-sm text-gray-600">
                          {formatDate(recipient.deliveryDate)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(recipient.status)}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-500">
                        Individual delivery
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

export default AdminTrackOrders;
