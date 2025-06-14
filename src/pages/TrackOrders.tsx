import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Search, Package, Truck, MapPin, Eye, Calendar, Clock, ChevronDown, ChevronRight, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DateRange } from 'react-day-picker';

interface SubOrder {
  recipientName: string;
  recipientEmail: string;
  address: string;
  carrier: string;
  status: 'placed' | 'fulfilled' | 'shipped' | 'delivered';
  trackingNumber?: string;
  estimatedDelivery: string;
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
}

const TrackOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [orderDateRange, setOrderDateRange] = useState<DateRange | undefined>();
  const [deliveryDateRange, setDeliveryDateRange] = useState<DateRange | undefined>();

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
      subOrders: [
        {
          recipientName: 'Sarah Johnson',
          recipientEmail: 'sarah@company.com',
          address: '123 Main St, New York, NY 10001',
          carrier: 'FedEx',
          status: 'delivered',
          trackingNumber: 'FX123456789',
          estimatedDelivery: '2024-01-18'
        },
        {
          recipientName: 'Mike Davis',
          recipientEmail: 'mike@company.com',
          address: '456 Oak Ave, New York, NY 10002',
          carrier: 'FedEx',
          status: 'delivered',
          trackingNumber: 'FX123456790',
          estimatedDelivery: '2024-01-18'
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
      subOrders: [
        {
          recipientName: 'Michael Chen',
          recipientEmail: 'michael@company.com',
          address: '789 Pine St, San Francisco, CA 94102',
          carrier: 'UPS',
          status: 'shipped',
          trackingNumber: 'UP987654321',
          estimatedDelivery: '2024-01-20'
        },
        {
          recipientName: 'Lisa Wong',
          recipientEmail: 'lisa@company.com',
          address: '321 Elm St, San Francisco, CA 94103',
          carrier: 'UPS',
          status: 'fulfilled',
          trackingNumber: 'UP987654322',
          estimatedDelivery: '2024-01-21'
        }
      ]
    }
  ];

  // Calculate overall status based on most delayed sub-order
  const getOverallStatus = (subOrders: SubOrder[]) => {
    const statusPriority = { 'placed': 0, 'fulfilled': 1, 'shipped': 2, 'delivered': 3 };
    const minStatus = Math.min(...subOrders.map(sub => statusPriority[sub.status]));
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed': return <Package className="h-4 w-4" />;
      case 'fulfilled': return <Clock className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <MapPin className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const overallStatus = getOverallStatus(order.subOrders);
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.subOrders.some(sub => sub.recipientName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || overallStatus === statusFilter;
    
    // Filter by order date range
    let matchesOrderDate = true;
    if (orderDateRange?.from) {
      const orderDate = new Date(order.orderDate);
      matchesOrderDate = orderDate >= orderDateRange.from && 
                        (!orderDateRange.to || orderDate <= orderDateRange.to);
    }
    
    // Filter by delivery date range
    let matchesDeliveryDate = true;
    if (deliveryDateRange?.from && order.estimatedDelivery) {
      const deliveryDate = new Date(order.estimatedDelivery);
      matchesDeliveryDate = deliveryDate >= deliveryDateRange.from && 
                           (!deliveryDateRange.to || deliveryDate <= deliveryDateRange.to);
    }
    
    return matchesSearch && matchesStatus && matchesOrderDate && matchesDeliveryDate;
  });

  // Calculate summary statistics based on filtered orders
  const getSummaryStats = () => {
    const stats = {
      placed: 0,
      fulfilled: 0,
      shipped: 0,
      delivered: 0
    };

    filteredOrders.forEach(order => {
      const status = getOverallStatus(order.subOrders);
      switch (status) {
        case 'placed':
          stats.placed++;
          break;
        case 'fulfilled':
          stats.fulfilled++;
          break;
        case 'shipped':
          stats.shipped++;
          break;
        case 'delivered':
          stats.delivered++;
          break;
      }
    });

    return stats;
  };

  const summaryStats = getSummaryStats();

  const handleViewTimeline = (order: Order) => {
    setSelectedOrder(order);
    setShowTimeline(true);
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const renderTimeline = (order: Order) => {
    return (
      <div className="space-y-6">
        {order.subOrders.map((subOrder, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{subOrder.recipientName}</span>
              <span className="text-sm text-gray-500">({subOrder.recipientEmail})</span>
            </div>
            
            <div className="space-y-3 ml-6">
              {[
                { status: 'placed', label: 'Order Placed', date: order.orderDate, completed: true },
                { status: 'fulfilled', label: 'Order Fulfilled', date: '2024-01-17', completed: ['fulfilled', 'shipped', 'delivered'].includes(subOrder.status) },
                { status: 'shipped', label: 'Shipped', date: '2024-01-18', completed: ['shipped', 'delivered'].includes(subOrder.status) },
                { status: 'delivered', label: 'Delivered', date: subOrder.estimatedDelivery, completed: subOrder.status === 'delivered' }
              ].map((step, stepIndex) => (
                <div key={stepIndex} className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.label}
                      </span>
                      <span className="text-xs text-gray-500">{step.date}</span>
                    </div>
                    {step.status === 'shipped' && subOrder.trackingNumber && (
                      <div className="text-xs text-gray-600 mt-1">
                        Tracking: {subOrder.trackingNumber} ({subOrder.carrier})
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Track Orders</h1>
          <p className="text-gray-600">Monitor the status and delivery progress of your gift orders</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orders Placed</p>
                <p className="text-2xl font-bold">{summaryStats.placed}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orders Fulfilled</p>
                <p className="text-2xl font-bold">{summaryStats.fulfilled}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orders Shipped</p>
                <p className="text-2xl font-bold">{summaryStats.shipped}</p>
              </div>
              <Truck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orders Delivered</p>
                <p className="text-2xl font-bold">{summaryStats.delivered}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-500" />
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
                  placeholder="Search by order number or recipient name..."
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

            <div className="space-y-2">
              <Label className="text-sm font-medium">Order Date</Label>
              <DatePickerWithRange
                date={orderDateRange}
                onDateChange={setOrderDateRange}
                placeholder="Select order date range"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Estimated Delivery Date</Label>
              <DatePickerWithRange
                date={deliveryDateRange}
                onDateChange={setDeliveryDateRange}
                placeholder="Select delivery date range"
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
                <TableHead className="w-10"></TableHead>
                <TableHead>Order Number</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Overall Status</TableHead>
                <TableHead>Est. Delivery</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  {/* Main Order Row */}
                  <TableRow>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="p-0 h-6 w-6"
                      >
                        {expandedOrders.has(order.id) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{order.subOrders.length} recipients</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>{getStatusBadge(getOverallStatus(order.subOrders))}</TableCell>
                    <TableCell>{order.estimatedDelivery}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTimeline(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {/* Sub-Order Details Rows */}
                  {expandedOrders.has(order.id) && order.subOrders.map((subOrder, index) => (
                    <TableRow key={`${order.id}-${index}`} className="bg-gray-50/50 border-l-4 border-l-blue-200">
                      <TableCell></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 pl-4">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">{subOrder.recipientName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{subOrder.recipientEmail}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {subOrder.address}
                        </div>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell>{getStatusBadge(subOrder.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {subOrder.estimatedDelivery}
                        </div>
                      </TableCell>
                      <TableCell>
                        {subOrder.trackingNumber && (
                          <div className="text-xs text-gray-500">
                            {subOrder.trackingNumber}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Timeline Modal */}
      <Dialog open={showTimeline} onOpenChange={setShowTimeline}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Timeline - {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="font-medium">{selectedOrder.orderNumber}</div>
                <div className="text-sm text-gray-600">Items: {selectedOrder.items}</div>
                <div className="text-sm text-gray-600">{selectedOrder.subOrders.length} recipients</div>
              </div>
              
              {renderTimeline(selectedOrder)}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrackOrders;
