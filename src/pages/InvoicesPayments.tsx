
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Download, Eye, Filter, Search, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  recipient: string;
  description: string;
}

const InvoicesPayments = () => {
  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      dueDate: '2024-02-14',
      amount: 2450.00,
      status: 'paid',
      recipient: 'Acme Corporation',
      description: 'Premium Coffee Collection - 25 recipients'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      orderNumber: 'ORD-2024-002',
      date: '2024-02-01',
      dueDate: '2024-03-03',
      amount: 1890.00,
      status: 'pending',
      recipient: 'Tech Solutions Inc.',
      description: 'Wellness Package - 18 recipients'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      orderNumber: 'ORD-2024-003',
      date: '2024-02-15',
      dueDate: '2024-03-17',
      amount: 3200.00,
      status: 'overdue',
      recipient: 'Global Enterprises',
      description: 'Executive Appreciation - 30 recipients'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      orderNumber: 'ORD-2024-004',
      date: '2024-03-01',
      dueDate: '2024-03-31',
      amount: 1575.00,
      status: 'draft',
      recipient: 'StartUp Co.',
      description: 'Welcome Package - 15 recipients'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.success(`Downloading ${invoice.invoiceNumber}`);
    // In a real app, this would trigger PDF download
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const calculateTotals = () => {
    return filteredInvoices.reduce((acc, invoice) => {
      acc.total += invoice.amount;
      if (invoice.status === 'paid') acc.paid += invoice.amount;
      if (invoice.status === 'pending') acc.pending += invoice.amount;
      if (invoice.status === 'overdue') acc.overdue += invoice.amount;
      return acc;
    }, { total: 0, paid: 0, pending: 0, overdue: 0 });
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices & Payments</h1>
          <p className="text-gray-600">Manage billing and track payment status</p>
        </div>
        <Button className="bg-linden-blue hover:bg-linden-blue/90">
          <CreditCard className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Total Amount</span>
            </div>
            <p className="text-2xl font-bold mt-1">${totals.total.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Paid</span>
            </div>
            <p className="text-2xl font-bold mt-1 text-green-600">${totals.paid.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <p className="text-2xl font-bold mt-1 text-yellow-600">${totals.pending.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Overdue</span>
            </div>
            <p className="text-2xl font-bold mt-1 text-red-600">${totals.overdue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Invoices ({filteredInvoices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.orderNumber}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>{invoice.recipient}</TableCell>
                    <TableCell className="font-medium">${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(invoice.status)} border-0`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>No invoices found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Detail Modal */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details - {selectedInvoice?.invoiceNumber}</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Invoice Number</label>
                  <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Number</label>
                  <p className="font-medium">{selectedInvoice.orderNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p>{selectedInvoice.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Due Date</label>
                  <p>{selectedInvoice.dueDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Recipient</label>
                  <p>{selectedInvoice.recipient}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge className={`${getStatusColor(selectedInvoice.status)} border-0`}>
                    {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p>{selectedInvoice.description}</p>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold text-linden-blue">
                    ${selectedInvoice.amount.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedInvoice(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoicesPayments;
