
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle, CircleDollarSign, FileText, PlusCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Label } from '@/components/ui/label';
import { DateRange } from "react-day-picker";

type PaymentStatus = "paid" | "pending";

interface Invoice {
  id: string;
  date: Date;
  giftCount: number;
  kittingFee: number;
  shipping: number;
  total: number;
  paymentStatus: PaymentStatus;
  clientName?: string;
}

// Mock invoice data
const mockInvoices: Invoice[] = [
  {
    id: "INV-2023-001",
    date: new Date("2023-10-05"),
    giftCount: 25,
    kittingFee: 125.00,
    shipping: 75.50,
    total: 1250.50,
    paymentStatus: "paid",
    clientName: "Acme Corporation"
  },
  {
    id: "INV-2023-002",
    date: new Date("2023-10-12"),
    giftCount: 15,
    kittingFee: 75.00,
    shipping: 45.75,
    total: 845.75,
    paymentStatus: "pending",
    clientName: "Widget Industries"
  },
  {
    id: "INV-2023-003",
    date: new Date("2023-10-20"),
    giftCount: 50,
    kittingFee: 250.00,
    shipping: 150.25,
    total: 2400.25,
    paymentStatus: "paid",
    clientName: "Globex Corporation"
  },
  {
    id: "INV-2023-004",
    date: new Date("2023-11-02"),
    giftCount: 10,
    kittingFee: 50.00,
    shipping: 35.00,
    total: 585.00,
    paymentStatus: "pending",
    clientName: "Massive Dynamic"
  },
  {
    id: "INV-2023-005",
    date: new Date("2023-11-15"),
    giftCount: 30,
    kittingFee: 150.00,
    shipping: 95.00,
    total: 1745.00,
    paymentStatus: "paid",
    clientName: "Umbrella Corporation"
  }
];

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  });
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isGenerateInvoiceOpen, setIsGenerateInvoiceOpen] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState({
    clientName: "",
    giftCount: 0,
    kittingFee: 0,
    shipping: 0
  });

  // Handle pay now action
  const handlePayNow = (invoiceId: string) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, paymentStatus: "paid" } 
        : invoice
    ));
  };
  
  // Handle new invoice changes
  const handleNewInvoiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewInvoiceData({
      ...newInvoiceData,
      [name]: name === "clientName" ? value : Number(value)
    });
  };
  
  // Generate new invoice
  const handleGenerateInvoice = () => {
    const total = newInvoiceData.kittingFee + newInvoiceData.shipping + (newInvoiceData.giftCount * 40); // Assuming $40 per gift
    const newInvoice: Invoice = {
      id: `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`,
      date: new Date(),
      giftCount: newInvoiceData.giftCount,
      kittingFee: newInvoiceData.kittingFee,
      shipping: newInvoiceData.shipping,
      total: total,
      paymentStatus: "pending",
      clientName: newInvoiceData.clientName
    };
    
    setInvoices([newInvoice, ...invoices]);
    setIsGenerateInvoiceOpen(false);
    
    // Reset form
    setNewInvoiceData({
      clientName: "",
      giftCount: 0,
      kittingFee: 0,
      shipping: 0
    });
  };

  // Filter invoices based on search, date range, and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (invoice.clientName && invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Date range filter
    const matchesDateRange = (!dateRange?.from || invoice.date >= dateRange.from) && 
                             (!dateRange?.to || invoice.date <= dateRange.to);
    
    const matchesStatus = selectedStatus === "all" || invoice.paymentStatus === selectedStatus;
    
    return matchesSearch && matchesDateRange && matchesStatus;
  });

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setDateRange({from: undefined, to: undefined});
    setSelectedStatus("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices & Payments</h1>
        <Dialog open={isGenerateInvoiceOpen} onOpenChange={setIsGenerateInvoiceOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Generate Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Generate New Invoice</DialogTitle>
              <DialogDescription>
                Create a new invoice for a completed order or delivery.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client</Label>
                <Select name="clientName" onValueChange={(value) => {
                  setNewInvoiceData({...newInvoiceData, clientName: value});
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
                    <SelectItem value="Widget Industries">Widget Industries</SelectItem>
                    <SelectItem value="Globex Corporation">Globex Corporation</SelectItem>
                    <SelectItem value="Massive Dynamic">Massive Dynamic</SelectItem>
                    <SelectItem value="Umbrella Corporation">Umbrella Corporation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="giftCount">Number of Gifts</Label>
                  <Input
                    id="giftCount"
                    name="giftCount"
                    type="number"
                    min="1"
                    value={newInvoiceData.giftCount.toString()}
                    onChange={handleNewInvoiceChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kittingFee">Kitting Fee ($)</Label>
                  <Input
                    id="kittingFee"
                    name="kittingFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newInvoiceData.kittingFee.toString()}
                    onChange={handleNewInvoiceChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping">Shipping ($)</Label>
                <Input
                  id="shipping"
                  name="shipping"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newInvoiceData.shipping.toString()}
                  onChange={handleNewInvoiceChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Total</Label>
                <div className="py-2 px-3 bg-muted rounded-md font-medium">
                  ${(newInvoiceData.kittingFee + newInvoiceData.shipping + (newInvoiceData.giftCount * 40)).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Gift price calculated at $40 per unit</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGenerateInvoiceOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleGenerateInvoice}
                disabled={!newInvoiceData.clientName || newInvoiceData.giftCount <= 0}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-lg">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search by Invoice # or Client</label>
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Date Range Filter */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Invoice Date Range</label>
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
                      {dateRange.from ? format(dateRange.from, "PPP") : "From Start"}
                      {" - "}
                      {dateRange.to ? format(dateRange.to, "PPP") : "To End"}
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
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Status</label>
          <div className="flex items-center gap-2">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={resetFilters} className="whitespace-nowrap">
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
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
                  <TableCell>{invoice.clientName}</TableCell>
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
                <TableCell colSpan={9} className="text-center py-4">
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
