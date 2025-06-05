
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Download, Mail, CheckCircle, Clock, FileText } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Mock data for invoices with gift box items
const invoices = [
  {
    id: "INV-2023-001",
    client: "Acme Corporation",
    amount: 1250.00,
    date: "2023-11-01",
    giftBoxItems: "Premium Gift Box Set (Premium Coffee Set, Gourmet Chocolate Box, Scented Candle)",
    status: "paid"
  },
  {
    id: "INV-2023-002",
    client: "Tech Innovations",
    amount: 890.50,
    date: "2023-10-28",
    giftBoxItems: "Custom Corporate Gifts (Tech Accessories Kit, Premium Notebook Set, Wellness Kit)",
    status: "unpaid"
  },
  {
    id: "INV-2023-003",
    client: "Global Consulting",
    amount: 2100.00,
    date: "2023-10-20",
    giftBoxItems: "Executive Gift Package (Executive Pen Set, Premium Coffee, Business Card Holder)",
    status: "paid"
  },
  {
    id: "INV-2023-004",
    client: "StartupX",
    amount: 450.00,
    date: "2023-11-02",
    giftBoxItems: "Welcome Kit (Welcome Guide, Company Swag, Gift Card)",
    status: "unpaid"
  },
  {
    id: "INV-2023-005",
    client: "MegaCorp",
    amount: 5500.00,
    date: "2023-10-15",
    giftBoxItems: "Holiday Collection (Holiday Treats, Seasonal Decor, Gift Baskets)",
    status: "overdue"
  }
];

const Invoices = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<any>(null);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/invoices/${invoiceId}`);
  };

  // Calculate totals
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalDue = invoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices & Payments</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From completed orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount Due</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalDue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Outstanding payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {invoices.filter(inv => inv.status === 'paid').length}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-lg">
        <Input
          placeholder="Search by client name or invoice ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        <DatePickerWithRange
          date={dateRange}
          onDateChange={setDateRange}
          placeholder="Date of Invoice"
        />

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Gift Box Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="text-sm text-gray-600 truncate" title={invoice.giftBoxItems}>
                    {invoice.giftBoxItems}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={
                    invoice.status === "paid" 
                      ? "bg-green-500 text-white" 
                      : invoice.status === "overdue"
                      ? "bg-red-500 text-white"
                      : "bg-amber-500 text-white"
                  }>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewInvoice(invoice.id)}
                          >
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
                    
                    {invoice.status === 'unpaid' && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Send Reminder</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
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

export default Invoices;
