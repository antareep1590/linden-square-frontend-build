
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Truck, Clock, CheckCircle, AlertCircle, Eye, MapPin, Calendar, Gift } from "lucide-react";

interface Order {
  id: string;
  giftBoxName: string;
  giftBoxItems: string;
  recipientCount: number;
  shipDate: Date;
  status: string;
  shippingAddress: string;
  deliveryDate: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD-2023-001",
    giftBoxName: "Premium Gift Box Set",
    giftBoxItems: "Premium Coffee Set, Luxury Notebook, Wellness Kit",
    shipDate: new Date("2023-11-01"),
    shippingAddress: "123 Highland, Some Creek, GA 30303",
    status: "delivered",
    deliveryDate: "2023-11-05",
    recipientCount: 25
  },
  {
    id: "ORD-2023-002",
    giftBoxName: "Custom Corporate Box",
    giftBoxItems: "Custom Notebooks, Coffee Mugs, Tech Accessories",
    shipDate: new Date("2023-10-28"),
    shippingAddress: "456 Lowland, Atl, GA 30303",
    status: "shipped",
    deliveryDate: "2023-11-08",
    recipientCount: 50
  },
  {
    id: "ORD-2023-003",
    giftBoxName: "Executive Gift Package",
    giftBoxItems: "Wellness Kit, Premium Coffee Set, Artisan Tea Collection",
    shipDate: new Date("2023-10-20"),
    shippingAddress: "789 Flatiron, Hapeville, GA 30303",
    status: "processing",
    deliveryDate: "2023-11-10",
    recipientCount: 40
  },
  {
    id: "ORD-2023-004",
    giftBoxName: "Welcome Kit",
    giftBoxItems: "Gourmet Chocolate Box, Scented Candle, Tech Accessories Kit",
    shipDate: new Date("2023-11-02"),
    shippingAddress: "987 Midtown, Atl, GA 30303",
    status: "pending",
    deliveryDate: "2023-11-12",
    recipientCount: 15
  }
];

const TrackOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.giftBoxName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
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
            placeholder="Search by order ID, gift box name, or shipping address..."
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
              <TableHead>Gift Box Items</TableHead>
              <TableHead>Recipients</TableHead>
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
                <TableCell>{formatDate(order.shipDate)}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="flex items-start gap-2">
                    <Gift className="h-4 w-4 text-linden-blue mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{order.giftBoxName}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">({order.giftBoxItems})</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span>{order.recipientCount}</span>
                  </div>
                </TableCell>
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
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TrackOrders;
