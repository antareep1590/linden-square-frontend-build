
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Download, 
  CreditCard, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Eye,
  DollarSign,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  issueDate: string;
  dueDate: string;
  paymentSchedule: 'one-time' | 'monthly' | 'quarterly' | 'milestone';
  nextDueDate?: string;
  milestone?: string;
}

const Invoices = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scheduleFilter, setScheduleFilter] = useState('all');
  const [dueDateFilter, setDueDateFilter] = useState('all');

  // Mock invoices data
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      orderNumber: 'ORD-2024-001',
      amount: 75.00,
      status: 'paid',
      issueDate: '2024-01-15',
      dueDate: '2024-01-30',
      paymentSchedule: 'one-time'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      orderNumber: 'ORD-2024-002',
      amount: 120.00,
      status: 'pending',
      issueDate: '2024-01-16',
      dueDate: '2024-01-31',
      paymentSchedule: 'monthly',
      nextDueDate: '2024-02-28'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      orderNumber: 'ORD-2024-003',
      amount: 45.00,
      status: 'overdue',
      issueDate: '2024-01-10',
      dueDate: '2024-01-25',
      paymentSchedule: 'one-time'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      orderNumber: 'ORD-2024-004',
      amount: 85.00,
      status: 'pending',
      issueDate: '2024-01-18',
      dueDate: '2024-02-15',
      paymentSchedule: 'milestone',
      milestone: '50% upfront'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const configs = {
      paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      overdue: { color: 'bg-red-100 text-red-800', label: 'Overdue' }
    };
    
    const config = configs[status as keyof typeof configs];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentScheduleBadge = (schedule: string) => {
    const configs = {
      'one-time': { color: 'bg-blue-100 text-blue-800', label: 'One-time' },
      'monthly': { color: 'bg-purple-100 text-purple-800', label: 'Monthly' },
      'quarterly': { color: 'bg-orange-100 text-orange-800', label: 'Quarterly' },
      'milestone': { color: 'bg-cyan-100 text-cyan-800', label: 'Milestone' }
    };
    
    const config = configs[schedule as keyof typeof configs];
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const handleScheduleChange = (invoiceId: string, newSchedule: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, paymentSchedule: newSchedule as Invoice['paymentSchedule'] }
        : inv
    ));
    toast.success('Payment schedule updated');
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesSchedule = scheduleFilter === 'all' || invoice.paymentSchedule === scheduleFilter;
    const matchesDueDate = dueDateFilter === 'all' || 
      (dueDateFilter === 'thisWeek' && new Date(invoice.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) ||
      (dueDateFilter === 'thisMonth' && new Date(invoice.dueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus && matchesSchedule && matchesDueDate;
  });

  const handleViewInvoice = (invoice: Invoice) => {
    navigate(`/view-invoice/${invoice.id}`);
  };

  const handlePayNow = (invoice: Invoice) => {
    if (invoice.paymentSchedule === 'one-time' || invoice.status === 'overdue') {
      navigate('/payment-method', { state: { invoiceId: invoice.id, amount: invoice.amount } });
    } else {
      toast.info('Payment not currently due for this schedule');
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.success(`Downloaded ${invoice.invoiceNumber}`);
  };

  // Calculate summary stats
  const totalAmountPaid = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalAmountDue = filteredInvoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);
  const paidInvoices = filteredInvoices.filter(inv => inv.status === 'paid').length;
  const totalInvoices = filteredInvoices.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices & Payments</h1>
          <p className="text-gray-600">Manage your payment history and outstanding invoices</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Amount Paid</p>
                <p className="text-xl font-bold">${totalAmountPaid.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Total Amount Due</p>
                <p className="text-xl font-bold">${totalAmountDue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Paid Invoices</p>
                <p className="text-xl font-bold">{paidInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-xl font-bold">{totalInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Payment Schedule</Label>
              <Select value={scheduleFilter} onValueChange={setScheduleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Schedules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schedules</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Due Date</Label>
              <Select value={dueDateFilter} onValueChange={setDueDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Due Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Due Dates</SelectItem>
                  <SelectItem value="thisWeek">Due This Week</SelectItem>
                  <SelectItem value="thisMonth">Due This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Order #</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Schedule</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.orderNumber}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Select 
                        value={invoice.paymentSchedule} 
                        onValueChange={(value) => handleScheduleChange(invoice.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-time">One-time</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="milestone">Milestone</SelectItem>
                        </SelectContent>
                      </Select>
                      {invoice.milestone && (
                        <div className="text-xs text-gray-500">{invoice.milestone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>
                    {invoice.nextDueDate ? (
                      <div className="text-sm">{invoice.nextDueDate}</div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewInvoice(invoice)}
                        title="View Invoice"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice)}
                        title="Download Invoice"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      {(invoice.status === 'pending' || invoice.status === 'overdue') && 
                       (invoice.paymentSchedule === 'one-time' || invoice.status === 'overdue') && (
                        <Button
                          size="sm"
                          onClick={() => handlePayNow(invoice)}
                          className="bg-linden-blue hover:bg-linden-blue/90"
                          title="Pay Now"
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoices;
