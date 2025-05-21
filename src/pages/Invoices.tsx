
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle, CircleDollarSign } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Mock invoice data
const mockInvoices = [
  {
    id: "INV-2023-001",
    date: new Date("2023-10-05"),
    giftCount: 25,
    kittingFee: 125.00,
    shipping: 75.50,
    total: 1250.50,
    paymentStatus: "paid"
  },
  {
    id: "INV-2023-002",
    date: new Date("2023-10-12"),
    giftCount: 15,
    kittingFee: 75.00,
    shipping: 45.75,
    total: 845.75,
    paymentStatus: "pending"
  },
  {
    id: "INV-2023-003",
    date: new Date("2023-10-20"),
    giftCount: 50,
    kittingFee: 250.00,
    shipping: 150.25,
    total: 2400.25,
    paymentStatus: "paid"
  },
  {
    id: "INV-2023-004",
    date: new Date("2023-11-02"),
    giftCount: 10,
    kittingFee: 50.00,
    shipping: 35.00,
    total: 585.00,
    paymentStatus: "pending"
  },
  {
    id: "INV-2023-005",
    date: new Date("2023-11-15"),
    giftCount: 30,
    kittingFee: 150.00,
    shipping: 95.00,
    total: 1745.00,
    paymentStatus: "paid"
  }
];

type PaymentStatus = "paid" | "pending";

const Invoices = () => {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Handle pay now action
  const handlePayNow = (invoiceId: string) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, paymentStatus: "paid" as PaymentStatus } 
        : invoice
    ));
  };

  // Filter invoices based on search, date, and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = selectedDate 
      ? invoice.date.toDateString() === selectedDate.toDateString()
      : true;
    
    const matchesStatus = selectedStatus 
      ? invoice.paymentStatus === selectedStatus
      : true;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDate(undefined);
    setSelectedStatus("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices & Payments</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-lg">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search by Invoice #</label>
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Date Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Invoice Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Status</label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 flex items-end">
          <Button variant="outline" onClick={resetFilters} className="w-full">
            Reset Filters
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right"># of Gifts</TableHead>
              <TableHead className="text-right">Kitting Fee</TableHead>
              <TableHead className="text-right">Shipping</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{format(invoice.date, "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">{invoice.giftCount}</TableCell>
                  <TableCell className="text-right">${invoice.kittingFee.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${invoice.shipping.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">${invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {invoice.paymentStatus === "paid" ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" variant="outline">
                        <CheckCircle className="mr-1 h-3 w-3" /> Paid
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" variant="outline">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.paymentStatus === "pending" ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePayNow(invoice.id)}
                      >
                        <CircleDollarSign className="mr-1 h-4 w-4" /> Pay Now
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">Completed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No invoices found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Click "Pay Now" to simulate payment process via Stripe</p>
      </div>
    </div>
  );
};

export default Invoices;
