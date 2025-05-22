
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
import { Calendar as CalendarIcon, CheckCircle, CircleDollarSign, Download, Mail, FileText, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock clients data
const mockClients = [
  { id: "client-1", name: "Acme Corporation" },
  { id: "client-2", name: "Global Industries" },
  { id: "client-3", name: "Tech Innovations" },
  { id: "client-4", name: "Modern Solutions" },
  { id: "client-5", name: "Creative Designs" },
];

type InvoiceStatus = "paid" | "pending";

type Invoice = {
  id: string;
  clientId: string;
  date: Date;
  giftCount: number;
  kittingFee: number;
  shipping: number;
  total: number;
  status: InvoiceStatus;
};

// Mock invoice data
const mockInvoices: Invoice[] = [
  {
    id: "INV-2023-001",
    clientId: "client-1",
    date: new Date("2023-10-05"),
    giftCount: 25,
    kittingFee: 125.00,
    shipping: 75.50,
    total: 1250.50,
    status: "paid"
  },
  {
    id: "INV-2023-002",
    clientId: "client-2",
    date: new Date("2023-10-12"),
    giftCount: 15,
    kittingFee: 75.00,
    shipping: 45.75,
    total: 845.75,
    status: "pending"
  },
  {
    id: "INV-2023-003",
    clientId: "client-3",
    date: new Date("2023-10-20"),
    giftCount: 50,
    kittingFee: 250.00,
    shipping: 150.25,
    total: 2400.25,
    status: "paid"
  },
  {
    id: "INV-2023-004",
    clientId: "client-4",
    date: new Date("2023-11-02"),
    giftCount: 10,
    kittingFee: 50.00,
    shipping: 35.00,
    total: 585.00,
    status: "pending"
  },
  {
    id: "INV-2023-005",
    clientId: "client-5",
    date: new Date("2023-11-15"),
    giftCount: 30,
    kittingFee: 150.00,
    shipping: 95.00,
    total: 1745.00,
    status: "paid"
  },
  {
    id: "INV-2023-006",
    clientId: "client-1",
    date: new Date("2023-11-20"),
    giftCount: 35,
    kittingFee: 175.00,
    shipping: 105.00,
    total: 1850.00,
    status: "pending"
  }
];

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Get client name by ID
  const getClientName = (clientId: string) => {
    return mockClients.find(client => client.id === clientId)?.name || "Unknown Client";
  };

  // Handle mark as paid action
  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, status: "paid" as InvoiceStatus } 
        : invoice
    ));
    
    toast.success(`Invoice ${invoiceId} marked as paid`);
  };

  // Handle download invoice action
  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}`);
    // In a real application, this would download the invoice PDF
  };

  // Handle resend invoice email action
  const handleResendInvoice = (invoiceId: string) => {
    toast.success(`Invoice ${invoiceId} has been resent to client's email`);
    // In a real application, this would trigger an email sending process
  };

  // Filter invoices based on search, client, date, and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClient = selectedClient 
      ? invoice.clientId === selectedClient
      : true;
    
    const matchesDate = selectedDate 
      ? invoice.date.toDateString() === selectedDate.toDateString()
      : true;
    
    const matchesStatus = selectedStatus 
      ? invoice.status === selectedStatus
      : true;
    
    return matchesSearch && matchesClient && matchesDate && matchesStatus;
  });

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedClient(null);
    setSelectedDate(undefined);
    setSelectedStatus(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices & Payments</h1>
        <Button onClick={() => toast.info("Generate new invoice functionality to be implemented")}>
          <FileText className="mr-2 h-4 w-4" /> Generate Invoice
        </Button>
      </div>

      <div className="bg-muted/20 p-4 rounded-lg">
        <div className="flex items-center mb-4">
          <Filter className="mr-2 h-5 w-5" />
          <h2 className="text-lg font-medium">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search by Invoice #</label>
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Client Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Client</label>
            <Select value={selectedClient || "all"} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {mockClients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select value={selectedStatus || "all"} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
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
      </div>

      <div className="rounded-md border">
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
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{getClientName(invoice.clientId)}</TableCell>
                  <TableCell>{format(invoice.date, "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">{invoice.giftCount}</TableCell>
                  <TableCell className="text-right">${invoice.kittingFee.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${invoice.shipping.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">${invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {invoice.status === "paid" ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-transparent">
                        <CheckCircle className="mr-1 h-3 w-3" /> Paid
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-transparent">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        title="Download Invoice"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleResendInvoice(invoice.id)}
                        title="Resend Invoice Email"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                      {invoice.status === "pending" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkAsPaid(invoice.id)}
                          title="Mark as Paid"
                          className="text-green-600"
                        >
                          <CircleDollarSign className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
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
    </div>
  );
};

export default AdminInvoices;
