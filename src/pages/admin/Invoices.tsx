
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import { Eye, Download, Mail, DollarSign, TrendingUp, TrendingDown, FileText, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvoiceDetailsModal from "@/components/invoices/InvoiceDetailsModal";
import { toast } from "sonner";

// Mock data for invoices
const invoices = [
  {
    id: "INV-2023-001",
    client: "Acme Corporation",
    amount: 1250.00,
    date: "2023-11-01",
    giftBoxName: "Premium Gift Box Set",
    giftItems: ["Luxury Candle Set", "Premium Coffee", "Gourmet Chocolates"],
    status: "paid",
    billingTerms: "One-Time Payment"
  },
  {
    id: "INV-2023-002",
    client: "Tech Innovations",
    amount: 890.50,
    date: "2023-10-28",
    giftBoxName: "Custom Corporate Package",
    giftItems: ["Custom Notebooks", "Coffee Mugs", "Tech Accessories"],
    status: "unpaid",
    billingTerms: "Recurring Billing"
  },
  {
    id: "INV-2023-003",
    client: "Global Consulting",
    amount: 2100.00,
    date: "2023-10-20",
    giftBoxName: "Executive Gift Package",
    giftItems: ["Wine Bottle", "Cheese Selection", "Premium Leather Journal"],
    status: "paid",
    billingTerms: "Milestone-Based Payment"
  },
  {
    id: "INV-2023-004",
    client: "StartupX",
    amount: 450.00,
    date: "2023-11-02",
    giftBoxName: "Welcome Kit",
    giftItems: ["Company Swag", "Welcome Guide", "Gift Card"],
    status: "unpaid",
    billingTerms: "One-Time Payment"
  },
  {
    id: "INV-2023-005",
    client: "MegaCorp",
    amount: 5500.00,
    date: "2023-10-15",
    giftBoxName: "Holiday Collection",
    giftItems: ["Holiday Treats", "Festive Candles", "Seasonal Gifts", "Premium Chocolates"],
    status: "overdue",
    billingTerms: "Recurring Billing"
  }
];

const AdminInvoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editBillingTermsOpen, setEditBillingTermsOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<typeof invoices[0] | null>(null);
  const [newBillingTerms, setNewBillingTerms] = useState("");
  const [invoiceList, setInvoiceList] = useState(invoices);

  const filteredInvoices = invoiceList.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewInvoice = (invoice: typeof invoices[0]) => {
    setSelectedInvoice(invoice);
    setIsDetailsModalOpen(true);
  };

  const handleEditBillingTerms = (invoice: typeof invoices[0]) => {
    setEditingInvoice(invoice);
    setNewBillingTerms(invoice.billingTerms);
    setEditBillingTermsOpen(true);
  };

  const handleUpdateBillingTerms = () => {
    if (!editingInvoice) return;

    setInvoiceList(invoiceList.map(invoice => 
      invoice.id === editingInvoice.id 
        ? { ...invoice, billingTerms: newBillingTerms }
        : invoice
    ));
    
    setEditBillingTermsOpen(false);
    setEditingInvoice(null);
    setNewBillingTerms("");
    toast.success('Billing terms updated successfully');
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log(`Downloading invoice ${invoiceId}`);
    // In a real app, this would trigger a PDF download
  };

  const handleSendReminder = (invoiceId: string) => {
    console.log(`Sending reminder for invoice ${invoiceId}`);
    // In a real app, this would send an email reminder
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate totals
  const totalRevenue = invoiceList.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidInvoices = invoiceList.filter(inv => inv.status === 'paid');
  const unpaidInvoices = invoiceList.filter(inv => inv.status === 'unpaid');
  const paidAmount = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const unpaidAmount = unpaidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  const formatGiftBoxWithItems = (giftBoxName: string, giftItems: string[]) => {
    return `${giftBoxName} (${giftItems.join(', ')})`;
  };

  const getBillingTermsColor = (terms: string) => {
    switch (terms) {
      case "One-Time Payment":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Recurring Billing":
        return "bg-green-100 text-green-800 border-green-200";
      case "Milestone-Based Payment":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices & Payments</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${paidAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {paidInvoices.length} invoices
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${unpaidAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {unpaidInvoices.length} invoices
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoiceList.length}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters with Labels */}
      <div className="bg-muted/20 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Search</Label>
            <Input
              placeholder="Search by invoice ID or client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
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
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Gift Box Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Custom Billing Terms</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell className="max-w-xs">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate cursor-help">
                          {formatGiftBoxWithItems(invoice.giftBoxName, invoice.giftItems)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-xs">
                          <p className="font-medium">{invoice.giftBoxName}</p>
                          <p className="text-sm mt-1">Items:</p>
                          <ul className="text-sm">
                            {invoice.giftItems.map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="font-medium">${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={getBillingTermsColor(invoice.billingTerms)}>
                      {invoice.billingTerms}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditBillingTerms(invoice)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell>
                  <Badge className={
                    invoice.status === "paid" 
                      ? "bg-green-500 text-white border-0" 
                      : invoice.status === "overdue"
                      ? "bg-red-500 text-white border-0"
                      : "bg-amber-500 text-white border-0"
                  }>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
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
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
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
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSendReminder(invoice.id)}
                            >
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

      {/* Edit Billing Terms Modal */}
      <Dialog open={editBillingTermsOpen} onOpenChange={setEditBillingTermsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Custom Billing Terms</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="billing-terms">Billing Terms</Label>
              <Select value={newBillingTerms} onValueChange={setNewBillingTerms}>
                <SelectTrigger>
                  <SelectValue placeholder="Select billing terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="One-Time Payment">One-Time Payment</SelectItem>
                  <SelectItem value="Recurring Billing">Recurring Billing</SelectItem>
                  <SelectItem value="Milestone-Based Payment">Milestone-Based Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBillingTermsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBillingTerms}>Update Terms</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <InvoiceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        invoice={selectedInvoice}
      />
    </div>
  );
};

export default AdminInvoices;
