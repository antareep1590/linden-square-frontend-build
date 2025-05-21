
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Order status types
type OrderStatus = "delivered" | "in-transit" | "processing" | "pending";

// Mock order data
const orders = [
  {
    id: "ORD-2023-1001",
    recipientCount: 15,
    shipDate: new Date("2023-11-10"),
    carrier: "FedEx",
    trackingLink: "https://www.fedex.com/tracking",
    status: "delivered" as OrderStatus
  },
  {
    id: "ORD-2023-1002",
    recipientCount: 8,
    shipDate: new Date("2023-11-15"),
    carrier: "UPS",
    trackingLink: "https://www.ups.com/tracking",
    status: "in-transit" as OrderStatus
  },
  {
    id: "ORD-2023-1003",
    recipientCount: 22,
    shipDate: new Date("2023-11-20"),
    carrier: "USPS",
    trackingLink: "https://tools.usps.com/go/TrackConfirmAction",
    status: "processing" as OrderStatus
  },
  {
    id: "ORD-2023-1004",
    recipientCount: 5,
    shipDate: new Date("2023-11-25"),
    carrier: "DHL",
    trackingLink: "https://www.dhl.com/tracking",
    status: "pending" as OrderStatus
  }
];

const getStatusBadgeStyle = (status: OrderStatus) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "in-transit":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "pending":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    default:
      return "";
  }
};

const TrackOrders = () => {
  const [date, setDate] = useState<Date>();
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [search, setSearch] = useState("");
  
  // Filter orders based on selected filters
  const filterOrders = () => {
    let result = [...orders];
    
    if (date) {
      result = result.filter(order => 
        order.shipDate.toDateString() === date.toDateString()
      );
    }
    
    if (selectedCarrier) {
      result = result.filter(order => order.carrier === selectedCarrier);
    }
    
    if (selectedStatus) {
      result = result.filter(order => order.status === selectedStatus);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredOrders(result);
  };

  // Reset filters
  const resetFilters = () => {
    setDate(undefined);
    setSelectedCarrier("");
    setSelectedStatus("");
    setSearch("");
    setFilteredOrders(orders);
  };

  // Apply filters when any filter changes
  React.useEffect(() => {
    filterOrders();
  }, [date, selectedCarrier, selectedStatus, search]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Track Orders</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-lg">
        {/* Date Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Ship Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Carrier Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Carrier</label>
          <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Carriers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Carriers</SelectItem>
              <SelectItem value="FedEx">FedEx</SelectItem>
              <SelectItem value="UPS">UPS</SelectItem>
              <SelectItem value="USPS">USPS</SelectItem>
              <SelectItem value="DHL">DHL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search by Order ID</label>
          <div className="flex space-x-2">
            <Input 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Recipient Count</TableHead>
              <TableHead>Ship Date</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Tracking Link</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.recipientCount}</TableCell>
                  <TableCell>{format(order.shipDate, "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4" /> 
                      {order.carrier}
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={order.trackingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Track
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeStyle(order.status)} variant="outline">
                      {order.status === "in-transit" ? "In Transit" : 
                       order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No orders found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TrackOrders;
