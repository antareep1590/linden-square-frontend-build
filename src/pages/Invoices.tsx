
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Search, Download, Eye, Filter, Calendar, CheckCircle, Clock, AlertTriangle, FileEdit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  description: string;
  orderCount: number;
  recipientCount: number;
}

const Invoices = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock invoices data
  const [invoices] = useState<Invoice[]>([
    {
      id: 'INV-2024-001',
      date: '2024-03-15',
      amount: 2750.00,
      status: 'paid',
      description: 'Q1 Employee Recognition Gift Boxes',
      orderCount: 3,
      recipientCount: 45
    },
    {
      id: 'INV-2024-002',
      date: '2024-03-10',
      amount: 1850.50,
      status: 'pending',
      description: 'Client Appreciation Packages',
      orderCount: 2,
      recipientCount: 28
    },
    {
      id: 'INV-2024-003',
      date: '2024-02-28',
      amount: 950.75,
      status: 'paid',
      description: 'New Employee Welcome Boxes',
      orderCount: 1,
      recipientCount: 15
    },
    {
      id: 'INV-2024-004',
      date: '2024-02-15',
      amount: 3200.00,
      status: 'overdue',
      description: 'Holiday Gift Campaign',
      orderCount: 4,
      recipientCount: 60
    },
    {
      id: 'INV-2024-005',
      date: '2024-02-05',
      amount: 1275.25,
      status: 'draft',
      description: 'Sales Team Rewards',
      orderCount: 2,
      recipientCount: 22
    }
  ]);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesDate = dateFilter === 'all' || invoice.date.includes(dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          icon: CheckCircle,
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
          iconColor: 'text-green-600'
        };
      case 'pending':
        return {
          icon: Clock,
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
          iconColor: 'text-yellow-600'
        };
      case 'overdue':
        return {
          icon: AlertTriangle,
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
          iconColor: 'text-red-600'
        };
      case 'draft':
        return {
          icon: FileEdit,
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
          iconColor: 'text-gray-600'
        };
      default:
        return {
          icon: FileEdit,
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
          iconColor: 'text-gray-600'
        };
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = getStatusConfig(status);
    const IconComponent = config.icon;
    
    return (
      <Badge className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors ${config.className}`}>
        <IconComponent className={`h-3.5 w-3.5 ${config.iconColor}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/view-invoice/${invoiceId}`);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // Mock download functionality
    console.log(`Downloading invoice ${invoiceId}`);
  };

  const getTotalAmount = () => {
    return filteredInvoices.reduce((total, invoice) => total + invoice.amount, 0);
  };

  const getStatusCounts = () => {
    return filteredInvoices.reduce((acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-gray-600">Manage your billing and payment history</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold">${getTotalAmount().toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.paid || 0}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.overdue || 0}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
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
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="2024-03">March 2024</SelectItem>
                  <SelectItem value="2024-02">February 2024</SelectItem>
                  <SelectItem value="2024-01">January 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDateFilter('all');
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell className="max-w-48">
                      <span className="truncate">{invoice.description}</span>
                    </TableCell>
                    <TableCell>{invoice.orderCount}</TableCell>
                    <TableCell>{invoice.recipientCount}</TableCell>
                    <TableCell className="font-medium">${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Your invoices will appear here once you place orders'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoices;
