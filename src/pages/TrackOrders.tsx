
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Search, Package, Truck, MapPin, Eye, Calendar, Clock, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import OrderDetailsModal from '@/components/tracking/OrderDetailsModal';

interface SubOrder {
  recipientName: string;
  recipientEmail: string;
  shippingAddress: string;
  deliveryStatus: string;
  estimatedDelivery: string;
  giftBoxContents: string[];
  trackingNumber?: string;
  carrier: string;
}

interface Order {
  id: string;
  orderNumber: string;
  items: string;
  orderDate: string;
  status: 'placed' | 'fulfilled' | 'shipped' | 'delivered';
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingCarrier?: string;
  subOrders: SubOrder[];
  // Additional properties needed for OrderDetailsModal
  recipientCount: number;
  shipDate: Date;
  carrier: string;
  trackingLink: string;
}

const TrackOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderDateRange, setOrderDateRange] = useState<DateRange | undefined>();
  const [deliveryDateRange, setDeliveryDateRange] = useState<DateRange | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Mock orders data with sub-orders
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      items: 'Premium Coffee Set',
      orderDate: '2024-01-15',
      status: 'delivered',
      trackingNumber: 'FX123456789',
      estimatedDelivery: '2024-01-18',
      shippingCarrier: 'FedEx',
      recipientCount: 2,
      shipDate: new Date('2024-01-16'),
      carrier: 'FedEx',
      trackingLink: 'https://fedex.com/track/FX123456789',
      subOrders: [
        {
          recipientName: 'Sarah Johnson',
          recipientEmail: 'sarah@company.com',
          shippingAddress: '123 Main St, New York, NY 10001',
          carrier: 'FedEx',
          deliveryStatus: 'delivered',
          trackingNumber: 'FX123456789',
          estimatedDelivery: '2024-01-18',
          giftBoxContents: ['Premium Coffee', 'Coffee Mug', 'Gourmet Cookies']
        },
        {
          recipientName: 'Mike Davis',
          recipientEmail: 'mike@company.com',
          shippingAddress: '456 Oak Ave, New York, NY 10002',
          carrier: 'FedEx',
          deliveryStatus: 'delivered',
          trackingNumber: 'FX123456790',
          estimatedDelivery: '2024-01-18',
          giftBoxContents: ['Premium Coffee', 'Coffee Mug', 'Gourmet Cookies']
        }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      items: 'Wellness Package',
      orderDate: '2024-01-16',
      status: 'fulfilled',
      trackingNumber: 'UP987654321',
      estimatedDelivery: '2024-01-20',
      shippingCarrier: 'UPS',
      recipientCount: 2,
      shipDate: new Date('2024-01-17'),
      carrier: 'UPS',
      trackingLink: 'https://ups.com/track/UP987654321',
      subOrders: [
        {
          recipientName: 'Michael Chen',
          recipientEmail: 'michael@company.com',
          shippingAddress: '789 Pine St, San Francisco, CA 94102',
          carrier: 'UPS',
          deliveryStatus: 'shipped',
          trackingNumber: 'UP987654321',
          estimatedDelivery: '2024-01-20',
          giftBoxContents: ['Wellness Tea', 'Essential Oils', 'Aromatherapy Candle']
        },
        {
          recipientName: 'Lisa Wong',
          recipientEmail: 'lisa@company.com',
          shippingAddress: '321 Elm St, San Francisco, CA 94103',
          carrier: 'UPS',
          deliveryStatus: 'fulfilled',
          trackingNumber: 'UP987654322',
          estimatedDelivery: '2024-01-21',
          giftBoxContents: ['Wellness Tea', 'Essential Oils', 'Aromatherapy Candle']
        }
      ]
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      items: 'Tech Accessories Kit',
      orderDate: '2024-01-17',
      status: 'shipped',
      trackingNumber: 'DH555666777',
      estimatedDelivery: '2024-01-22',
      shippingCarrier: 'DHL',
      recipientCount: 1,
      shipDate: new Date('2024-01-18'),
      carrier: 'DHL',
      trackingLink: 'https://dhl.com/track/DH555666777',
      subOrders: [
        {
          recipientName: 'John Smith',
          recipientEmail: 'john@company.com',
          shippingAddress: '789 Broadway, Los Angeles, CA 90210',
          carrier: 'DHL',
          deliveryStatus: 'shipped',
          trackingNumber: 'DH555666777',
          estimatedDelivery: '2024-01-22',
          giftBoxContents: ['Wireless Charger', 'Phone Stand', 'USB Cable']
        }
      ]
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      items: 'Holiday Gift Box',
      orderDate: '2024-01-18',
      status: 'placed',
      estimatedDelivery: '2024-01-25',
      recipientCount: 1,
      shipDate: new Date('2024-01-19'),
      carrier: 'USPS',
      trackingLink: 'https://usps.com/track',
      subOrders: [
        {
          recipientName: 'Emma Wilson',
          recipientEmail: 'emma@company.com',
          shippingAddress: '456 Oak Street, Chicago, IL 60601',
          carrier: 'USPS',
          deliveryStatus: 'placed',
          estimatedDelivery: '2024-01-25',
          giftBoxContents: ['Holiday Cookies', 'Festive Ornament', 'Gift Card']
        }
      ]
    }
  ];

  // Calculate overall status based on most delayed sub-order
  const getOverallStatus = (subOrders: SubOrder[]) => {
    const statusPriority = { 'placed': 0, 'fulfilled': 1, 'shipped': 2, 'delivered': 3 };
    const minStatus = Math.min(...subOrders.map(sub => statusPriority[sub.deliveryStatus as keyof typeof statusPriority] || 0));
    return Object.keys(statusPriority).find(key => statusPriority[key as keyof typeof statusPriority] === minStatus) as Order['status'];
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      placed: { color: 'bg-blue-100 text-blue-800', label: 'Placed' },
      fulfilled: { color: 'bg-yellow-100 text-yellow-800', label: 'Fulfilled' },
      shipped: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' }
    };
    
    const config = configs[status as keyof typeof configs];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getCarrierTrackingDisplay = (order: Order) => {
    if (order.shippingCarrier && order.trackingNumber) {
      return `${order.shippingCarrier} – ${order.trackingNumber}`;
    } else if (order.shippingCarrier) {
      return order.shippingCarrier;
    }
    return 'N/A';
  };

  const filteredOrders = orders.filter(order => {
    const overallStatus = getOverallStatus(order.subOrders);
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.subOrders.some(sub => sub.recipientName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || overallStatus === statusFilter;
    
    // Date filtering logic would go here
    let matchesOrderDate = true;
    let matchesDeliveryDate = true;
    
    return matchesSearch && matchesStatus && matchesOrderDate && matchesDeliveryDate;
  });

  // Calculate summary stats
  const summaryStats = {
    placed: filteredOrders.filter(order => getOverallStatus(order.subOrders) === 'placed').length,
    fulfilled: filteredOrders.filter(order => getOverallStatus(order.subOrders) === 'fulfilled').length,
    shipped: filteredOrders.filter(order => getOverallStatus(order.subOrders) === 'shipped').length,
    delivered: filteredOrders.filter(order => getOverallStatus(order.subOrders) === 'delivered').length,
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleExportOrders = () => {
    // Flatten all sub-orders into a single array for export
    const exportData = orders.flatMap(order => 
      order.subOrders.map(subOrder => ({
        'Order ID': order.orderNumber,
        'Recipient Name': subOrder.recipientName,
        'Recipient Email': subOrder.recipientEmail,
        'Shipping Address': subOrder.shippingAddress,
        'Carrier': subOrder.carrier,
        'Tracking Number': subOrder.trackingNumber || 'N/A',
        'Shipment Status': subOrder.deliveryStatus.charAt(0).toUpperCase() + subOrder.deliveryStatus.slice(1),
        'Estimated Delivery': subOrder.estimatedDelivery
      }))
    );

    // Convert to CSV format
    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders-tracking-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Orders exported successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Track Orders</h1>
          <p className="text-gray-600">Monitor the status and delivery progress of your gift orders</p>
        </div>
        <Button onClick={handleExportOrders} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Orders & Tracking Info
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Orders Placed</p>
                <p className="text-2xl font-bold text-blue-600">{summaryStats.placed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Orders Fulfilled</p>
                <p className="text-2xl font-bold text-yellow-600">{summaryStats.fulfilled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Orders Shipped</p>
                <p className="text-2xl font-bold text-purple-600">{summaryStats.shipped}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Orders Delivered</p>
                <p className="text-2xl font-bold text-green-600">{summaryStats.delivered}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by order number or recipient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="placed">Placed</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Date</label>
              <DatePickerWithRange
                date={orderDateRange}
                onDateChange={setOrderDateRange}
                placeholder="Select order date range"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Delivery Date</label>
              <DatePickerWithRange
                date={deliveryDateRange}
                onDateChange={setDeliveryDateRange}
                placeholder="Select delivery date range"
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Overall Status</TableHead>
                <TableHead>Carrier & Tracking</TableHead>
                <TableHead>Est. Delivery</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell 
                    className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => handleViewOrderDetails(order)}
                  >
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{order.subOrders.length} recipients</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{getStatusBadge(getOverallStatus(order.subOrders))}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{getCarrierTrackingDisplay(order)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{order.estimatedDelivery}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewOrderDetails(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={showOrderDetails}
          onClose={() => setShowOrderDetails(false)}
          order={selectedOrder}
        />
      )}
    </div>
  );
};

export default TrackOrders;
