import React, { useState, useEffect } from 'react';
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
import { Calendar as CalendarIcon, Truck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OrderDetailsModal from "@/components/tracking/OrderDetailsModal";
import { deliveryStatusService, type DeliveryStatus } from "@/services/deliveryStatusService";

// Order status types
type OrderStatus = "delivered" | "in-transit" | "processing" | "pending";

// Order interface
interface Order {
  id: string;
  recipientCount: number;
  shipDate: Date;
  carrier: string;
  trackingLink: string;
  status: OrderStatus;
}

// Mock order data
const initialOrders: Order[] = [
  {
    id: "ORD-2023-1001",
    recipientCount: 15,
    shipDate: new Date("2023-11-10"),
    carrier: "FedEx",
    trackingLink: "https://www.fedex.com/tracking",
    status: "delivered"
  },
  {
    id: "ORD-2023-1002",
    recipientCount: 8,
    shipDate: new Date("2023-11-15"),
    carrier: "UPS",
    trackingLink: "https://www.ups.com/tracking",
    status: "in-transit"
  },
  {
    id: "ORD-2023-1003",
    recipientCount: 22,
    shipDate: new Date("2023-11-20"),
    carrier: "USPS",
    trackingLink: "https://tools.usps.com/go/TrackConfirmAction",
    status: "processing"
  },
  {
    id: "ORD-2023-1004",
    recipientCount: 5,
    shipDate: new Date("2023-11-25"),
    carrier: "DHL",
    trackingLink: "https://www.dhl.com/tracking",
    status: "pending"
  }
];

const getStatusBadgeStyle = (status: OrderStatus) => {
  switch (status) {
    case "delivered":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "in-transit":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "processing":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "pending":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "";
  }
};

const TrackOrders = () => {
  const [date, setDate] = useState<Date>();
  const [selectedCarrier, setSelectedCarrier] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Subscribe to delivery status updates
  useEffect(() => {
    const unsubscribe = deliveryStatusService.subscribe((update) => {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === update.orderId 
            ? { ...order, status: update.status as OrderStatus }
            : order
        )
      );
    });

    return unsubscribe;
  }, []);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  // Filter orders based on selected filters
  const filterOrders = (ordersList = orders) => {
    let result = [...ordersList];
    
    if (date) {
      result = result.filter(order => 
        order.shipDate.toDateString() === date.toDateString()
      );
    }
    
    if (dateRange?.from) {
      result = result.filter(order => 
        order.shipDate >= dateRange.from
      );
    }
    
    if (dateRange?.to) {
      result = result.filter(order => 
        order.shipDate <= dateRange.to
      );
    }
    
    if (selectedCarrier && selectedCarrier !== "all") {
      result = result.filter(order => order.carrier === selectedCarrier);
    }
    
    if (selectedStatus && selectedStatus !== "all") {
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
    setDateRange(undefined);
    setSelectedCarrier("all");
    setSelectedStatus("all");
    setSearch("");
    setFilteredOrders(orders);
  };

  // Apply filters when any filter changes
  React.useEffect(() => {
    filterOrders();
  }, [date, dateRange, selectedCarrier, selectedStatus, search, orders]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Track Orders</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-lg">
        {/* Date Range Filter */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Ship Date Range</label>
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange?.from && !dateRange?.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from || dateRange?.to ? (
                    <>
                      {dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "From Start"}
                      {" - "}
                      {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "To End"}
                    </>
                  ) : (
                    <span>Select date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Carrier Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Carrier</label>
          <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Carriers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Carriers</SelectItem>
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
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Search */}
        <div className="space-y-2 md:col-span-3">
          <label className="text-sm font-medium">Search by Order ID</label>
          <div className="flex space-x-2">
            <Input 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="flex justify-end items-end">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Recipient Count</TableHead>
              <TableHead>Ship Date</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Tracking Link</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                    <Badge className={`${getStatusBadgeStyle(order.status)} border px-2 py-1 font-medium`}>
                      {order.status === "in-transit" ? "In Transit" : 
                       order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No orders found matching your filters.
                </TableCell>
              </TableRow>
            )}
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
