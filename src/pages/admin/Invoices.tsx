
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, Download, Eye, Send } from "lucide-react";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  issueDate: Date;
  dueDate: Date;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-2023-001',
    customerName: 'Acme Corp',
    customerEmail: 'billing@acmecorp.com',
    amount: 1250.00,
    status: 'paid',
    issueDate: new Date('2023-11-01'),
    dueDate: new Date('2023-11-15'),
    items: [
      { description: 'Corporate Gift Boxes (Premium)', quantity: 25, unitPrice: 45.00, total: 1125.00 },
      { description: 'Gift Wrapping Service', quantity: 25, unitPrice: 5.00, total: 125.00 }
    ]
  },
  {
    id: 'INV-2023-002',
    customerName: 'Tech Innovations',
    customerEmail: 'finance@techinnovations.com',
    amount: 875.50,
    status: 'pending',
    issueDate: new Date('2023-11-10'),
    dueDate: new Date('2023-11-24'),
    items: [
      { description: 'Holiday Gift Collection', quantity: 15, unitPrice: 52.50, total: 787.50 },
      { description: 'Express Shipping', quantity: 1, unitPrice: 88.00, total: 88.00 }
    ]
  },
  {
    id: 'INV-2023-003',
    customerName: 'Global Consulting',
    customerEmail: 'accounts@globalconsulting.com',
    amount: 2100.00,
    status: 'overdue',
    issueDate: new Date('2023-10-15'),
    dueDate: new Date('2023-10-29'),
    items: [
      { description: 'Executive Gift Package', quantity: 40, unitPrice: 50.00, total: 2000.00 },
      { description: 'Custom Packaging', quantity: 40, unitPrice: 2.50, total: 100.00 }
    ]
  }
];

const statusColors = {
  paid: 'bg-green-500',
  pending: 'bg-yellow-500',
  overdue: 'bg-red-500',
  draft: 'bg-gray-500'
};

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customerName: '',
    customerEmail: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }]
  });

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    let matchesDateRange = true;
    if (dateRange?.from) {
      matchesDateRange = invoice.issueDate >= dateRange.from;
    }
    if (dateRange?.to && matchesDateRange) {
      matchesDateRange = invoice.issueDate <= dateRange.to;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleGenerateInvoice = () => {
    if (!newInvoice.customerName || !newInvoice.customerEmail || !newInvoice.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const invoiceItems = newInvoice.items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));

    const totalAmount = invoiceItems.reduce((sum, item) => sum + item.total, 0);

    const invoice: Invoice = {
      id: `INV-2023-${String(invoices.length + 1).padStart(3, '0')}`,
      customerName: newInvoice.customerName,
      customerEmail: newInvoice.customerEmail,
      amount: totalAmount,
      status: 'draft',
      issueDate: new Date(),
      dueDate: new Date(newInvoice.dueDate),
      items: invoiceItems
    };

    setInvoices([...invoices, invoice]);
    setNewInvoice({
      customerName: '',
      customerEmail: '',
      dueDate: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }]
    });
    setIsGenerateModalOpen(false);
    toast.success("Invoice generated successfully");
  };

  const addInvoiceItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { description: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const updatedItems = newInvoice.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setNewInvoice({ ...newInvoice, items: updatedItems });
  };

  const removeInvoiceItem = (index: number) => {
    if (newInvoice.items.length > 1) {
      const updatedItems = newInvoice.items.filter((_, i) => i !== index);
      setNewInvoice({ ...newInvoice, items: updatedItems });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices & Payments</h1>
        <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Generate Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate New Invoice</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    placeholder="Enter customer name"
                    value={newInvoice.customerName}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Customer Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="Enter customer email"
                    value={newInvoice.customerEmail}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customerEmail: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                />
              </div>

              {/* Invoice Items */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Invoice Items</Label>
                  <Button type="button" variant="outline" onClick={addInvoiceItem}>
                    Add Item
                  </Button>
                </div>
                
                {newInvoice.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Unit Price"
                        value={item.unitPrice}
                        onChange={(e) => updateInvoiceItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-1">
                      <span className="text-sm font-medium">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </span>
                    </div>
                    <div className="col-span-1">
                      {newInvoice.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInvoiceItem(index)}
                          className="text-red-600"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="text-right">
                <div className="text-lg font-semibold">
                  Total: {formatCurrency(newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGenerateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerateInvoice}>
                Generate Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-muted/20 p-4 rounded-lg">
        <div className="flex-1">
          <Input
            placeholder="Search invoices by customer name or invoice ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-64 justify-start text-left font-normal",
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

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{invoice.customerName}</p>
                    <p className="text-sm text-gray-500">{invoice.customerEmail}</p>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(invoice.amount)}
                </TableCell>
                <TableCell>{format(invoice.issueDate, 'MMM d, yyyy')}</TableCell>
                <TableCell>{format(invoice.dueDate, 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <Badge className={`${statusColors[invoice.status]} text-white border-0 capitalize`}>
                    {invoice.status}
                  </Badge>
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
                          <p>View Invoice</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download PDF</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Send Reminder</p>
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

      {filteredInvoices.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium mb-2">No invoices found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or generate a new invoice.</p>
        </div>
      )}
    </div>
  );
};

export default AdminInvoices;
